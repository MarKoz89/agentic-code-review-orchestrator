# Agentic Code Review Orchestrator

A GitHub-ready TypeScript project that demonstrates practical usage of the OpenAI Codex SDK for a coding-agent orchestration workflow.

## Overview

The orchestrator analyzes a local code repository, coordinates multiple Codex-powered coding agents, and writes a structured Markdown engineering report to `output/code-review-report.md`.

## Purpose

This project is designed as a course homework submission for an agentic engineering assignment. It shows how a software engineering workflow can be decomposed into specialized agents, orchestrated with explicit control flow, and evaluated by a supervisor agent before producing a final artifact.

The implementation is intentionally small and readable. The important part is the orchestration pattern, not framework complexity.

## Architecture

The CLI entrypoint is `src/index.ts`. It parses the target repository path and calls the orchestrator.

The main workflow lives in `src/orchestrator.ts`. It calls the Codex client wrapper, runs the planner first, runs code review and test review in parallel, handles supervisor feedback, and writes the final report.

`src/codexClient.ts` is the thin Codex SDK adapter. It exposes `runCodexAgent(agentName, prompt)` and uses the official SDK flow:

```ts
const codex = new Codex();
const thread = codex.startThread();
const result = await thread.run(prompt);
```

Each agent prompt is isolated in `src/agents/` so the roles are easy to inspect and modify.

## Agents

- **Planner Agent** inspects the repository structure and creates the review strategy.
- **Code Review Agent** reviews quality, bugs, security risks, maintainability, and architecture.
- **Test Agent** checks existing tests and proposes missing test coverage.
- **Fix Proposal Agent** proposes concrete engineering improvements without editing files.
- **Supervisor Agent** evaluates the combined outputs and decides whether the result is acceptable.

## Coding Agent Configuration

- **Coding agent:** Codex is the coding agent used by this project.
- **Codex SDK:** `@openai/codex-sdk` is used by `src/codexClient.ts` to start and run Codex agent threads.
- **MCP server:** `.vscode/mcp.json` configures the read-only OpenAI Developer Docs MCP server for official OpenAI documentation lookup.
- **Codex config example:** `.codex/config.toml` provides a safe project-scoped example without secrets or API keys.
- **Skills:** project-defined skills are documented in `docs/skills.md`.
- **Subagents:** Planner, Code Review, Test, Fix Proposal, and Supervisor subagents are documented in `docs/subagents.md`.
- **Agent instructions:** `AGENTS.md` documents Codex behavior, project context, safety rules, and read-only review behavior.
- **No plugins / no marketplace:** this project does not use plugins or marketplace extensions.
- **Submission format:** the project is submitted as GitHub source files and excludes local secrets, dependencies, build output, demo folders, and generated reports.

## Workflow Patterns

This project demonstrates the required orchestration patterns:

- **Sequential workflow:** Planner -> parallel review phase -> Fix Proposal -> Supervisor.
- **Parallel workflow:** after planning, Code Review Agent and Test Agent run together with `Promise.all`.
- **Conditional branching:** the orchestrator checks whether the repository appears empty or unanalyzable, and supervisor feedback determines whether refinement is needed.
- **Loop / refinement iteration:** the supervisor can request a refined fix proposal, but the loop is capped at two supervisor iterations.
- **Supervisor pattern:** the supervisor reviews all outputs and determines whether the report is acceptable.
- **Markdown report generation:** the final engineering report is written to `output/code-review-report.md`.

## Assignment Mapping

- **Codex:** Codex is the coding agent and is controlled through `@openai/codex-sdk`.
- **MCP server:** `.vscode/mcp.json` configures the OpenAI Developer Docs MCP server for read-only official documentation lookup.
- **Skills:** project-defined skills are documented in `docs/skills.md`; no marketplace skills are installed.
- **Subagents:** all orchestrated subagents are documented in `docs/subagents.md`.
- **No plugins / no marketplace:** the project explicitly avoids plugins and marketplace extensions.
- **Practical Codex SDK usage:** `src/codexClient.ts` wraps `@openai/codex-sdk` and starts Codex threads programmatically.
- **Multi-agent workflow:** the orchestrator coordinates Planner, Code Review, Test, Fix Proposal, and Supervisor agents.
- **Sequential workflow:** planning happens first, fix proposal follows the review phase, and supervisor evaluation happens last.
- **Parallel workflow:** Code Review Agent and Test Agent run concurrently after the planner creates shared context.
- **Conditional branching:** supervisor feedback determines whether the workflow accepts the report or triggers refinement.
- **Supervisor pattern:** the Supervisor Agent evaluates the combined outputs before the report is finalized.
- **Refinement loop:** the workflow allows one additional refinement pass, with a maximum of two supervisor iterations.
- **Markdown report generation:** the final report is written to `output/code-review-report.md`.
- **Read-only repository review:** the prompts instruct agents not to modify files, and the orchestrator only generates its own report.

## Requirements

- Node.js 18 or later
- npm
- A Codex/OpenAI environment configured for `@openai/codex-sdk`

Depending on your environment, authentication may use `OPENAI_API_KEY` or the same Codex setup you use for the Codex CLI.

Copy `.env.example` if you want a local environment file:

```bash
cp .env.example .env
```

Then set your credentials as appropriate.

## Security Notes

- `.env` is for local development only and is ignored by git.
- `.env.example` must never contain real secrets.
- API keys and other credentials must not be committed to the repository.

## Installation

```bash
npm install
```

## Run

Review a specific local repository:

```bash
npm run review -- --repo ../some-project
```

Review recent git changes in pull-request style:

```bash
npm run review -- --repo . --diff
```

Review the current directory:

```bash
npm run review
```

Show CLI help:

```bash
npm run review -- --help
```

## Demo

Run the orchestrator against this project:

```bash
npm run review -- --repo .
```

The terminal logs show each workflow stage, including:

- `Sequential workflow: planning`
- `Parallel workflow: code review and test review`
- `Conditional branch: deciding whether fix proposals are useful`
- `Supervisor loop: up to 2 iteration(s)`
- the final report path

## Git Diff / PR Review Mode

Diff mode is a bonus feature beyond the base assignment. It focuses the review on recent code changes instead of the whole repository, which simulates a pull-request style code review.

Run diff mode with:

```bash
npm run review -- --repo . --diff
```

When `--diff` is provided, the orchestrator reads git changes from the target repository. It first tries:

```bash
git diff HEAD~1..HEAD
```

If that command is unavailable, it falls back to:

```bash
git diff
```

The diff context is passed to the Planner, Code Review, Test, Fix Proposal, and Supervisor agents. The final report includes `Review mode: Git diff review` and a short `Diff Summary` section. If no changes are detected, the command still generates a report explaining that there was no diff to review.

## Output

The generated report is written to:

```text
output/code-review-report.md
```

The report includes:

- repository path
- review mode
- diff summary when `--diff` is used
- planner review strategy
- code quality and security findings
- test coverage assessment
- concrete fix proposals
- supervisor decision
- orchestration pattern summary

## Development

Run TypeScript checks:

```bash
npm run typecheck
```

Build the project:

```bash
npm run build
```

Run in development mode:

```bash
npm run dev -- --repo ../some-project
```

## How This Fulfills The Assignment

This project uses the OpenAI Codex SDK as the core mechanism for controlling coding agents programmatically. It creates a multi-agent code review workflow with five roles, explicit terminal logging, sequential and parallel control flow, conditional branching, bounded refinement iteration, supervisor evaluation, and a final Markdown report.

It is runnable from the command line and organized as a normal TypeScript project suitable for GitHub submission.

## Limitations

- The orchestrator is intentionally read-only and does not modify the target repository.
- Report quality depends on Codex authentication, model availability, and the files accessible in the local environment.
- The supervisor loop is capped at two iterations to keep the workflow predictable for a homework demo.
- The tool proposes fixes and tests, but it does not apply patches or execute the target repository's test suite.
