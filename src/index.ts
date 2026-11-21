import path from "path";
import { parseArguments } from "./cli.js";
import { searchFile } from "./search.js";
import fsPromises from "fs/promises";

async function readDir(dirPath: string) {
  const entries = await fsPromises.readdir(path.resolve(dirPath), {
    withFileTypes: true,
  });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await readDir(fullPath)));
    } else results.push(fullPath);
  }
  return results;
}

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

    const { filePath, folderPath, pattern, ...otherOpts } = opts;

    if ((!filePath && !folderPath) || !pattern) {
      console.error(
        'Error: Usage: grepjs [flags] <pattern> <file>\n  use "grepjs -h" for help',
      );
      process.exitCode = 2;
      return;
    }
    console.log({
      folderPath,
      filePath,
    });
    if (folderPath) {
      const filePaths = await readDir(folderPath);
      console.log(filePaths);
      for (const filePath of filePaths) {
        await searchFile({ filePath, pattern, ...otherOpts });
      }
    } else if (filePath) {
      await searchFile({ filePath, pattern, ...otherOpts });
    }
  } catch (error: any) {
    console.error(`${error.message}\n`);
  }
}

main();
