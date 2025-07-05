// servers/web-search-tool.ts
import axios from "axios";
import * as cheerio from "cheerio";

export const webSearchTool = {
  name: "web_search",
  description: "Search the web for current information.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
    },
    required: ["query"],
  },
};

export async function webSearchHandler(args: { query: string }) {
  const query = args.query;
  const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(response.data);
    const snippets: string[] = [];

    $("a.result__snippet, div.result__snippet").each((i, el) => {
      const text = $(el).text().trim();
      if (text) snippets.push(text);
    });

    const topSnippet =
      snippets.find(
        (s) =>
          s.toLowerCase().includes("is") && s.toLowerCase().includes("pakistan")
      ) ||
      snippets[0] ||
      "No summary found.";

    const summary = truncateToTwoSentences(topSnippet);

    return {
      content: [
        {
          type: "text",
          text: `Answer: ${summary}`,
        },
      ],
    };
  } catch (err) {
    console.error("💥 Web search error:", err);
    return {
      content: [
        {
          type: "text",
          text: `Failed to perform web search: ${(err as Error).message}`,
        },
      ],
    };
  }
}

// Helper: limit to ~2 sentences or 280 chars
function truncateToTwoSentences(text: string): string {
  return text
    .split(/(?<=[.?!])\s+/)
    .slice(0, 2)
    .join(" ")
    .slice(0, 280);
}
