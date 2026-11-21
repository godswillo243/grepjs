import { parseArguments } from "./cli.js";
import { searchFile } from "./search.js";

async function main() {
  try {
    const args = process.argv.slice(2);

    const opts = parseArguments(args);

    if (opts.isHelp) {
      console.log(
        `Usage: grepjs [flags] <pattern> <file>\nFlags:\n -n  Hide line numbers\n -s  Disable case-insensitive matching\n -c  Only display match count\n -w  Match whole word\n -r  Search in directories\n -A, -B  Show lines before and after matches`,
      );
      return;
    }

    const { filePath, pattern, ...otherOpts } = opts;

    if (!filePath || !pattern) {
      console.error(
        'Error: Usage: grepjs [flags] <pattern> <file>\n  use "grepjs -h" for help',
      );
      process.exitCode = 2;
      return;
    }

    await searchFile({ filePath, pattern, ...otherOpts });
  } catch (error: any) {
    console.error(`${error.message}\n`);
  }
}

main();
