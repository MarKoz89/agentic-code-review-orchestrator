export function createSupervisorPrompt(
  repoPath: string,
  plan: string,
  codeReview: string,
  testReview: string,
  fixProposal: string,
  iteration: number,
  maxIterations: number
): string {
  return `
You are the Supervisor Agent in an Agentic Code Review Orchestrator.

Target repository:
${repoPath}

Supervisor iteration:
${iteration} of ${maxIterations}

Planner output:
${plan}

Code Review output:
${codeReview}

Test Agent output:
${testReview}

Fix Proposal output:
${fixProposal}

Evaluate whether the combined review is acceptable for an engineering report.

Rules:
- Do not modify files.
- Decide whether the result is acceptable.
- If not acceptable, explain exactly what must be refined.
- Start your response with exactly one of:
  - ACCEPT
  - REVISE
- Output Markdown with these headings:
  - Decision
  - Rationale
  - Required Revisions
  - Report Quality Notes
`;
}
