# Project Skills

This project does not install marketplace skills and does not use plugins. The skills below are project-defined capabilities implemented through subagent prompts and orchestration logic.

## Repository Planning Skill

- **Purpose:** Inspect repository structure and define the review strategy.
- **Subagent:** Planner Agent.
- **Input:** Target repository path.
- **Output:** Repository snapshot, review strategy, important files or areas, and risks or unknowns.

## Code Review Skill

- **Purpose:** Review code quality, bugs, security risks, maintainability, and architecture.
- **Subagent:** Code Review Agent.
- **Input:** Target repository path and Planner Agent output.
- **Output:** Findings, security notes, maintainability notes, and recommended priorities.

## Test Review Skill

- **Purpose:** Inspect existing test coverage and propose missing tests.
- **Subagent:** Test Agent.
- **Input:** Target repository path and Planner Agent output.
- **Output:** Existing test coverage summary, test gaps, proposed test cases, and suggested test commands.

## Fix Proposal Skill

- **Purpose:** Propose concrete engineering improvements without changing files.
- **Subagent:** Fix Proposal Agent.
- **Input:** Target repository path, Planner Agent output, Code Review Agent output, Test Agent output, and optional Supervisor Agent feedback.
- **Output:** Proposed fixes, implementation notes, validation plan, and residual risks.

## Supervisor Evaluation Skill

- **Purpose:** Evaluate whether all agent outputs are acceptable for the final engineering report.
- **Subagent:** Supervisor Agent.
- **Input:** Target repository path and all prior agent outputs.
- **Output:** Accept or revise decision, rationale, required revisions, and report quality notes.

## Security Hygiene Skill

- **Purpose:** Keep the project safe for GitHub submission and prevent secret leakage.
- **Subagent:** Applies across all subagents and human maintenance.
- **Input:** Project files, generated outputs, and configuration examples.
- **Output:** Placeholder-only secret templates, ignored local files, read-only review behavior, and no plugin or marketplace usage.
