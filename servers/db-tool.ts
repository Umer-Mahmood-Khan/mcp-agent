// servers/db-tool.ts
import { z } from "zod";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const dbTool = {
  name: "query_agriculture_data",
  description: "Query the agriculture PostgreSQL database.",
  inputSchema: {
    type: "object",
    properties: {
      question: { type: "string" },
    },
    required: ["question"],
  },
};

export async function dbToolHandler(args: { question: string }) {
  const client = new Client();
  await client.connect();

  const q = args.question.toLowerCase();
  let resultText = "Query not recognized.";

  try {
    if (q.includes("yield") && q.includes("wheat")) {
      const res = await client.query(
        "SELECT yield_per_acre FROM crop_info WHERE name ILIKE 'wheat'"
      );
      if (res.rows.length > 0) {
        resultText = `Wheat has a yield of ${res.rows[0].yield_per_acre} tons per acre.`;
      } else {
        resultText = "No data found for wheat.";
      }
    } else if (q.includes("crop") && q.includes("yield")) {
      const res = await client.query(
        "SELECT name, yield_per_acre FROM crop_info;"
      );
      resultText = res.rows
        .map((r) => `${r.name}: ${r.yield_per_acre} t/acre`)
        .join(", ");
    } else if (q.includes("weather") && q.includes("today")) {
      const res = await client.query(
        "SELECT * FROM weather_logs ORDER BY date DESC LIMIT 1;"
      );
      const { region, temperature, rainfall } = res.rows[0];
      resultText = `In ${region}, the temperature is ${temperature}°C with ${rainfall}mm rainfall.`;
    }
  } catch (err) {
    if (err instanceof Error) {
      resultText = `Error executing query: ${err.message}`;
    } else {
      resultText = "An unknown error occurred while executing the query.";
    }
  }

  await client.end();

  return {
    content: [
      {
        type: "text",
        text: resultText,
      },
    ],
  };
}
