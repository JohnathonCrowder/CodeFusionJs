import React from "react";

interface FileData {
  name: string;
  content: string;
  visible: boolean;
  children?: FileData[];
  path?: string;
}

interface MainContentProps {
  fileData: FileData[];
}

const MainContent: React.FC<MainContentProps> = ({ fileData }) => {
  const getVisibleContent = (
    files: FileData[]
  ): Array<{
    content: string;
    name: string;
    path?: string;
  }> => {
    return files.flatMap((file) => {
      const contents: Array<{
        content: string;
        name: string;
        path?: string;
      }> = [];

      if (file.visible && file.content) {
        contents.push({
          content: file.content,
          name: file.name,
          path: file.path,
        });
      }

      if (file.children && file.visible) {
        contents.push(...getVisibleContent(file.children));
      }

      return contents;
    });
  };

  const visibleFiles = getVisibleContent(fileData);
  const formattedContent = visibleFiles
    .map((file) => {
      return [
        "=".repeat(60),
        `File: ${file.name}`,
        `Path: ${file.path || "N/A"}`,
        "=".repeat(60),
        "",
        file.content,
        "",
        "",
      ].join("\n");
    })
    .join("\n");

  return (
    <div className="w-3/4 p-6 flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome to CodeFusionX
      </h1>
      <textarea
        id="textbox"
        className="flex-grow p-4 border border-gray-300 rounded-lg resize-none 
                 text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:border-transparent font-mono"
        value={formattedContent}
        readOnly
        placeholder="Your text will appear here..."
      />
    </div>
  );
};

export default MainContent;
