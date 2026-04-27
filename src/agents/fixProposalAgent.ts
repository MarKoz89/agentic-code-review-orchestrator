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

export function createFixProposalPrompt(
  context: ReviewContext,
  plan: string,
  codeReview: string,
  testReview: string,
  supervisorFeedback?: string
): string {
  const feedbackSection = supervisorFeedback
    ? `\nSupervisor requested refinement:\n${supervisorFeedback}\n`
    : "";

  return `
You are the Fix Proposal Agent in an Agentic Code Review Orchestrator.

Target repository:
${context.repoPath}

${diffContext(context)}

Planner output:
${plan}

Code Review output:
${codeReview}

Test Agent output:
${testReview}
${feedbackSection}

Propose concrete engineering improvements.
In diff mode, propose improvements only for changed areas where possible.

Rules:
- Do not modify files.
- Propose changes at the patch-plan level, not full diffs.
- Include risk, priority, and validation steps.
- Output Markdown with these headings:
  - Proposed Fixes
  - Implementation Notes
  - Validation Plan
  - Residual Risks
`;
}
