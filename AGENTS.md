# Agent Instructions

## Coding Agent

The coding agent for this project is Codex.

## Agent Purpose

Codex should help maintain and extend the Agentic Code Review Orchestrator. The project demonstrates a coding-agent orchestration workflow that reviews a local repository and generates a Markdown engineering report.

## Safety Rules

- Do not commit secrets, API keys, tokens, or local credentials.
- Do not modify `.env`.
- Keep `.env.example` as a placeholder-only template.
- Do not use plugins or marketplace extensions.
- Keep generated reports out of git except for `output/.gitkeep`.

## Read-Only Review Behavior

Reviewed repositories must not be modified. The orchestrator asks subagents to inspect, review, and propose changes only. It should generate `output/code-review-report.md` in this project, but it must not apply patches to the reviewed repository.

## Project Context

Use these files as the primary project context:

- `src/orchestrator.ts` for workflow control.
- `src/codexClient.ts` for Codex SDK usage.
- `src/agents/` for subagent prompts.
- `docs/agent-configuration.md` for assignment configuration details.
- `docs/skills.md` and `docs/subagents.md` for documented skills and subagents.

Keep changes simple, readable, and suitable for a course homework submission.
