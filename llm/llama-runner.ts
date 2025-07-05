import { spawnSync } from "child_process";

export function askLlama(prompt: string): string {
  const result = spawnSync("ollama", ["run", "llama2", prompt], {
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  return result.stdout.trim();
}
