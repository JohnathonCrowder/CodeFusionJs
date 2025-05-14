import React, { useState, useEffect, useMemo } from "react";
import {
  FaBrain,
  FaSpinner,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
  FaFileCode,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

interface FileData {
  name: string;
  content: string;
  visible: boolean;
  children?: FileData[];
  path?: string;
}

interface FileAnalysis {
  fileName: string;
  fileSize: string;
  lineCount: number;
  longLines: number;
  todoCount: number;
  importCount: number;
  codeLines: number;
  blankLines: number;
  hasIssues: boolean;
  issues: string[];
}

interface SmartCodeAnalyzerProps {
  fileData: FileData[];
  isVisible: boolean;
  onToggle: () => void;
}

// Simplified analyzer that returns one analysis per file
class SimpleCodeAnalyzer {
  private getFileExtension(fileName: string): string {
    return fileName.split(".").pop()?.toLowerCase() || "unknown";
  }

  analyzeFile(file: FileData): FileAnalysis {
    const content = file.content;
    const lines = content.split("\n");
    const issues: string[] = [];

    // Basic metrics
    const fileSize = `${(content.length / 1024).toFixed(1)}KB`;
    const lineCount = lines.length;
    const blankLines = lines.filter((line) => line.trim() === "").length;
    const codeLines = lineCount - blankLines;

    // Find long lines
    const longLines = lines.filter((line) => line.length > 120).length;
    if (longLines > 0) {
      issues.push(`${longLines} long lines (>120 chars)`);
    }

    // Count TODO comments
    const todoPattern = /\b(TODO|FIXME|HACK|XXX|NOTE)\b/i;
    const todoCount = lines.filter((line) => {
      const isComment =
        line.trim().startsWith("//") ||
        line.trim().startsWith("/*") ||
        line.trim().startsWith("*") ||
        line.trim().startsWith("#");
      return isComment && todoPattern.test(line);
    }).length;

    if (todoCount > 0) {
      issues.push(`${todoCount} TODO/FIXME notes`);
    }

    // Fixed import counting - handle both single line and multiline imports
    let importCount = 0;

    // Count ES6 imports (including multiline)
    const esImportPattern = /import\s+[\s\S]*?\bfrom\s+(['"][^'"]*['"])/g;
    const esImports = content.match(esImportPattern) || [];
    importCount += esImports.length;

    // Count CommonJS require statements
    const requirePattern = /require\s*\(\s*['"][^'"]*['"]\s*\)/g;
    const requireImports = content.match(requirePattern) || [];
    importCount += requireImports.length;

    // Check for large file
    if (content.length > 102400) {
      // 100KB
      issues.push("Large file size");
    }

    // Check for mixed indentation
    const hasSpaces = lines.some((line) => line.startsWith(" "));
    const hasTabs = lines.some((line) => line.startsWith("\t"));
    if (hasSpaces && hasTabs) {
      issues.push("Mixed indentation (spaces & tabs)");
    }

    return {
      fileName: file.name,
      fileSize,
      lineCount,
      longLines,
      todoCount,
      importCount,
      codeLines,
      blankLines,
      hasIssues: issues.length > 0,
      issues,
    };
  }

  analyze(files: FileData[]): FileAnalysis[] {
    const results: FileAnalysis[] = [];

    const analyzeFile = (file: FileData) => {
      if (!file.content || !file.visible) return;

      // Only analyze text files
      const ext = this.getFileExtension(file.name);
      const textExtensions = [
        "js",
        "jsx",
        "ts",
        "tsx",
        "css",
        "scss",
        "html",
        "json",
        "md",
        "txt",
        "py",
        "java",
        "cpp",
        "c",
        "h",
      ];

      if (textExtensions.includes(ext)) {
        results.push(this.analyzeFile(file));
      }
    };

    const processFiles = (files: FileData[]) => {
      files.forEach((file) => {
        if (file.children) {
          processFiles(file.children);
        } else {
          analyzeFile(file);
        }
      });
    };

    processFiles(files);

    // Sort by issues first, then by file size
    results.sort((a, b) => {
      if (a.hasIssues && !b.hasIssues) return -1;
      if (!a.hasIssues && b.hasIssues) return 1;
      return b.lineCount - a.lineCount;
    });

    return results;
  }

  private flattenFiles(files: FileData[]): FileData[] {
    const result: FileData[] = [];
    files.forEach((file) => {
      if (file.children) {
        result.push(...this.flattenFiles(file.children));
      } else {
        result.push(file);
      }
    });
    return result;
  }
}

// Clean, simple component
const SmartCodeAnalyzer: React.FC<SmartCodeAnalyzerProps> = ({
  fileData,
  isVisible,
  onToggle,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FileAnalysis[]>([]);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const analyzer = useMemo(() => new SimpleCodeAnalyzer(), []);

  useEffect(() => {
    if (isVisible && fileData.length > 0) {
      runAnalysis();
    }
  }, [isVisible, fileData, analyzer]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const analysisResults = analyzer.analyze(fileData);
      setResults(analysisResults);
    } catch (error) {
      console.error("Analysis failed:", error);
    }

    setIsAnalyzing(false);
  };

  const toggleFile = (fileName: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(fileName)) {
      newExpanded.delete(fileName);
    } else {
      newExpanded.add(fileName);
    }
    setExpandedFiles(newExpanded);
  };

  const projectSummary = useMemo(() => {
    const totalFiles = results.length;
    const totalLines = results.reduce((sum, file) => sum + file.lineCount, 0);
    const filesWithIssues = results.filter((file) => file.hasIssues).length;
    const totalSize = results.reduce(
      (sum, file) => sum + parseFloat(file.fileSize),
      0
    );

    return { totalFiles, totalLines, filesWithIssues, totalSize };
  }, [results]);

  if (!isVisible) return null;

  return (
    <div className="bg-white border-l border-gray-300 w-1/3 flex flex-col h-full">
      {/* Simple header */}
      <div className="bg-gray-50 border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaBrain className="text-blue-600 text-xl" />
            <h2 className="text-lg font-semibold text-gray-900">
              File Analysis
            </h2>
          </div>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
      </div>

      {/* Project Summary */}
      {!isAnalyzing && results.length > 0 && (
        <div className="bg-blue-50 border-b p-4">
          <h3 className="font-medium text-blue-900 mb-2">Project Overview</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded p-2">
              <span className="text-gray-600">Files:</span>
              <span className="font-medium ml-2">
                {projectSummary.totalFiles}
              </span>
            </div>
            <div className="bg-white rounded p-2">
              <span className="text-gray-600">Lines:</span>
              <span className="font-medium ml-2">
                {projectSummary.totalLines.toLocaleString()}
              </span>
            </div>
            <div className="bg-white rounded p-2">
              <span className="text-gray-600">With Issues:</span>
              <span className="font-medium ml-2">
                {projectSummary.filesWithIssues}
              </span>
            </div>
            <div className="bg-white rounded p-2">
              <span className="text-gray-600">Total Size:</span>
              <span className="font-medium ml-2">
                {projectSummary.totalSize.toFixed(1)}KB
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Simple re-analyze button */}
      <div className="p-4 border-b">
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <FaSearch />
              <span>Analyze Files</span>
            </>
          )}
        </button>
      </div>

      {/* File list - one dropdown per file */}
      <div className="flex-1 overflow-y-auto">
        {isAnalyzing ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <FaSpinner className="animate-spin text-2xl text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Analyzing files...</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="p-4 space-y-2">
            {results.map((file) => (
              <FileItem
                key={file.fileName}
                file={file}
                isExpanded={expandedFiles.has(file.fileName)}
                onToggle={() => toggleFile(file.fileName)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <FaCheckCircle className="text-2xl text-green-600 mx-auto mb-2" />
              <p className="text-gray-600">No files to analyze</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple file item with one dropdown
const FileItem: React.FC<{
  file: FileAnalysis;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ file, isExpanded, onToggle }) => {
  const getStatusIcon = () => {
    if (file.hasIssues) {
      return <FaExclamationCircle className="text-orange-500" />;
    }
    return <FaCheckCircle className="text-green-500" />;
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <FaFileCode className="text-gray-400" />
          <span className="font-medium text-gray-900">{file.fileName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{file.fileSize}</span>
          <span className="text-xs text-gray-500">{file.lineCount} lines</span>
          {isExpanded ? (
            <FaChevronDown className="text-gray-400" />
          ) : (
            <FaChevronRight className="text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          <div className="space-y-3">
            {/* File metrics */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Code lines:</span>
                <span className="ml-2 font-medium">{file.codeLines}</span>
              </div>
              <div>
                <span className="text-gray-600">Blank lines:</span>
                <span className="ml-2 font-medium">{file.blankLines}</span>
              </div>
              <div>
                <span className="text-gray-600">Imports:</span>
                <span className="ml-2 font-medium">{file.importCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Long lines:</span>
                <span className="ml-2 font-medium">{file.longLines}</span>
              </div>
            </div>

            {/* Issues */}
            {file.hasIssues && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Issues Found:
                </h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  {file.issues.map((issue, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No issues */}
            {!file.hasIssues && (
              <div className="flex items-center space-x-2 text-green-700">
                <FaCheckCircle />
                <span className="text-sm">No issues detected</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCodeAnalyzer;
