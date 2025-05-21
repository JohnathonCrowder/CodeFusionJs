export interface FileStats {
  totalFiles: number;
  totalLines: number;
  filesWithIssues: number;
  totalSize: number;
  sizeInKB: string;
}

export function calculateProjectStats(files: any[]): FileStats {
  let totalLines = 0;
  let totalSize = 0;
  let filesWithIssues = 0;
  let totalFiles = 0;

  // Recursive function to process files and directories
  const processFile = (file: any) => {
    if (file.visible) {
      if (file.content) {
        totalFiles++;
        const lines = file.content.split('\n');
        totalLines += lines.length;
        totalSize += new Blob([file.content]).size;
        
        // Check for issues (you can customize these criteria)
        const hasLongLines = lines.some((line: string) => line.length > 120);
        const hasMixedIndentation = lines.some((line: string) => line.startsWith(' ')) && 
                                  lines.some((line: string) => line.startsWith('\t'));
        if (hasLongLines || hasMixedIndentation) {
          filesWithIssues++;
        }
      }

      if (file.children) {
        file.children.forEach(processFile);
      }
    }
  };

  files.forEach(processFile);

  return {
    totalFiles,
    totalLines,
    filesWithIssues,
    totalSize,
    sizeInKB: (totalSize / 1024).toFixed(1)
  };
}