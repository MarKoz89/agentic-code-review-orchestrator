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

export function createPlannerPrompt(context: ReviewContext): string {
  return `
You are the Planner Agent in an Agentic Code Review Orchestrator.

Target repository:
${context.repoPath}

${diffContext(context)}

Inspect the local repository structure and produce a concise review plan.
In diff mode, focus the plan primarily on the changed files and changed behavior, similar to a pull-request review.

Rules:
- Do not modify files.
- Mention whether this is full repository review mode or git diff review mode.
- Identify important languages, frameworks, entrypoints, tests, and config files.
- Prioritize areas that should be reviewed for bugs, security, maintainability, and test gaps.
- Output Markdown with these headings:
  - Repository Snapshot
  - Review Strategy
  - Files Or Areas To Inspect
  - Risks Or Unknowns
`;
}
