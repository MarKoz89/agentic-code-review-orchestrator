import type { AgentName } from "./types.js";

export class Logger {
  step(message: string): void {
    console.log(`\n[orchestrator] ${message}`);
  }

  agentStart(agentName: AgentName): void {
    console.log(`[agent:start] ${agentName}`);
  }

  agentDone(agentName: AgentName): void {
    console.log(`[agent:done] ${agentName}`);
  }

  info(message: string): void {
    console.log(`[info] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[warn] ${message}`);
  }
}
