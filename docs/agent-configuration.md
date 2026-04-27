# Agent Configuration

## Coding Agent

This project uses Codex as the coding agent. Codex is controlled programmatically through the `@openai/codex-sdk` package in `src/codexClient.ts`.

Claude Code is not used in this implementation because the homework project is specifically focused on practical OpenAI Codex SDK usage and Codex-based orchestration.

## MCP Server Configuration

The project includes a project-scoped MCP example at `.vscode/mcp.json`.

It configures the OpenAI Developer Docs MCP server:

```json
{
  "servers": {
    "openaiDeveloperDocs": {
      "type": "http",
      "url": "https://developers.openai.com/mcp"
    }
  }
}
```

This MCP server is read-only and is intended only for official OpenAI documentation lookup. It is not used to modify repositories, generate secrets, or install extensions.

## Codex Configuration

The project includes `.codex/config.toml` as a minimal project-scoped Codex configuration example.

The file does not contain API keys or secrets. Local Codex authentication is handled outside the repository through the user's local Codex/OpenAI setup.

## Skills

No marketplace skills are installed. No plugins are used.

The project documents its own homework-friendly skills in `docs/skills.md`:

- Repository planning skill
- Code review skill
- Test review skill
- Fix proposal skill
- Supervisor evaluation skill
- Security hygiene skill

These are documented project skills represented by the subagent prompt files in `src/agents/`.

## Subagents

The orchestrator uses these subagents:

- Planner Agent
- Code Review Agent
- Test Agent
- Fix Proposal Agent
- Supervisor Agent

Their responsibilities, inputs, outputs, and read-only behavior are documented in `docs/subagents.md`.

## Workflow Patterns

The workflow demonstrates:

- Sequential workflow: Planner runs first, Fix Proposal follows review, Supervisor runs last.
- Parallel workflow: Code Review Agent and Test Agent run together after planning.
- Conditional branching: the supervisor can accept the result or trigger refinement.
- Loop / refinement iteration: the supervisor loop is capped at two iterations.
- Supervisor pattern: the Supervisor Agent evaluates all agent outputs.
- Markdown report generation: `output/code-review-report.md` is produced.

## Security Rules

- Do not commit `.env`.
- Do not commit API keys, tokens, or credentials.
- Keep `.env.example` placeholder-only.
- Keep reviewed repositories read-only.
- Do not use plugins.
- Do not use marketplace extensions.
- Keep generated reports ignored by git.

## No Plugins / No Marketplace

This project does not use plugins and does not use any marketplace. The configuration is limited to source-controlled documentation, a read-only MCP example, and a minimal Codex config example.
