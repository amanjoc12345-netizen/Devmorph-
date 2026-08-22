import User from "../models/User.js";
import WebsiteProject from "../models/WebsiteProject.js";
import openai from "../config/openai.js";
import { GoogleGenAI } from '@google/genai'
import "dotenv/config";
import Payment from "../models/Payment.js";
import { creditPlans } from "../config/creditPlans.js";

/* =========================
   Get User Credits
========================= */
export const getUserCredits = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("credits");

    res.json({ credits: user?.credits || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Create New Project
========================= */
export const createUserProject = async (req, res) => {
  const userId = req.userId;
  try {
    const { initial_prompt } = req.body;


    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!initial_prompt || !initial_prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const user = await User.findById(userId);

    if (!user || user.credits < 5) {
      return res
        .status(403)
        .json({ message: "Add credits to create more projects" });
    }

    const project = await WebsiteProject.create({
      name:
        initial_prompt.length > 50
          ? initial_prompt.substring(0, 47) + "..."
          : initial_prompt,
      initial_prompt,
      userId,
      conversations: [
        {
          role: "user",
          content: initial_prompt,
        },
      ],
    });



    /* ===== Prompt Enhancement ===== */

    /* ===== Prompt Enhancement ===== */

    async function generateAIResponse(promptText) {
      try {
        if (process.env.GEMNI && process.env.GEMNI !== "dummy_gemini_key") {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMNI });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [{ text: promptText }]
              }
            ],
          });
          return response.text?.trim() || null;
        }
      } catch (err) {
        console.warn("Gemini prompt enhancement failed, using LLM7 fallback...", err.message);
      }

      try {
        const response = await openai.chat.completions.create({
          model: process.env.AI_MODEL || "codestral-latest",
          messages: [{ role: "user", content: promptText }]
        });
        return response.choices?.[0]?.message?.content?.trim() || null;
      } catch (error) {
        console.error("AI enhancement fallback error:", error.message);
        return null;
      }
    }


    const prompt = `You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

    Enhance this prompt by:
    1. Adding specific design details (layout, color scheme, typography)
    2. Specifying key sections and features
    3. Describing the user experience and interactions
    4. Including modern web design best practices
    5. Mentioning responsive design requirements
    6. Adding any missing but important elements
 
here is user prompt ${initial_prompt}    
Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (1-2 paragraphs max).`;

    const enhanceResponse = await generateAIResponse(prompt);
    const enhancedPrompt = enhanceResponse || initial_prompt;

    project.conversations.push(
      {
        role: "assistant",
        content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
      },
      {
        role: "assistant",
        content: "Now generating your website...",
      }
    );


    await project.save();

    return res.status(201).json({
      success: true,
      enhanceResponse: enhancedPrompt,
      project,
      message: 'Enhanced prompt successfully',
    });


  } catch (error) {
    await User.findByIdAndUpdate(userId, {
      $inc: { credits: 5 },
    });

    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Create Project Code
========================= */
export const createProjectCode = async (req, res) => {
  const userId = req.userId;
  try {
    const { enhanceResponse, projectId } = req.body;


    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user || user.credits < 5) {
      return res
        .status(403)
        .json({ message: "Add credits to create more projects" });
    }

    const project = await WebsiteProject.findOne({
      _id: projectId,
      userId,
    });


    user.totalCreation += 1;
    user.credits -= 5;
    await user.save();

    const enhancedPrompt = enhanceResponse || project?.initial_prompt || "Create a modern website";

    /* ===== Code Generation ===== */
    const codeResponse = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "codestral-latest",
      messages: [
        {
          role: "system",
          content: `You are an expert web developer.

Create a complete, production-ready, single-page website based on the user request.

REQUIREMENTS:
- Output valid HTML ONLY
- Use Tailwind CSS for all styling
- Include this exact script inside <head>:
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
- Use Tailwind utility classes for layout, colors, spacing, responsiveness, and basic animations
- Make the page responsive using sm:, md:, lg: classes
- Add minimal JavaScript inside a <script> tag before </body> for basic interactivity only
- Include required meta tags
- Use Google Fonts CDN only if necessary
- Use images via <img> tags with placeholder URLs from https://placehold.co/600x400
- Use target="_blank" ONLY for external links (e.g., LinkedIn, GitHub); keep internal anchors (like #contact) in the same tab
- Use Tailwind gradients and modern UI styling

OUTPUT RULES (STRICT):
- Return ONLY raw HTML (no markdown, no explanations, no comments)
- Do NOT include analysis, reasoning, or extra text
- Keep the HTML concise and clean
- Include only essential sections (e.g., Hero, Features, Contact)
- Avoid long paragraphs or unnecessary UI elements
- Keep JavaScript minimal and simple

The HTML must be ready to render as-is in a browser.
`
        },
        {
          role: "user",
          content: enhancedPrompt,
        }
      ]
    });

    const rawContent = codeResponse?.choices?.[0]?.message?.content;

    // ensure AI returned string content
    if (!rawContent || typeof rawContent !== 'string') {
      throw new Error('CODE_AI_GENERATION_FAILED');
    }

    // clean markdown fences if present
    let cleanCode = rawContent
      .replace(/```[a-z]*\n?/gi, '')
      .replace(/```$/g, '')
      .trim();

    // ensure valid HTML document format
    const lowerCode = cleanCode.toLowerCase();
    if (!lowerCode.startsWith('<!doctype html')) {
      if (!lowerCode.includes('<html')) {
        cleanCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>\n</head>\n<body>\n${cleanCode}\n</body>\n</html>`;
      } else {
        cleanCode = '<!DOCTYPE html>\n' + cleanCode;
      }
    }
    const version = {
      code: cleanCode,
      description: 'Initial_version',
    };

    project.versions.push(version);
    project.current_code = cleanCode;

    const savedVersion = project.versions[project.versions.length - 1];
    project.current_version_index = savedVersion._id.toString();

    project.conversations.push({
      role: 'assistant',
      content: "I've created your website! You can now preview it and request changes.",
    });

    await project.save();

    return res.status(201).json({
      success: true,
      project,
      message: 'Website created successfully',
    });


  } catch (error) {
    await User.findByIdAndUpdate(userId, {
      $inc: { credits: 5 },
    });

    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get Single User Project
========================= */
export const getUserProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await WebsiteProject.findOne({
      _id: projectId,
      userId,
    });

    res.json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Get All User Projects
========================= */
export const getUserProjects = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      WebsiteProject.find({ userId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      WebsiteProject.countDocuments({ userId: userId }),
    ]);


    res.json({
      projects,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalProjects: total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const togglePublish = async (req, res) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await WebsiteProject.findOne({
      _id: projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.isPublished = !project.isPublished;
    await project.save();

    res.json({
      message: project.isPublished
        ? "Project published successfully"
        : "Project unpublished successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Failed to toggle publish state",
    });
  }
};

export const purchaseCredits = async (req, res) => {
  try {
    const { planId, transactionNumber } = req.body;
    const userId = req.userId;

    // 1️⃣ Basic validation
    if (!planId || !transactionNumber) {
      return res.status(400).json({
        message: "Plan ID and transaction number are required",
      });
    }

    // 2️⃣ Validate plan (backend is authority)
    const plan = creditPlans[planId];

    if (!plan) {
      return res.status(400).json({
        message: "Invalid credit plan selected",
      });
    }

    // 3️⃣ Prevent duplicate transaction numbers
    const existingTxn = await Payment.findOne({ transactionNumber });

    if (existingTxn) {
      return res.status(409).json({
        message: "This transaction number is already used",
      });
    }

    // 4️⃣ Create payment request (PENDING)
    const payment = await Payment.create({
      userId,
      planId,
      transactionNumber,
      amount: plan.amount,
      credits: plan.credits,
      status: "pending",
      paymentMethod: "upi",
    });

    // 5️⃣ Respond
    res.status(201).json({
      message: "Payment request submitted for verification",
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Purchase credits error:", error);
    res.status(500).json({
      message: "Failed to submit payment request",
    });
  }
};
