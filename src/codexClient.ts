import { Codex } from "@openai/codex-sdk";

import type { CodexRuntime } from "./types.js";

function resultToText(result: unknown): string {
  if (typeof result === "string") {
    return result;
  }

  if (result && typeof result === "object") {
    const maybeResult = result as Record<string, unknown>;
    if (typeof maybeResult.final_response === "string") {
      return maybeResult.final_response;
    }
    if (typeof maybeResult.finalResponse === "string") {
      return maybeResult.finalResponse;
    }
    if (typeof maybeResult.output === "string") {
      return maybeResult.output;
    }
  }

  return JSON.stringify(result, null, 2);
}

const codex = new Codex() as CodexRuntime;

export async function runCodexAgent(agentName: string, prompt: string): Promise<string> {
  console.log(`[agent:start] ${agentName}`);

  const thread = codex.startThread();
  const result = await thread.run(prompt);

  console.log(`[agent:done] ${agentName}`);
  return resultToText(result);
}
