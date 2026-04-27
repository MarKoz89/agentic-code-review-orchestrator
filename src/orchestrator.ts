import path from "node:path";

import { createCodeReviewPrompt } from "./agents/codeReviewAgent.js";
import { createFixProposalPrompt } from "./agents/fixProposalAgent.js";
import { createPlannerPrompt } from "./agents/plannerAgent.js";
import { createSupervisorPrompt } from "./agents/supervisorAgent.js";
import { createTestPrompt } from "./agents/testAgent.js";
import { runCodexAgent } from "./codexClient.js";
import { Logger } from "./logger.js";
import { writeMarkdownReport } from "./reportWriter.js";
import type { AgentName, AgentResult, ReviewState } from "./types.js";

const MAX_SUPERVISOR_ITERATIONS = 2;

function isAccepted(supervisorOutput: string): boolean {
  return supervisorOutput.trim().toUpperCase().startsWith("ACCEPT");
}

function shouldSkipFixProposal(plan: string, codeReview: string, testReview: string): boolean {
  const combined = `${plan}\n${codeReview}\n${testReview}`.toLowerCase();
  return combined.includes("no files found") || combined.includes("repository is empty");
}

async function runAgent(agentName: AgentName, prompt: string): Promise<AgentResult> {
  const output = await runCodexAgent(agentName, prompt);
  return {
    agentName,
    prompt,
    output
  };
}

export async function runReview(repoPathInput: string): Promise<string> {
  const logger = new Logger();
  const repoPath = path.resolve(repoPathInput);

  const state: ReviewState = {
    context: {
      repoPath,
      maxSupervisorIterations: MAX_SUPERVISOR_ITERATIONS
    },
    supervisorIterations: [],
    accepted: false,
    finalDecision: "Not evaluated"
  };

  logger.step(`Starting review for ${repoPath}`);

  logger.step("Sequential workflow: planning");
  state.planner = await runAgent("Planner Agent", createPlannerPrompt(repoPath));

  logger.step("Sequential workflow: code review");
  state.codeReview = await runAgent(
    "Code Review Agent",
    createCodeReviewPrompt(repoPath, state.planner.output)
  );

  logger.step("Sequential workflow: test review");
  state.testReview = await runAgent(
    "Test Agent",
    createTestPrompt(repoPath, state.planner.output, state.codeReview.output)
  );

  logger.step("Conditional branch: deciding whether fix proposals are useful");
  if (shouldSkipFixProposal(state.planner.output, state.codeReview.output, state.testReview.output)) {
    logger.warn("Repository appears empty or unanalyzable; producing a minimal fix proposal.");
  }

  state.fixProposal = await runAgent(
    "Fix Proposal Agent",
    createFixProposalPrompt(
      repoPath,
      state.planner.output,
      state.codeReview.output,
      state.testReview.output
    )
  );

  logger.step(`Supervisor loop: up to ${MAX_SUPERVISOR_ITERATIONS} iteration(s)`);
  for (let iteration = 1; iteration <= MAX_SUPERVISOR_ITERATIONS; iteration += 1) {
    const supervisor = await runAgent(
      "Supervisor Agent",
      createSupervisorPrompt(
        repoPath,
        state.planner.output,
        state.codeReview.output,
        state.testReview.output,
        state.fixProposal.output,
        iteration,
        MAX_SUPERVISOR_ITERATIONS
      )
    );

    state.supervisorIterations.push(supervisor);
    state.finalDecision = supervisor.output.split("\n")[0]?.trim() || "No decision";

    if (isAccepted(supervisor.output)) {
      logger.info("Supervisor accepted the report.");
      state.accepted = true;
      break;
    }

    if (iteration < MAX_SUPERVISOR_ITERATIONS) {
      logger.warn("Supervisor requested revisions; running one refined fix proposal pass.");
      state.fixProposal = await runAgent(
        "Fix Proposal Agent",
        createFixProposalPrompt(
          repoPath,
          state.planner.output,
          state.codeReview.output,
          state.testReview.output,
          supervisor.output
        )
      );
    } else {
      logger.warn("Supervisor did not accept before the maximum iteration limit.");
    }
  }

  logger.step("Writing Markdown report");
  const reportPath = await writeMarkdownReport(state);
  logger.info(`Report written to ${reportPath}`);
  return reportPath;
}
