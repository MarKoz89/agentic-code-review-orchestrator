import type { ReviewContext } from "../types.js";

function diffContext(context: ReviewContext): string {
  if (context.reviewMode !== "diff") {
    return "Review mode: Full repository review.";
  }

  return `Review mode: Git diff review.
Diff summary:
${context.diffSummary || "No diff summary available."}

Git diff:
${context.diff || "No changes were detected in the git diff."}`;
}

export function createSupervisorPrompt(
  context: ReviewContext,
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
${context.repoPath}

${diffContext(context)}

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
In diff mode, evaluate whether the result is acceptable as a pull-request style diff review.

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
