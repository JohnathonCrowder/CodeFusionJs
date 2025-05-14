import React, { useState, useEffect, useMemo, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaBrain,
  FaSpinner,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
  FaFileCode,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimes,
  FaSync,
  FaChartBar,
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
}

// Clean, simple component
const SmartCodeAnalyzer: React.FC<SmartCodeAnalyzerProps> = ({
  fileData,
  isVisible,
  onToggle,
}) => {
  const { darkMode } = useContext(ThemeContext);
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
    <div className={`w-96 border-l flex flex-col h-full transition-colors duration-300
                   ${darkMode 
                     ? 'bg-dark-800 border-dark-600' 
                     : 'bg-white border-gray-200'}`}>
      
      {/* Header */}
      <div className={`p-6 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg transition-colors duration-300
                           ${darkMode 
                             ? 'bg-purple-600/20 text-purple-400' 
                             : 'bg-purple-100 text-purple-600'}`}>
              <FaBrain className="text-xl" />
            </div>
            <div>
              <h2 className={`text-lg font-semibold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                Code Analysis
              </h2>
              <p className={`text-sm transition-colors duration-300
                           ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                Analyze code quality
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-all duration-200
                      ${darkMode
                        ? 'hover:bg-dark-600 text-dark-300 hover:text-dark-100' 
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
      </div>

      {/* Project Summary */}
      {!isAnalyzing && results.length > 0 && (
        <div className={`p-4 border-b transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-700/50 border-dark-600' 
                         : 'bg-blue-50/50 border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-3">
            <FaChartBar className={`h-4 w-4 
                                   ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`font-medium transition-colors duration-300
                           ${darkMode ? 'text-dark-100' : 'text-gray-800'}`}>
              Project Overview
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg transition-colors duration-300
                           ${darkMode ? 'bg-dark-800' : 'bg-white shadow-sm'}`}>
              <div className={`text-xs mb-1 transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>Files</div>
              <div className={`text-lg font-semibold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                {projectSummary.totalFiles}
              </div>
            </div>
            <div className={`p-3 rounded-lg transition-colors duration-300
                           ${darkMode ? 'bg-dark-800' : 'bg-white shadow-sm'}`}>
              <div className={`text-xs mb-1 transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>Lines</div>
              <div className={`text-lg font-semibold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                {projectSummary.totalLines.toLocaleString()}
              </div>
            </div>
            <div className={`p-3 rounded-lg transition-colors duration-300
                           ${darkMode ? 'bg-dark-800' : 'bg-white shadow-sm'}`}>
              <div className={`text-xs mb-1 transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>Issues</div>
              <div className={`text-lg font-semibold transition-colors duration-300
                             ${projectSummary.filesWithIssues > 0 
                               ? 'text-orange-500' 
                               : (darkMode ? 'text-green-400' : 'text-green-600')}`}>
                {projectSummary.filesWithIssues}
              </div>
            </div>
            <div className={`p-3 rounded-lg transition-colors duration-300
                           ${darkMode ? 'bg-dark-800' : 'bg-white shadow-sm'}`}>
              <div className={`text-xs mb-1 transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>Size</div>
              <div className={`text-lg font-semibold transition-colors duration-300
                             ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                {projectSummary.totalSize.toFixed(1)}KB
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Button */}
      <div className={`p-4 border-b transition-colors duration-300
                     ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 
                    rounded-lg font-semibold transition-all duration-200 disabled:opacity-50
                    ${darkMode
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-dark'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'}`}
        >
          {isAnalyzing ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <FaSync />
              <span>Analyze Files</span>
            </>
          )}
        </button>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto">
        {isAnalyzing ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <FaSpinner className={`animate-spin text-2xl mx-auto mb-2
                                   ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <p className={`transition-colors duration-300
                           ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                Analyzing files...
              </p>
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
              <FaCheckCircle className={`text-2xl mx-auto mb-2
                                       ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <p className={`transition-colors duration-300
                           ${darkMode ? 'text-dark-300' : 'text-gray-600'}`}>
                No files to analyze
              </p>
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
  const { darkMode } = useContext(ThemeContext);

  const getStatusIcon = () => {
    if (file.hasIssues) {
      return <FaExclamationCircle className="text-orange-500" />;
    }
    return <FaCheckCircle className={darkMode ? 'text-green-400' : 'text-green-500'} />;
  };

  return (
    <div className={`border rounded-lg transition-all duration-300
                   ${darkMode 
                     ? 'border-dark-600 bg-dark-700' 
                     : 'border-gray-200 bg-white'}`}>
      <div
        className={`flex items-center justify-between p-3 cursor-pointer
                  transition-colors duration-200
                  ${darkMode ? 'hover:bg-dark-600' : 'hover:bg-gray-50'}`}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {getStatusIcon()}
          <FaFileCode className={darkMode ? 'text-dark-400' : 'text-gray-400'} />
          <span className={`font-medium truncate transition-colors duration-300
                          ${darkMode ? 'text-dark-200' : 'text-gray-900'}`}>
            {file.fileName}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs transition-colors duration-300
                          ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
            {file.fileSize}
          </span>
          <span className={`text-xs transition-colors duration-300
                          ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
            {file.lineCount} lines
          </span>
          <div className={`transition-colors duration-300
                         ${darkMode ? 'text-dark-400' : 'text-gray-400'}`}>
            {isExpanded ? (
              <FaChevronDown className="h-3 w-3" />
            ) : (
              <FaChevronRight className="h-3 w-3" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={`border-t p-3 transition-colors duration-300
                       ${darkMode 
                         ? 'border-dark-600 bg-dark-800' 
                         : 'border-gray-200 bg-gray-50'}`}>
          <div className="space-y-3">
            {/* File metrics */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className={`transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Code lines:
                </span>
                <span className={`ml-2 font-medium transition-colors duration-300
                               ${darkMode ? 'text-dark-200' : 'text-gray-900'}`}>
                  {file.codeLines}
                </span>
              </div>
              <div>
                <span className={`transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Blank lines:
                </span>
                <span className={`ml-2 font-medium transition-colors duration-300
                               ${darkMode ? 'text-dark-200' : 'text-gray-900'}`}>
                  {file.blankLines}
                </span>
              </div>
              <div>
                <span className={`transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Imports:
                </span>
                <span className={`ml-2 font-medium transition-colors duration-300
                               ${darkMode ? 'text-dark-200' : 'text-gray-900'}`}>
                  {file.importCount}
                </span>
              </div>
              <div>
                <span className={`transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Long lines:
                </span>
                <span className={`ml-2 font-medium transition-colors duration-300
                               ${darkMode ? 'text-dark-200' : 'text-gray-900'}`}>
                  {file.longLines}
                </span>
              </div>
            </div>

            {/* Issues */}
            {file.hasIssues && (
              <div>
                <h4 className={`text-sm font-medium mb-2 transition-colors duration-300
                               ${darkMode ? 'text-dark-300' : 'text-gray-700'}`}>
                  Issues Found:
                </h4>
                <ul className="space-y-1">
                  {file.issues.map((issue, index) => (
                    <li key={index} 
                        className={`flex items-center space-x-2 text-sm 
                                   ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                                      ${darkMode ? 'bg-orange-400' : 'bg-orange-500'}`}></span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No issues */}
            {!file.hasIssues && (
              <div className={`flex items-center space-x-2 
                             ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                <FaCheckCircle className="h-4 w-4" />
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