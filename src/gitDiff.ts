import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

interface DiffCommandResult {
  diff: string;
  source: string;
}

export interface GitDiffResult {
  diff: string;
  source: string;
  summary: string;
}

async function runGitDiff(repoPath: string, args: string[], source: string): Promise<DiffCommandResult> {
  const { stdout } = await execFileAsync("git", args, {
    cwd: repoPath,
    maxBuffer: 10 * 1024 * 1024
  });

  return {
    diff: stdout.trim(),
    source
  };
}

function summarizeDiff(diff: string, source: string): string {
  if (!diff.trim()) {
    return `No changes detected from ${source}.`;
  }

  const files = new Set<string>();
  let additions = 0;
  let deletions = 0;

  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      const match = line.match(/ b\/(.+)$/);
      if (match?.[1]) {
        files.add(match[1]);
      }
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      additions += 1;
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      deletions += 1;
    }
  }

  const fileList = Array.from(files).slice(0, 12);
  const extraFileCount = Math.max(files.size - fileList.length, 0);
  const fileSummary =
    fileList.length > 0
      ? `${fileList.join(", ")}${extraFileCount > 0 ? `, and ${extraFileCount} more` : ""}`
      : "No file paths detected";

  return [
    `Diff source: ${source}`,
    `Changed files: ${files.size}`,
    `Approximate additions: ${additions}`,
    `Approximate deletions: ${deletions}`,
    `Files: ${fileSummary}`
  ].join("\n");
}

export async function readGitDiff(repoPath: string): Promise<GitDiffResult> {
  let result: DiffCommandResult;

  try {
    result = await runGitDiff(repoPath, ["diff", "HEAD~1..HEAD"], "git diff HEAD~1..HEAD");
  } catch {
    try {
      result = await runGitDiff(repoPath, ["diff"], "git diff");
    } catch {
      result = {
        diff: "",
        source: "git diff unavailable"
      };
    }
  }

  return {
    diff: result.diff,
    source: result.source,
    summary: summarizeDiff(result.diff, result.source)
  };
}
