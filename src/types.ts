export interface CliArgs {
  pattern?: string;
  filePath?: string;
  folderPath?: string;
  showLineNumber: boolean;
  isCaseSensitive: boolean;
  showOnlyCount: boolean;
  matchWholeWord: boolean;
  searchDirectories: boolean;
  showAfter: number;
  showBefore: number;
  isHelp: boolean;
}
