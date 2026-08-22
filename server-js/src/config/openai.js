import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.AI_BASE_URL || "https://api.llm7.io/v1",
  apiKey: process.env.AI_API_KEY,
});

export default openai;