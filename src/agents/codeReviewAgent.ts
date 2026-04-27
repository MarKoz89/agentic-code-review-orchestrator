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

export function createCodeReviewPrompt(context: ReviewContext, plan: string): string {
  return `
You are the Code Review Agent in an Agentic Code Review Orchestrator.

Target repository:
${context.repoPath}

${diffContext(context)}

Planner output:
${plan}

Review the code for quality, likely bugs, security risks, maintainability issues, and architectural concerns.
In diff mode, focus primarily on the changed code and pull-request risks introduced by the diff.

Rules:
- Do not modify files.
- Prefer concrete findings with file paths when available.
- Avoid vague style opinions unless they affect maintainability.
- Output Markdown with these headings:
  - Executive Summary
  - Findings
  - Security Notes
  - Maintainability Notes
  - Recommended Priorities
`;
}
