export function createFixProposalPrompt(
  repoPath: string,
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
${repoPath}

Planner output:
${plan}

Code Review output:
${codeReview}

Test Agent output:
${testReview}
${feedbackSection}

Propose concrete engineering improvements.

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
