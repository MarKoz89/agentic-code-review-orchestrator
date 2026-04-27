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

export function createTestPrompt(context: ReviewContext, plan: string): string {
  return `
You are the Test Agent in an Agentic Code Review Orchestrator.

Target repository:
${context.repoPath}

${diffContext(context)}

Planner output:
${plan}

Inspect the repository's existing test setup and propose missing tests.
In diff mode, identify tests affected by the changed files and changed behavior.

Rules:
- Do not modify files.
- Identify test framework and test commands when possible.
- Connect missing tests to concrete risks from the code review.
- Output Markdown with these headings:
  - Existing Test Coverage
  - Test Gaps
  - Proposed Test Cases
  - Suggested Test Commands
`;
}
