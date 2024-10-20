import React from "react";

interface FileData {
  name: string;
  content: string;
  visible: boolean;
  children?: FileData[];
}

interface MainContentProps {
  fileData: FileData[];
}

const MainContent: React.FC<MainContentProps> = ({ fileData }) => {
  const getVisibleContent = (files: FileData[]): string[] => {
    return files.flatMap((file) => {
      const contents: string[] = [];
      if (file.visible && file.content) {
        contents.push(file.content);
      }
      if (file.children && file.visible) {
        contents.push(...getVisibleContent(file.children));
      }
      return contents;
    });
  };

  const visibleContent = getVisibleContent(fileData).join("\n\n");

  return (
    <div className="w-3/4 p-6 flex flex-col h-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome to CodeFusionX
      </h1>
      <textarea
        id="textbox"
        className="flex-grow p-4 border border-gray-300 rounded-lg resize-none 
                 text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 
                 focus:ring-blue-500 focus:border-transparent"
        value={visibleContent}
        readOnly
        placeholder="Your text will appear here..."
      />
    </div>
  );
};

export default MainContent;
