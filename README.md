# 🚀 DevMorph – Full-Stack AI Web Application Generator & Live Interactive Workspace

> **DevMorph** is a state-of-the-art, full-stack AI platform (similar to v0.dev / Bolt.new / Lovable) that translates natural language descriptions into interactive, responsive, production-ready web applications. Featuring a 2-stage AI prompt enhancement engine, real-time iframe element inspection & inline visual editor, multi-version rollback support, and credit-based usage controls.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack & Architecture](#-tech-stack--architecture)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [Key Technical Highlights & Interview Talking Points](#-key-technical-highlights--interview-talking-points)
6. [Project Structure](#-project-structure)
7. [Environment Variables](#-environment-variables)
8. [Getting Started & Local Setup](#-getting-started--local-setup)
9. [API Documentation](#-api-documentation)
10. [Database Schemas & Models](#-database-schemas--models)
11. [Interview Preparation Cheat Sheet](#-interview-preparation-cheat-sheet)
12. [License](#-license)

---

## 🌟 Project Overview
- **Problem Statement**: Traditional website builders require manual drag-and-drop effort or coding expertise, while standard AI code generators output plain code snippets without live previews, visual DOM editing tools, or version history tracking.
- **DevMorph Solution**: DevMorph provides a complete browser-based workspace. Users describe their target web application in natural language, preview the generated website immediately in a sandboxed iframe, visually inspect and tweak DOM elements with a point-and-click editor, request conversational AI revisions, and publish or export production-ready code.

---

## ✨ Key Features

- **🪄 Natural Language Web Synthesis**: Turns raw prompt descriptions into full HTML5, Tailwind CSS, and interactive JavaScript web applications.
- **🧠 Dual-Stage AI Pipeline (Gemini 2.5 Flash + Fallback Engine)**:
  - *Stage 1 (Prompt Enhancement)*: Refines user input into structured design specifications, color palettes, responsive layouts, and technical constraints.
  - *Stage 2 (Code Synthesis)*: Generates clean, standalone single-page applications with Tailwind utility classes and embedded scripts.
- **🎨 Visual Element Inspector & Inline Style Editor**:
  - Click on any element inside the live sandbox iframe preview.
  - Dynamically modify text content, hyperlink URLs, image sources, background colors, font colors, padding, borders, and custom CSS without requiring an AI re-generation call.
- **💬 Conversational Revision Engine**: Refine websites iteratively using follow-up prompts with conversation history preserved.
- **📜 Versioning & One-Click Rollback**: Automatically creates snapshot versions for every code change with instant rollback capabilities to any previous build.
- **📱 Multi-Device Responsive Viewports**: Toggle live previews across Desktop (100%), Tablet (768px), and Mobile (375px) viewports.
- **📤 Code Export & Community Showcase**: Copy raw HTML code, download static files, or publish websites to the public DevMorph showcase wall.
- **💳 Credit-Based Monetization & Balance Guards**: Tracks user credit balances (20 initial free credits, 5 credits per generation/revision), auto-refunds credits on failed requests, and supports subscription credit plans.
- **🛡️ Admin Portal**: Comprehensive management suite for monitoring user accounts, total creations, published sites, contact inquiries, and system health checks.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (`client-js`)**
- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript (`.ts`, `.tsx`)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) for global state management (Auth, Active Projects, Revisions, Editor Panel)
- **Styling & UI**: Tailwind CSS v4, Framer Motion (glassmorphism & micro-animations), Lucide React Icons, React Hot Toast
- **Canvas / Sandbox**: HTML5 `<iframe>` with bidirectional `postMessage` event bus for live visual element selection and runtime inline editing

### **Backend (`server-js`)**
- **Runtime**: Node.js (ES Modules `import/export`)
- **Framework**: Express.js (v5)
- **Database & ORM**: MongoDB with Mongoose
- **Dev Database Fallback**: Automated fallback to `mongodb-memory-server` when local/remote MongoDB is unreachable (ensures zero-downtime local development).
- **Authentication**: HttpOnly + Secure + SameSite JWT cookies paired with `bcrypt` password encryption.
- **AI Core**:
  - Primary: `@google/genai` (Google Gemini `gemini-2.5-flash`)
  - Fail-safe Fallback: `openai` SDK with `codestral-latest` / custom LLM endpoints
- **Email & Communications**: Nodemailer & Brevo / Sendinblue SDK (`sib-api-v3-sdk`)

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client (Next.js 15)                           │
│   ┌────────────────────┐   ┌──────────────────┐   ┌─────────────────┐   │
│   │  MorphSpace View   │   │  Visual Editor   │   │  Redux Toolkit  │   │
│   └─────────┬──────────┘   └────────┬─────────┘   └────────┬────────┘   │
└─────────────┼───────────────────────┼──────────────────────┼────────────┘
              │ postMessage           │ inline state         │ HTTP (Axios)
              ▼                       ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Express 5 REST API Server                         │
│   ┌────────────────────┐   ┌──────────────────┐   ┌─────────────────┐   │
│   │  JWT Auth Guard    │───▶ Credit Middleware│───▶ Project Controller│ │
│   └────────────────────┘   └──────────────────┘   └────────┬────────┘   │
└────────────────────────────────────────────────────────────┼────────────┘
                                                             │
                  ┌──────────────────────────────────────────┴──────────────────────────┐
                  ▼                                                                     ▼
┌───────────────────────────────────┐                                 ┌───────────────────────────────────┐
│     AI Engine (2-Stage Pipeline)  │                                 │     Database & Storage Layer      │
│  ┌─────────────────────────────┐  │                                 │  ┌─────────────────────────────┐  │
│  │ Primary: Gemini 2.5 Flash   │  │                                 │  │ MongoDB (Mongoose Schema)   │  │
│  └──────────────┬──────────────┘  │                                 │  │ - Users & Credit Balances   │  │
│                 │ (fallback)      │                                 │  │ - Projects, Versions & Code │  │
│  ┌──────────────▼──────────────┐  │                                 │  │ - Conversations & Analytics │  │
│  │ Fallback: OpenAI / Codestral│  │                                 │  └──────────────┬──────────────┘  │
│  └─────────────────────────────┘  │                                 │                 │ (offline dev)   │
└───────────────────────────────────┘                                 │  ┌──────────────▼──────────────┐  │
                                                                      │  │ In-Memory Mongo Fallback    │  │
                                                                      │  └─────────────────────────────┘  │
                                                                      └───────────────────────────────────┘
```

---

## 🎯 Key Technical Highlights & Interview Talking Points

*When presenting DevMorph in a technical interview, emphasize these key architectural solutions:*

1. **Bidirectional Sandbox Iframe Communication (`postMessage`)**:
   - *Challenge*: Rendering arbitrary AI-generated HTML/JS safely while enabling interactive point-and-click visual element editing.
   - *Solution*: A script is dynamically injected into the preview `<iframe>`. Clicking any element extracts its tag name, inner text, attributes, and computed styles, serializing them into a structured message sent via `window.parent.postMessage`. The parent Next.js application renders the `EditorPanel`, allowing instant property mutations that post directly back into the iframe DOM without forcing a full iframe reload.

2. **Dual-Stage Resilient AI Pipeline**:
   - *Challenge*: Raw user prompts are often vague, leading to incomplete code outputs. Additionally, relying on a single AI service poses downtime risks.
   - *Solution*: Designed a two-stage process:
     - **Stage 1 (Prompt Enhancement)**: Converts natural prompts (e.g. *"Create a SaaS landing page"*) into detailed design specifications with typography, color palettes, responsive spacing, and Tailwind utility directives.
     - **Stage 2 (Code Generation)**: Synthesizes fully-styled, standalone HTML5 documents.
     - **Fail-Safe Fallback**: If Google Gemini (`gemini-2.5-flash`) fails or hits rate limits, the controller catches the error and seamlessly falls back to an OpenAI-compatible endpoint (`codestral-latest`).

3. **Zero-Downtime Database Connection with In-Memory MongoDB**:
   - *Challenge*: Connection delays or missing database instances during local development can cause application crashes.
   - *Solution*: Implemented connection guard logic in `server.js` (`mongoose.connect({ serverSelectionTimeoutMS: 2000 })`). If local/cloud MongoDB is unavailable, the server automatically initializes `mongodb-memory-server`, allowing instant local execution and isolated testing.

4. **Transactional Credit Guard & Automatic Refund Pattern**:
   - *Challenge*: Deducting user credits before AI synthesis could penalize users if the request fails midway.
   - *Solution*: Credit authorization runs prior to AI processing. If any exception occurs during prompt enhancement, code synthesis, or database updates, the error handler automatically issues a `$inc: { credits: 5 }` refund operation, preserving user credit integrity.

5. **Production Security & Cross-Domain Authorization**:
   - Authentication relies on JWT tokens stored in `HttpOnly`, `SameSite` (`Lax`/`None`), and `Secure` cookies to guard against XSS vulnerabilities.
   - Dynamic CORS origin matching validates incoming requests against trusted origins (localhost, Vercel deployments, production domain) while preventing unauthorized cross-site access.

---

## 📁 Project Structure

```
devmorph-main/
├── package.json                   # Root workspace scripts & prefix launchers
├── README.md                      # Project documentation & interview guide
├── client-js/                     # Next.js 15 Frontend Application
│   ├── src/
│   │   ├── app/                   # App Router Pages & Layouts
│   │   │   ├── page.tsx           # Landing Page with AI showcase
│   │   │   ├── morphspace/        # Main AI Web App Generator Workspace
│   │   │   ├── projects/          # User Saved Projects Dashboard
│   │   │   ├── preview/           # Embedded Full-screen Preview Engine
│   │   │   ├── pricing/           # Pricing & Credit Package Plans
│   │   │   ├── docs/              # API & User Documentation
│   │   │   ├── admin/             # Admin Management Dashboard
│   │   │   ├── login/ & signup/   # Authentication pages
│   │   │   └── providers.tsx      # Redux Provider & Toaster wrappers
│   │   ├── components/            # Reusable React UI Components
│   │   │   ├── EditorPanel.tsx    # Live Element Inspector & Style Editor
│   │   │   ├── ProjectPreview.tsx # Sandbox Iframe Controller & postMessage Handler
│   │   │   ├── Sidebar.tsx        # Chat Drawer & Revision History
│   │   │   ├── Navbar.tsx         # User Profile, Credits, Navigation
│   │   │   └── ui/                # Glassmorphic UI components & Buttons
│   │   ├── features/              # Redux Toolkit Slices & Async Thunks
│   │   │   ├── auth/              # authSlice (login, logout, session)
│   │   │   ├── project/           # projectSlice (active project, versions)
│   │   │   └── projectactions/    # pActionThunk (AI generation async calls)
│   │   └── types/                 # TypeScript interfaces and schema declarations
│   ├── package.json               # Client dependencies (Next.js 15, Redux, Tailwind 4)
│   └── tsconfig.json              # TypeScript compilation config
│
└── server-js/                     # Node.js + Express 5 Backend
    ├── server.js                  # Entry point, DB connection guard, CORS & routes
    ├── src/
    │   ├── config/                # AI clients (Gemini, OpenAI) & credit plans
    │   ├── controllers/           # Express Request Handlers
    │   │   ├── authController.js    # JWT Auth, Signup, Login, Cookie handling
    │   │   ├── projectController.js # AI Generation, Revisions, Rollbacks, Publish
    │   │   ├── userController.js    # User Profile, Credits balance
    │   │   └── adminController.js   # Platform Analytics & Admin Management
    │   ├── models/                # Mongoose Schemas
    │   │   ├── User.js            # User account & credit model
    │   │   ├── WebsiteProject.js  # Projects, version history & conversations
    │   │   ├── Admin.js           # Admin authentication schema
    │   │   └── Payment.js         # Transactions & payment records
    │   ├── middleware/            # Express Auth Guards & Admin Checkers
    │   └── routes/                # Express API Route Declarations
    └── package.json               # Server dependencies (@google/genai, express 5, mongoose)
```

---

## ⚙️ Environment Variables

### **Backend (`server-js/.env`)**
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/devmorph
TRUSTED_ORIGIN=http://localhost:3000

# Primary AI Provider (Google Gemini)
GEMNI=your_google_gemini_api_key

# Secondary / Fallback AI Provider (OpenAI / Codestral API)
AI_API_KEY=your_openai_or_codestral_api_key
AI_BASE_URL=https://api.llm7.io/v1
AI_MODEL=codestral-latest
```

### **Frontend (`client-js/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BASEURL=http://localhost:5000
NEXT_PUBLIC_TURNSTILE_SITEKEY=1x00000000000000000000AA
```

---

## 🚀 Getting Started & Local Setup

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **MongoDB**: Optional (If no MongoDB URL is supplied or local service is stopped, DevMorph will automatically initialize `mongodb-memory-server`).

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/devmorph.git
cd devmorph
```

### **2. Install Dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client-js && npm install && cd ..

# Install server dependencies
cd server-js && npm install && cd ..
```

### **3. Run DevMorph Locally**
You can launch both frontend and backend using root npm scripts:

- **Run Frontend (Next.js)**:
  ```bash
  npm run dev
  ```
  *(App runs at `http://localhost:3000`)*

- **Run Backend (Express Server)**:
  ```bash
  npm run dev:server
  ```
  *(API Server runs at `http://localhost:5000`)*

---

## 📡 API Endpoint Reference

### **Authentication (`/api/auth`)**
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register user & return HTTP-Only JWT | No |
| `POST` | `/api/auth/login` | Authenticate user & issue cookie | No |
| `GET` | `/api/auth/logout` | Clear auth token cookie | Yes |
| `GET` | `/api/auth/me` | Fetch active user credentials & credits | Yes |

### **Projects & AI Generator (`/api/project` & `/api/user`)**
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/user/project` | Generate new AI web project from initial prompt | Yes (5 credits) |
| `POST` | `/api/project/:projectId/revision` | Enhance prompt & apply iterative AI revision | Yes (5 credits) |
| `POST` | `/api/project/revision-code` | Generate updated HTML/CSS code | Yes |
| `POST` | `/api/project/rollback` | Restore project to an earlier snapshot version | Yes |
| `PUT` | `/api/project/:projectId/save` | Save manual HTML edits from visual editor | Yes |
| `DELETE` | `/api/project/:projectId` | Permanently delete project | Yes |
| `GET` | `/api/project/published` | Paginated public website showcase | No |

---

## 📊 Database Schemas

### **User Schema (`User.js`)**
```ts
{
  name: String,
  email: { type: String, unique: true },
  password: String (bcrypt hash),
  credits: Number (default: 20),
  totalCreation: Number (default: 0),
  emailVerified: Boolean (default: false),
  timestamps: true
}
```

### **WebsiteProject Schema (`WebsiteProject.js`)**
```ts
{
  name: String,
  initial_prompt: String,
  current_code: String,
  current_version_index: String,
  isPublished: Boolean,
  userId: ObjectId (ref: User),
  conversations: [ { role: 'user' | 'assistant', content: String, timestamp: Date } ],
  versions: [ { _id: ObjectId, code: String, description: String, timestamp: Date } ],
  timestamps: true
}
```

---

## 🎓 Interview Preparation Cheat Sheet

| Question | Recommended Answer |
|---|---|
| **What is DevMorph?** | "DevMorph is an AI-powered full-stack web application builder built with Next.js 15, Node.js/Express, Redux Toolkit, and MongoDB. It converts plain text prompts into responsive web pages with live iframe previews, an inline visual element inspector, conversational revision AI, version rollback support, and credit management." |
| **How does the live visual element inspector work?** | "We inject an event-listener script into the preview `<iframe>`. When the user clicks an element in the iframe, it captures the DOM node details (tag, text, CSS styles) and sends a `postMessage` payload to the host Next.js app. The React `EditorPanel` captures this state, allowing the user to make real-time style or content tweaks that reflect back inside the iframe DOM instantly." |
| **How is AI availability ensured?** | "We implement a 2-stage architecture with dual-provider redundancy. Prompts are first enriched for layout and technical details before code generation. If our primary model (Google Gemini `gemini-2.5-flash`) fails or hits quota limits, the system catches the error and automatically fails over to our secondary OpenAI/Codestral model endpoint." |
| **How do you protect credits against server failures?** | "Credit deductions are wrapped with automated failure rollback handlers. If AI code synthesis or DB saving fails at any point in the request lifecycle, the `catch` block issues a `$inc: { credits: 5 }` refund operation back to the user's account." |
| **How do you handle backend offline database availability?** | "In `server.js`, we configure Mongoose with a short selection timeout. If local or cloud MongoDB connection fails, Express automatically initializes `mongodb-memory-server`, providing an in-memory Mongo database so local development and testing never stall." |

---

## 📜 License
This project is licensed under the **ISC License**. Created for portfolio showcase and software engineering technical interview demonstration.
