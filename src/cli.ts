import type { CliArgs } from "./types.js";

export function parseArguments(args: string[]): CliArgs {
  let pattern: string | undefined;
  let filePath: string | undefined;
  let folderPath: string | undefined;
  let showLineNumber = true;
  let isCaseSensitive = false;
  let showOnlyCount = false;
  let matchWholeWord = false;
  let searchDirectories = false;
  let showAfter = 0;
  let showBefore = 0;
  let isHelp = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    if (arg === "-h" || arg === "--help") {
      isHelp = true;
      continue;
    }
    switch (arg.trim()) {
      case "-n":
        showLineNumber = false;
        break;

      case "-s":
        isCaseSensitive = true;
        break;

      case "-c":
        showOnlyCount = true;
        break;

      case "-w":
        matchWholeWord = true;
        break;

      case "-r":
        searchDirectories = true;
        break;

      case "-A":
      case "-B": {
        const value = args[++i];

        if (!value || !/^\d+$/.test(value)) {
          throw new Error(`Option ${arg} requires a non-negative integer`);
        }
        const count = Number(value);
        if (arg === "-A") showAfter = count;
        if (arg === "-B") showBefore = count;

        continue;
      }

      default:
        if (arg.startsWith("-")) {
          throw new Error(`Unknown option "${arg}"`);
        }
        if (!pattern) {
          pattern = arg;
        } else if (!filePath || !folderPath) {
          if (args.includes("-r")) {
            folderPath = arg;
          } else {
            filePath = arg;
          }
        } else {
          throw new Error(`Unexpected argument "${arg}"`);
        }
    }
  }

  return {
    pattern,
    filePath,
    folderPath,
    showLineNumber,
    isCaseSensitive,
    showOnlyCount,
    matchWholeWord,
    searchDirectories,
    showAfter,
    showBefore,
    isHelp,
  };
}
