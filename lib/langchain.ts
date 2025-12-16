import { ChatOpenAI } from "@langchain/openai";

// LangSmith tracing is automatically enabled if LANGSMITH_API_KEY environment variable is set
// Set these environment variables for LangSmith:
// - LANGSMITH_API_KEY: Your LangSmith API key
// - LANGSMITH_PROJECT: Project name (default: "rolefit-assessments")
// - LANGSMITH_ENDPOINT: API endpoint (optional, defaults to https://api.smith.langchain.com)

// Lazily create the LLM so that missing env vars don't break the whole app at import time.
export function getLlm() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const temperature = parseFloat(process.env.OPENAI_TEMPERATURE || "0.2");

  return new ChatOpenAI({
    modelName,
    temperature,
    openAIApiKey: process.env.OPENAI_API_KEY,
    // LangSmith tracing works automatically via environment variables:
    // - LANGCHAIN_TRACING_V2=true
    // - LANGCHAIN_API_KEY=<your_langsmith_api_key>
    // - LANGCHAIN_PROJECT=<project_name>
  });
}
