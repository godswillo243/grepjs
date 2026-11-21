import fs from "fs";
import readline from "readline";
import type { CliArgs } from "./types.js";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

export async function searchFile(
  args: CliArgs & { filePath: string; pattern: string },
) {
  const {
    filePath,
    isCaseSensitive,
    matchWholeWord,
    pattern,
    showAfter,
    showBefore,
    showLineNumber,
    showOnlyCount,
  } = args;

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exitCode = 2;
    return;
  }

  let regex: RegExp;

  try {
    const matchWholeWordCheck = (w: string) =>
      matchWholeWord ? `\\b${w}\\b` : w;

    const flags = isCaseSensitive ? "g" : "gi";
    regex = new RegExp(matchWholeWordCheck(pattern), flags);
  } catch (e) {
    console.error(`Error: Invalid regular expression: ${pattern}`);
    process.exitCode = 2;
    return;
  }

  const readStream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  let matchCount = 0;
  const outputLines: { lineNumber: number; line: string }[] = [];
  let lineNumber = 1;

  const beforeLines: { lineNumber: number; line: string }[] = [];
  let tailRemaining = 0;

  try {
    for await (const line of rl) {
      regex.lastIndex = 0;
      const isMatch = regex.test(line);

      if (!isMatch) beforeLines.push({ lineNumber, line });
      if (beforeLines.length > showBefore) beforeLines.shift();

      if (isMatch) {
        if (!showOnlyCount) {
          beforeLines.forEach((v) => {
            if (v.lineNumber !== lineNumber) outputLines.push(v);
          });
          outputLines.push({ lineNumber, line });
          tailRemaining = Math.max(tailRemaining, showAfter);
        }
        matchCount++;
      } else if (tailRemaining > 0) {
        tailRemaining--;
        outputLines.push({ line, lineNumber });
      }
      lineNumber++;
    }
  } catch (error) {
    console.error("Error reading file:", error);
    process.exitCode = 2;
  } finally {
    rl.close();
  }

  // OUTPUTS
  console.log(`>> ${GREEN}${matchCount}${RESET} matches found for ${filePath}`);

  outputLines.forEach(({ line, lineNumber }) => {
    const prefix = showLineNumber ? `${GREEN}${lineNumber}${RESET} ` : "";
    console.log(`${prefix}${line.replace(regex, (v) => `${RED}${v}${RESET}`)}`);
  });
}
