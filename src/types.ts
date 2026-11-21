export interface CliArgs {
  pattern: string | undefined;
  filePath: string | undefined;
  showLineNumber: boolean;
  isCaseSensitive: boolean;
  showOnlyCount: boolean;
  matchWholeWord: boolean;
  searchDirectories: boolean;
  showAfter: number;
  showBefore: number;
  isHelp: boolean;
}
