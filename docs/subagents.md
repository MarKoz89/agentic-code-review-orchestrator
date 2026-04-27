# Subagents

All subagents are Codex-controlled roles coordinated by the TypeScript orchestrator. They inspect and reason about repositories, but they do not modify files.

## Planner Agent

- **Role:** Planning and repository discovery.
- **Responsibilities:** Inspect project structure, identify languages and frameworks, find important files, and define the review plan.
- **Input:** Target repository path.
- **Output:** Repository snapshot, review strategy, files or areas to inspect, and risks or unknowns.
- **Modifies files:** No.

## Code Review Agent

- **Role:** Engineering code reviewer.
- **Responsibilities:** Review code quality, likely bugs, security risks, maintainability, and architecture.
- **Input:** Target repository path and Planner Agent output.
- **Output:** Executive summary, findings, security notes, maintainability notes, and recommended priorities.
- **Modifies files:** No.

## Test Agent

- **Role:** Test coverage reviewer.
- **Responsibilities:** Inspect test setup, identify test gaps, and propose missing tests.
- **Input:** Target repository path and Planner Agent output.
- **Output:** Existing test coverage summary, test gaps, proposed test cases, and suggested test commands.
- **Modifies files:** No.

## Fix Proposal Agent

- **Role:** Improvement planner.
- **Responsibilities:** Convert review and test findings into concrete patch-level recommendations.
- **Input:** Target repository path, Planner Agent output, Code Review Agent output, Test Agent output, and optional Supervisor Agent feedback.
- **Output:** Proposed fixes, implementation notes, validation plan, and residual risks.
- **Modifies files:** No.

## Supervisor Agent

- **Role:** Final evaluator.
- **Responsibilities:** Evaluate whether the combined agent outputs are acceptable, decide accept or revise, and provide refinement instructions when needed.
- **Input:** Target repository path and all prior agent outputs.
- **Output:** Decision, rationale, required revisions, and report quality notes.
- **Modifies files:** No.
