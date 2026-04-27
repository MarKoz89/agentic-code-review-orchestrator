export function createPlannerPrompt(repoPath: string): string {
  return `
You are the Planner Agent in an Agentic Code Review Orchestrator.

Target repository:
${repoPath}

Inspect the local repository structure and produce a concise review plan.

Rules:
- Do not modify files.
- Identify important languages, frameworks, entrypoints, tests, and config files.
- Prioritize areas that should be reviewed for bugs, security, maintainability, and test gaps.
- Output Markdown with these headings:
  - Repository Snapshot
  - Review Strategy
  - Files Or Areas To Inspect
  - Risks Or Unknowns
`;
}
