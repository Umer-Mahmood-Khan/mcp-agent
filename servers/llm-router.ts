import { z } from "zod";
import { dbToolHandler } from "./db-tool.js";
import { webSearchHandler } from "./web-search-tool.js";
import { callOllama } from "../utils/ollama.js";

export const llmRouterTool = {
  name: "llm_router",
  description:
    "Decides which tool (database or web) should answer the question.",
  inputSchema: {
    type: "object",
    properties: {
      question: { type: "string" },
    },
    required: ["question"],
  },
};

export async function llmRouterHandler(args: { question: string }) {
  const q = args.question.toLowerCase();
  let chosenTool = "web_search";

  const isAgriRelated =
    q.includes("crop") ||
    q.includes("yield") ||
    q.includes("weather") ||
    q.includes("disease");

  if (isAgriRelated) {
    const dbResult = await dbToolHandler({ question: args.question });
    const dbText = dbResult.content[0]?.text || "";

    const isFallback =
      dbText.toLowerCase().includes("not recognized") ||
      dbText.toLowerCase().includes("no data");

    if (!isFallback) {
      return {
        content: [
          { type: "text", text: `🛠 Tool used: query_agriculture_data` },
          ...dbResult.content,
        ],
      };
    }
  }

  const webResult = await webSearchHandler({ query: args.question });
  return {
    content: [
      { type: "text", text: `🛠 Tool used: web_search` },
      ...webResult.content,
    ],
  };
}
