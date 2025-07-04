import React, { useState, useContext, useMemo, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  FaFileUpload,
  FaPaste,
  FaSync,
  FaCopy,
  FaExpand,
  FaCompress,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaTimes,
  FaFile,
  FaCode,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

interface FileContent {
  name: string;
  content: string;
  language?: string;
}

interface DiffChange {
  type: "added" | "removed" | "unchanged";
  text: string;
}

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
  changes?: DiffChange[];
}

interface GitDiffVisualizerProps {
  onClose?: () => void;
}

// Enhanced diff algorithm with better word-level and character-level diff
const computeLineDiff = (oldText: string, newText: string): DiffLine[] => {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const result: DiffLine[] = [];

  // LCS algorithm for better diff
  const lcs = (
    a: string[],
    b: string[]
  ): Array<{
    type: "added" | "removed" | "unchanged";
    line: string;
    oldIdx?: number;
    newIdx?: number;
  }> => {
    const dp: number[][] = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(0));

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to find the diff
    const diff: Array<{
      type: "added" | "removed" | "unchanged";
      line: string;
      oldIdx?: number;
      newIdx?: number;
    }> = [];
    let i = a.length,
      j = b.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
        diff.unshift({
          type: "unchanged",
          line: a[i - 1],
          oldIdx: i - 1,
          newIdx: j - 1,
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        diff.unshift({ type: "added", line: b[j - 1], newIdx: j - 1 });
        j--;
      } else if (i > 0) {
        diff.unshift({ type: "removed", line: a[i - 1], oldIdx: i - 1 });
        i--;
      }
    }

    return diff;
  };

  // Get word-level diff for modified lines
  const getWordDiff = (oldLine: string, newLine: string): DiffChange[] => {
    const oldWords = oldLine.split(/(\s+)/);
    const newWords = newLine.split(/(\s+)/);
    const wordDiff = lcs(oldWords, newWords);

    return wordDiff.map((item) => ({
      type: item.type,
      text: item.line,
    }));
  };

  const lineDiff = lcs(oldLines, newLines);
  let oldLineNum = 1;
  let newLineNum = 1;

  for (const item of lineDiff) {
    if (item.type === "unchanged") {
      result.push({
        type: "unchanged",
        content: item.line,
        oldLineNumber: oldLineNum++,
        newLineNumber: newLineNum++,
      });
    } else if (item.type === "removed") {
      result.push({
        type: "removed",
        content: item.line,
        oldLineNumber: oldLineNum++,
      });
    } else if (item.type === "added") {
      result.push({
        type: "added",
        content: item.line,
        newLineNumber: newLineNum++,
      });
    }
  }

  // Group adjacent removed/added lines as modified
  const optimizedResult: DiffLine[] = [];
  for (let i = 0; i < result.length; i++) {
    const current = result[i];

    if (
      current.type === "removed" &&
      i + 1 < result.length &&
      result[i + 1].type === "added"
    ) {
      const next = result[i + 1];
      const wordDiff = getWordDiff(current.content, next.content);

      optimizedResult.push({
        type: "removed",
        content: current.content,
        oldLineNumber: current.oldLineNumber,
        changes: wordDiff,
      });

      optimizedResult.push({
        type: "added",
        content: next.content,
        newLineNumber: next.newLineNumber,
        changes: wordDiff,
      });

      i++; // Skip the next item
    } else {
      optimizedResult.push(current);
    }
  }

  return optimizedResult;
};

const GitDiffVisualizer: React.FC<GitDiffVisualizerProps> = ({ onClose }) => {
  const { darkMode } = useContext(ThemeContext);

  // File content state
  const [leftFile, setLeftFile] = useState<FileContent>({
    name: "Original",
    content: "",
    language: "javascript",
  });

  const [rightFile, setRightFile] = useState<FileContent>({
    name: "Modified",
    content: "",
    language: "javascript",
  });

  // UI state
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
  const [highlightMode, setHighlightMode] = useState<"line" | "word">("word");

  // Language detection from file extension
  const detectLanguage = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      py: "python",
      java: "java",
      c: "c",
      cpp: "cpp",
      css: "css",
      scss: "scss",
      html: "html",
      json: "json",
      xml: "xml",
      yaml: "yaml",
      yml: "yaml",
      md: "markdown",
      sql: "sql",
      sh: "bash",
      go: "go",
      rust: "rust",
      php: "php",
      rb: "ruby",
      swift: "swift",
      kt: "kotlin",
    };
    return langMap[ext || ""] || "text";
  };

  // Handle file uploads
  const handleFileUpload = async (file: File, side: "left" | "right") => {
    try {
      const content = await readFileContent(file);
      const language = detectLanguage(file.name);

      const fileData = { name: file.name, content, language };

      if (side === "left") {
        setLeftFile(fileData);
      } else {
        setRightFile(fileData);
      }
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Handle text area changes
  const handleTextChange = (content: string, side: "left" | "right") => {
    if (side === "left") {
      setLeftFile((prev) => ({ ...prev, content }));
    } else {
      setRightFile((prev) => ({ ...prev, content }));
    }
  };

  // Handle language selection
  const handleLanguageChange = (language: string, side: "left" | "right") => {
    if (side === "left") {
      setLeftFile((prev) => ({ ...prev, language }));
    } else {
      setRightFile((prev) => ({ ...prev, language }));
    }
  };

  // Clear content
  const handleClear = (side?: "left" | "right") => {
    const emptyFile = { name: "", content: "", language: "javascript" };
    if (!side) {
      setLeftFile({ ...emptyFile, name: "Original" });
      setRightFile({ ...emptyFile, name: "Modified" });
    } else if (side === "left") {
      setLeftFile({ ...emptyFile, name: "Original" });
    } else {
      setRightFile({ ...emptyFile, name: "Modified" });
    }
  };

  // Swap files
  const handleSwap = () => {
    const temp = leftFile;
    setLeftFile({ ...rightFile, name: rightFile.name || "Original" });
    setRightFile({ ...temp, name: temp.name || "Modified" });
  };

  // Copy diff output
  const handleCopyDiff = () => {
    const diffText = generateUnifiedDiff(leftFile.content, rightFile.content);
    navigator.clipboard.writeText(diffText);
  };

  // Generate unified diff format
  const generateUnifiedDiff = (oldText: string, newText: string): string => {
    const diff = computeLineDiff(oldText, newText);
    let result = `--- ${leftFile.name}\n+++ ${rightFile.name}\n`;

    diff.forEach((line) => {
      if (line.type === "added") {
        result += `+${line.content}\n`;
      } else if (line.type === "removed") {
        result += `-${line.content}\n`;
      } else {
        result += ` ${line.content}\n`;
      }
    });

    return result;
  };

  // Calculate diff stats
  const diffStats = useMemo(() => {
    if (!leftFile.content && !rightFile.content) return null;

    const diff = computeLineDiff(leftFile.content, rightFile.content);
    const additions = diff.filter((line) => line.type === "added").length;
    const deletions = diff.filter((line) => line.type === "removed").length;

    return { additions, deletions, total: additions + deletions };
  }, [leftFile.content, rightFile.content]);

  // Compute diff for rendering
  const diff = useMemo(() => {
    return computeLineDiff(leftFile.content, rightFile.content);
  }, [leftFile.content, rightFile.content]);

  // Language options
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "jsx", label: "JSX" },
    { value: "tsx", label: "TSX" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "css", label: "CSS" },
    { value: "scss", label: "SCSS" },
    { value: "html", label: "HTML" },
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "xml", label: "XML" },
    { value: "markdown", label: "Markdown" },
    { value: "sql", label: "SQL" },
    { value: "bash", label: "Bash" },
    { value: "text", label: "Plain Text" },
  ];

  // Enhanced line rendering with proper diff highlighting
  const renderDiffLine = (line: DiffLine, index: number) => {
    const getLineClassNames = () => {
      const baseClasses = "flex hover:opacity-90 transition-opacity";
      switch (line.type) {
        case "added":
          return `${baseClasses} ${
            darkMode
              ? "bg-green-900/30 border-l-4 border-green-500"
              : "bg-green-50 border-l-4 border-green-500"
          }`;
        case "removed":
          return `${baseClasses} ${
            darkMode
              ? "bg-red-900/30 border-l-4 border-red-500"
              : "bg-red-50 border-l-4 border-red-500"
          }`;
        default:
          return `${baseClasses} ${
            darkMode ? "hover:bg-dark-800/30" : "hover:bg-gray-50"
          }`;
      }
    };

    const renderLineContent = () => {
      if (line.changes && highlightMode === "word") {
        return (
          <span className="whitespace-pre-wrap">
            {line.changes.map((change: DiffChange, i: number) => {
              if (change.type === "unchanged") {
                return <span key={i}>{change.text}</span>;
              } else if (change.type === "added" && line.type === "added") {
                return (
                  <span
                    key={i}
                    className={`${
                      darkMode
                        ? "bg-green-600/40 text-green-100"
                        : "bg-green-200 text-green-900"
                    } px-1 rounded`}
                  >
                    {change.text}
                  </span>
                );
              } else if (change.type === "removed" && line.type === "removed") {
                return (
                  <span
                    key={i}
                    className={`${
                      darkMode
                        ? "bg-red-600/40 text-red-100"
                        : "bg-red-200 text-red-900"
                    } px-1 rounded`}
                  >
                    {change.text}
                  </span>
                );
              }
              return <span key={i}>{change.text}</span>;
            })}
          </span>
        );
      }
      return (
        <span className="whitespace-pre-wrap">{line.content || "\u00A0"}</span>
      );
    };

    return (
      <div key={index} className={getLineClassNames()}>
        {showLineNumbers && (
          <>
            <div
              className={`w-16 text-xs text-center py-2 border-r select-none font-mono
                           ${
                             darkMode
                               ? "border-dark-600 text-dark-500 bg-dark-900/50"
                               : "border-gray-200 text-gray-400 bg-gray-50"
                           }`}
            >
              {line.oldLineNumber || ""}
            </div>
            <div
              className={`w-16 text-xs text-center py-2 border-r select-none font-mono
                           ${
                             darkMode
                               ? "border-dark-600 text-dark-500 bg-dark-900/50"
                               : "border-gray-200 text-gray-400 bg-gray-50"
                           }`}
            >
              {line.newLineNumber || ""}
            </div>
          </>
        )}
        <div
          className={`w-10 text-center py-2 border-r select-none font-bold
                       ${darkMode ? "border-dark-600" : "border-gray-200"}
                       ${
                         line.type === "added"
                           ? "text-green-500"
                           : line.type === "removed"
                           ? "text-red-500"
                           : ""
                       }`}
        >
          {line.type === "added" ? "+" : line.type === "removed" ? "-" : ""}
        </div>
        <div className="flex-1 px-4 py-2 font-mono text-sm">
          {renderLineContent()}
        </div>
      </div>
    );
  };

  // Aligned diff for split view
  interface AlignedDiffItem {
    left: DiffLine | null;
    right: DiffLine | null;
  }

  const createAlignedDiff = (): AlignedDiffItem[] => {
    const aligned: AlignedDiffItem[] = [];
    let i = 0;

    while (i < diff.length) {
      const current = diff[i];

      if (current.type === "unchanged") {
        aligned.push({
          left: current,
          right: current,
        });
        i++;
      } else if (current.type === "removed") {
        // Check if next line is added (potential modification)
        if (i + 1 < diff.length && diff[i + 1].type === "added") {
          aligned.push({
            left: current,
            right: diff[i + 1],
          });
          i += 2;
        } else {
          aligned.push({
            left: current,
            right: null,
          });
          i++;
        }
      } else if (current.type === "added") {
        aligned.push({
          left: null,
          right: current,
        });
        i++;
      } else {
        i++;
      }
    }

    return aligned;
  };

  // Render split view
  const renderSplitView = () => {
    if (!leftFile.content && !rightFile.content) {
      return (
        <div
          className={`h-full flex items-center justify-center text-lg
                       ${darkMode ? "text-dark-400" : "text-gray-500"}`}
        >
          Upload files or paste content to see differences
        </div>
      );
    }

    const alignedDiff = createAlignedDiff();

    const renderSideContent = (side: "left" | "right") => {
      return (
        <div className="font-mono text-sm">
          {alignedDiff.map((item, index) => {
            const line = side === "left" ? item.left : item.right;

            if (!line) {
              return (
                <div
                  key={index}
                  className={`flex h-8 ${
                    darkMode ? "bg-dark-800/30" : "bg-gray-100/30"
                  }`}
                >
                  {showLineNumbers && (
                    <div
                      className={`w-16 border-r ${
                        darkMode ? "border-dark-600" : "border-gray-200"
                      }`}
                    ></div>
                  )}
                  <div className="flex-1"></div>
                </div>
              );
            }

            const getLineClass = () => {
              switch (line.type) {
                case "removed":
                  return darkMode
                    ? "bg-red-900/30 border-l-4 border-red-500"
                    : "bg-red-50 border-l-4 border-red-500";
                case "added":
                  return darkMode
                    ? "bg-green-900/30 border-l-4 border-green-500"
                    : "bg-green-50 border-l-4 border-green-500";
                case "unchanged":
                  return darkMode ? "hover:bg-dark-800/30" : "hover:bg-gray-50";
                default:
                  return "";
              }
            };

            return (
              <div key={index} className={`flex ${getLineClass()}`}>
                {showLineNumbers && (
                  <div
                    className={`w-16 text-xs text-center py-2 border-r select-none font-mono
                                 ${
                                   darkMode
                                     ? "border-dark-600 text-dark-500 bg-dark-900/30"
                                     : "border-gray-200 text-gray-400 bg-gray-50"
                                 }`}
                  >
                    {side === "left"
                      ? line.oldLineNumber || ""
                      : line.newLineNumber || ""}
                  </div>
                )}
                <div className="flex-1 px-4 py-2 whitespace-pre-wrap break-all">
                  {line.content || "\u00A0"}
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="flex h-full">
        {/* Left panel */}
        <div
          className={`flex-1 overflow-auto border-r
                       ${darkMode ? "border-dark-600" : "border-gray-200"}`}
        >
          <div
            className={`sticky top-0 p-3 border-b font-medium text-sm flex items-center
                         ${
                           darkMode
                             ? "bg-dark-800 border-dark-600 text-dark-200"
                             : "bg-gray-50 border-gray-200 text-gray-700"
                         }`}
          >
            <FaFile className="inline mr-2" />
            {leftFile.name || "Original"}
          </div>
          {renderSideContent("left")}
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-auto">
          <div
            className={`sticky top-0 p-3 border-b font-medium text-sm flex items-center
                         ${
                           darkMode
                             ? "bg-dark-800 border-dark-600 text-dark-200"
                             : "bg-gray-50 border-gray-200 text-gray-700"
                         }`}
          >
            <FaFile className="inline mr-2" />
            {rightFile.name || "Modified"}
          </div>
          {renderSideContent("right")}
        </div>
      </div>
    );
  };

  // Render unified view
  const renderUnifiedView = () => {
    if (!diff.length) {
      return (
        <div
          className={`h-full flex items-center justify-center text-lg
                       ${darkMode ? "text-dark-400" : "text-gray-500"}`}
        >
          Upload files or paste content to see differences
        </div>
      );
    }

    return (
      <div className="h-full overflow-auto">
        <div
          className={`sticky top-0 p-3 border-b font-medium text-sm flex items-center
                       ${
                         darkMode
                           ? "bg-dark-800 border-dark-600 text-dark-200"
                           : "bg-gray-50 border-gray-200 text-gray-700"
                       }`}
        >
          <FaCode className="inline mr-2" />
          {leftFile.name} → {rightFile.name}
        </div>
        <div className="font-mono text-sm">
          {diff.map((line, index) => renderDiffLine(line, index))}
        </div>
      </div>
    );
  };

  // Render paste interface
  const renderPasteInterface = () => {
    const EditorPanel = ({
      file,
      side,
      label,
    }: {
      file: FileContent;
      side: "left" | "right";
      label: string;
    }) => (
      <div
        className={`flex-1 flex flex-col border-r
                     ${darkMode ? "border-dark-600" : "border-gray-200"} 
                     ${side === "right" ? "border-r-0" : ""}`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between
                       ${
                         darkMode
                           ? "bg-dark-800 border-dark-600"
                           : "bg-gray-50 border-gray-200"
                       }`}
        >
          <div className="flex items-center space-x-3">
            <FaFile className={darkMode ? "text-blue-400" : "text-blue-600"} />
            <input
              type="text"
              value={file.name}
              onChange={(e) => {
                if (side === "left") {
                  setLeftFile((prev) => ({ ...prev, name: e.target.value }));
                } else {
                  setRightFile((prev) => ({ ...prev, name: e.target.value }));
                }
              }}
              className={`bg-transparent font-medium outline-none
                        ${darkMode ? "text-dark-100" : "text-gray-900"}`}
              placeholder={label}
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={file.language}
              onChange={(e) => handleLanguageChange(e.target.value, side)}
              className={`text-sm px-2 py-1 rounded border
                        ${
                          darkMode
                            ? "bg-dark-600 border-dark-500 text-dark-200"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleClear(side)}
              className={`p-1.5 rounded hover:bg-red-600 transition-colors
                        ${
                          darkMode
                            ? "text-dark-400 hover:text-white"
                            : "text-gray-500 hover:text-white"
                        }`}
              title="Clear this panel"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 relative">
          <textarea
            value={file.content}
            onChange={(e) => handleTextChange(e.target.value, side)}
            placeholder={`Paste your ${label.toLowerCase()} code here...`}
            className={`w-full h-full resize-none font-mono text-sm leading-relaxed
                      outline-none border-0 p-4
                      ${showLineNumbers ? "pl-12" : "pl-4"}
                      ${
                        darkMode
                          ? "bg-dark-900 text-dark-100 placeholder-dark-500"
                          : "bg-white text-gray-900 placeholder-gray-400"
                      }`}
            style={{ paddingLeft: showLineNumbers ? "3rem" : "1rem" }}
          />

          {/* Line numbers overlay */}
          {showLineNumbers && file.content && (
            <div
              className={`absolute left-0 top-0 p-4 pl-1 pointer-events-none
                           text-xs font-mono leading-relaxed select-none
                           ${darkMode ? "text-dark-500" : "text-gray-400"}`}
            >
              {file.content.split("\n").map((_, index) => (
                <div key={index} className="h-[1.3rem] text-right pr-2 w-10">
                  {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with stats */}
        <div
          className={`px-4 py-2 text-xs border-t
                       ${
                         darkMode
                           ? "bg-dark-800 border-dark-600 text-dark-400"
                           : "bg-gray-50 border-gray-200 text-gray-500"
                       }`}
        >
          Lines: {file.content.split("\n").length} | Characters:{" "}
          {file.content.length} | Size: {new Blob([file.content]).size} bytes
        </div>
      </div>
    );

    return (
      <div
        className={`h-[50vh] flex border-b
                     ${
                       darkMode
                         ? "bg-dark-900 border-dark-600"
                         : "bg-white border-gray-200"
                     }`}
      >
        {/* Action Bar */}
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-10
                       flex items-center space-x-2 p-2 rounded-b-lg
                       ${
                         darkMode
                           ? "bg-dark-700 border border-t-0 border-dark-600"
                           : "bg-white border border-t-0 border-gray-200"
                       }`}
        >
          <button
            onClick={() => handleClear()}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm
                      ${
                        darkMode
                          ? "bg-red-600 hover:bg-red-500 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
          >
            <FaTimes />
            <span>Clear All</span>
          </button>

          <div
            className={`h-6 w-px
                         ${darkMode ? "bg-dark-600" : "bg-gray-300"}`}
          ></div>

          <button
            onClick={handleSwap}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm
                      ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
          >
            <FaSync />
            <span>Swap</span>
          </button>
        </div>

        {/* Editors */}
        <EditorPanel file={leftFile} side="left" label="Original" />
        <EditorPanel file={rightFile} side="right" label="Modified" />
      </div>
    );
  };

  // Render upload interface
  const renderUploadInterface = () => {
    const UploadZone = ({
      side,
      label,
      file,
    }: {
      side: "left" | "right";
      label: string;
      file: FileContent;
    }) => {
      const fileInputRef = useRef<HTMLInputElement>(null);

      const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
          handleFileUpload(selectedFile, side);
        }
      };

      const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
          handleFileUpload(droppedFile, side);
        }
      };

      const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
      };

      return (
        <div
          className={`flex-1 border-r
                       ${darkMode ? "border-dark-600" : "border-gray-200"}
                       ${side === "right" ? "border-r-0" : ""}`}
        >
          {/* Header */}
          <div
            className={`p-4 border-b flex items-center justify-between
                         ${
                           darkMode
                             ? "bg-dark-800 border-dark-600"
                             : "bg-gray-50 border-gray-200"
                         }`}
          >
            <div className="flex items-center space-x-3">
              <FaFile
                className={darkMode ? "text-blue-400" : "text-blue-600"}
              />
              <span
                className={`font-medium
                              ${darkMode ? "text-dark-100" : "text-gray-900"}`}
              >
                {label}
              </span>
              {file.name && (
                <span
                  className={`text-sm px-2 py-1 rounded
                               ${
                                 darkMode
                                   ? "bg-dark-600 text-dark-300"
                                   : "bg-gray-100 text-gray-600"
                               }`}
                >
                  {file.name}
                </span>
              )}
            </div>

            {file.content && (
              <button
                onClick={() => handleClear(side)}
                className={`p-1.5 rounded hover:bg-red-600 transition-colors
                          ${
                            darkMode
                              ? "text-dark-400 hover:text-white"
                              : "text-gray-500 hover:text-white"
                          }`}
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`h-64 m-4 border-2 border-dashed rounded-lg
                      cursor-pointer transition-all duration-200
                      hover:border-blue-500
                      ${
                        darkMode
                          ? "border-dark-600 hover:border-blue-400 hover:bg-dark-800"
                          : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                      }`}
          >
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <FaFileUpload
                className={`text-4xl
                                      ${
                                        darkMode
                                          ? "text-dark-400"
                                          : "text-gray-400"
                                      }`}
              />
              <div className="text-center">
                <p
                  className={`text-lg font-medium
                             ${darkMode ? "text-dark-200" : "text-gray-700"}`}
                >
                  Drop file here or click to browse
                </p>
                <p
                  className={`text-sm
                             ${darkMode ? "text-dark-400" : "text-gray-500"}`}
                >
                  Supports most code file types
                </p>
              </div>
            </div>
          </div>

          {/* File Preview */}
          {file.content && (
            <div
              className={`m-4 p-4 rounded-lg border max-h-48 overflow-auto
                           ${
                             darkMode
                               ? "bg-dark-800 border-dark-600"
                               : "bg-gray-50 border-gray-200"
                           }`}
            >
              <div
                className={`text-xs font-mono whitespace-pre-wrap
                             ${darkMode ? "text-dark-300" : "text-gray-600"}`}
              >
                {file.content.length > 500
                  ? `${file.content.substring(0, 500)}...`
                  : file.content}
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.css,.html,.json,.xml,.md,.txt,.yml,.yaml,.php,.rb,.go,.rs,.swift,.kt,.sql,.sh"
          />
        </div>
      );
    };

    return (
      <div
        className={`h-[50vh] flex border-b
                     ${
                       darkMode
                         ? "bg-dark-900 border-dark-600"
                         : "bg-white border-gray-200"
                     }`}
      >
        <UploadZone side="left" label="Original File" file={leftFile} />
        <UploadZone side="right" label="Modified File" file={rightFile} />
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300
                   ${
                     darkMode
                       ? "bg-dark-900 text-dark-50"
                       : "bg-gray-50 text-gray-900"
                   }`}
    >
      {/* Header */}
      <div
        className={`border-b transition-colors duration-300
                     ${
                       darkMode
                         ? "bg-dark-800 border-dark-600"
                         : "bg-white border-gray-200"
                     }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Back button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-all duration-200
                            ${
                              darkMode
                                ? "hover:bg-dark-600 text-dark-300 hover:text-dark-100"
                                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                            }`}
                  title="Back to CodeFusion"
                >
                  <FaArrowLeft />
                </button>
              )}

              <h1
                className={`text-2xl font-bold transition-colors duration-300
                             ${darkMode ? "text-dark-50" : "text-gray-900"}`}
              >
                Git Diff Visualizer
              </h1>
              {diffStats && (
                <div className="flex items-center space-x-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded bg-green-500/10 text-green-600 flex items-center`}
                  >
                    <FaPlus className="mr-1" />
                    {diffStats.additions}
                  </span>
                  <span
                    className={`px-2 py-1 rounded bg-red-500/10 text-red-600 flex items-center`}
                  >
                    <FaMinus className="mr-1" />
                    {diffStats.deletions}
                  </span>
                  <span
                    className={`px-2 py-1 rounded
                                   ${
                                     darkMode
                                       ? "bg-dark-600 text-dark-200"
                                       : "bg-gray-100 text-gray-600"
                                   }`}
                  >
                    {diffStats.total} changes
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setViewMode(viewMode === "split" ? "unified" : "split")
                }
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg
                          ${
                            darkMode
                              ? "bg-dark-600 hover:bg-dark-500 text-dark-200"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                title="Toggle view mode"
              >
                <FaEye />
                <span>{viewMode === "split" ? "Split" : "Unified"}</span>
              </button>

              <button
                onClick={() =>
                  setHighlightMode(highlightMode === "line" ? "word" : "line")
                }
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg
                          ${
                            darkMode
                              ? "bg-dark-600 hover:bg-dark-500 text-dark-200"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                title="Toggle highlight mode"
              >
                <FaCode />
                <span>{highlightMode === "line" ? "Line" : "Word"}</span>
              </button>

              <button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={`p-2 rounded-lg 
                          ${
                            showLineNumbers
                              ? darkMode
                                ? "bg-blue-600 text-white"
                                : "bg-blue-600 text-white"
                              : darkMode
                              ? "bg-dark-600 hover:bg-dark-500 text-dark-200"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                title="Toggle line numbers"
              >
                <FaEyeSlash />
              </button>

              <button
                onClick={handleSwap}
                className={`p-2 rounded-lg
                          ${
                            darkMode
                              ? "bg-dark-600 hover:bg-dark-500 text-dark-200"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                title="Swap files"
              >
                <FaSync />
              </button>

              <button
                onClick={handleCopyDiff}
                className={`p-2 rounded-lg
                          ${
                            darkMode
                              ? "bg-dark-600 hover:bg-dark-500 text-dark-200"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                title="Copy diff"
              >
                <FaCopy />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2 rounded-lg
                          ${
                            darkMode
                              ? "bg-dark-600 hover:bg-dark-500 text-dark-200"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                title="Toggle fullscreen"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Selection */}
      <div
        className={`border-b transition-colors duration-300
                     ${darkMode ? "border-dark-600" : "border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("paste")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors
                         ${
                           activeTab === "paste"
                             ? darkMode
                               ? "border-blue-500 text-blue-400"
                               : "border-blue-500 text-blue-600"
                             : darkMode
                             ? "border-transparent text-dark-300 hover:text-dark-100"
                             : "border-transparent text-gray-500 hover:text-gray-700"
                         }`}
            >
              <FaPaste className="inline mr-2" />
              Paste Code
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors
                         ${
                           activeTab === "upload"
                             ? darkMode
                               ? "border-blue-500 text-blue-400"
                               : "border-blue-500 text-blue-600"
                             : darkMode
                             ? "border-transparent text-dark-300 hover:text-dark-100"
                             : "border-transparent text-gray-500 hover:text-gray-700"
                         }`}
            >
              <FaFileUpload className="inline mr-2" />
              Upload Files
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${
          isFullscreen ? "fixed inset-0 z-50 pt-16 bg-inherit" : ""
        }`}
      >
        {/* Input Interface */}
        {activeTab === "paste"
          ? renderPasteInterface()
          : renderUploadInterface()}

        {/* Diff Output */}
        <div className="flex-1 h-[50vh]">
          {viewMode === "split" ? renderSplitView() : renderUnifiedView()}
        </div>
      </div>
    </div>
  );
};

export default GitDiffVisualizer;
