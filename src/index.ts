#!/usr/bin/env node
import "dotenv/config";

import { stat } from "node:fs/promises";
import path from "node:path";

import { runReview } from "./orchestrator.js";

function getArgValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

function hasHelpFlag(): boolean {
  return process.argv.includes("--help") || process.argv.includes("-h");
}

function hasDiffFlag(): boolean {
  return process.argv.includes("--diff");
}

function printHelp(): void {
  console.log(`
Agentic Code Review Orchestrator

Usage:
  npm run review -- --repo <path>
  npm run review -- --repo <path> --diff
  npm run review

Options:
  --repo <path>   Local repository to review. Defaults to current directory.
  --diff          Review recent git changes instead of the whole repository.
  -h, --help      Show this help text.
`);
}

async function main(): Promise<void> {
  if (hasHelpFlag()) {
    printHelp();
    return;
  }

  const repoArg = getArgValue("--repo") ?? process.cwd();
  const repoPath = path.resolve(repoArg);

  let repoStats;
  try {
    repoStats = await stat(repoPath);
  } catch {
    throw new Error(`Invalid --repo value: path does not exist: ${repoPath}`);
  }

  if (!repoStats.isDirectory()) {
    throw new Error(`Invalid --repo value: expected a directory, but got a file: ${repoPath}`);
  }

  await runReview(repoPath, {
    diffMode: hasDiffFlag()
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[error] ${message}`);
  process.exitCode = 1;
});
