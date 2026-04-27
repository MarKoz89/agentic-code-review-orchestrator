export type AgentName =
  | "Planner Agent"
  | "Code Review Agent"
  | "Test Agent"
  | "Fix Proposal Agent"
  | "Supervisor Agent";

export type ReviewMode = "full" | "diff";

export interface AgentResult {
  agentName: AgentName;
  prompt: string;
  output: string;
}

export interface ReviewContext {
  repoPath: string;
  maxSupervisorIterations: number;
  reviewMode: ReviewMode;
  diff?: string;
  diffSummary?: string;
  diffSource?: string;
}

export interface ReviewState {
  context: ReviewContext;
  planner?: AgentResult;
  codeReview?: AgentResult;
  testReview?: AgentResult;
  fixProposal?: AgentResult;
  supervisorIterations: AgentResult[];
  accepted: boolean;
  finalDecision: string;
}

export interface CodexThread {
  run(prompt: string): Promise<unknown>;
}

export interface CodexRuntime {
  startThread(): CodexThread;
  resumeThread(threadId: string): CodexThread;
}

export interface ReviewOptions {
  diffMode: boolean;
}
