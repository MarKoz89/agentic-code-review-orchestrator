# Agentic Code Review Orchestrator

A GitHub-ready TypeScript project that demonstrates practical usage of the OpenAI Codex SDK for a coding-agent orchestration workflow.

## Overview

The orchestrator analyzes a local code repository, coordinates multiple Codex-powered coding agents, and writes a structured Markdown engineering report to `output/code-review-report.md`.

## Purpose

This project is designed as a course homework submission for an agentic engineering assignment. It shows how a software engineering workflow can be decomposed into specialized agents, orchestrated with explicit control flow, and evaluated by a supervisor agent before producing a final artifact.

The implementation is intentionally small and readable. The important part is the orchestration pattern, not framework complexity.

## Architecture

The CLI entrypoint is `src/index.ts`. It parses the target repository path and calls the orchestrator.

The main workflow lives in `src/orchestrator.ts`. It calls the Codex client wrapper, runs the agents in order, handles supervisor feedback, and writes the final report.

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

## Workflow Patterns

This project demonstrates the required orchestration patterns:

- **Sequential workflow:** Planner -> Code Review -> Test Review -> Fix Proposal.
- **Conditional branching:** the orchestrator checks whether the repository appears empty or unanalyzable and logs that branch before producing a minimal proposal.
- **Loop with maximum iterations:** the supervisor can request a refined fix proposal, but the loop is capped at two supervisor iterations.
- **Supervisor pattern:** the supervisor reviews all outputs and determines whether the report is acceptable.

## Assignment Mapping

- **Practical Codex SDK usage:** `src/codexClient.ts` wraps `@openai/codex-sdk` and starts Codex threads programmatically.
- **Multi-agent workflow:** the orchestrator coordinates Planner, Code Review, Test, Fix Proposal, and Supervisor agents.
- **Sequential workflow:** the first four agents run in a fixed order so each step builds on the previous output.
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

## Security Note

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

Review the current directory:

```bash
npm run review
```

Show CLI help:

```bash
npm run review -- --help
```

## Output

The generated report is written to:

```text
output/code-review-report.md
```

The report includes:

- repository path
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

This project uses the OpenAI Codex SDK as the core mechanism for controlling coding agents programmatically. It creates a multi-agent code review workflow with five roles, explicit terminal logging, conditional control flow, bounded iteration, supervisor evaluation, and a final Markdown report.

It is runnable from the command line and organized as a normal TypeScript project suitable for GitHub submission.

## Limitations

- The orchestrator is intentionally read-only and does not modify the target repository.
- Report quality depends on Codex authentication, model availability, and the files accessible in the local environment.
- The supervisor loop is capped at two iterations to keep the workflow predictable for a homework demo.
- The tool proposes fixes and tests, but it does not apply patches or execute the target repository's test suite.
