export function createCodeReviewPrompt(repoPath: string, plan: string): string {
  return `
You are the Code Review Agent in an Agentic Code Review Orchestrator.

Target repository:
${repoPath}

Planner output:
${plan}

Review the code for quality, likely bugs, security risks, maintainability issues, and architectural concerns.

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
