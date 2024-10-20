import React from "react";

interface MainContentProps {
  textboxValue: string;
  setTextboxValue: (value: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  textboxValue,
  setTextboxValue,
}) => {
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
        value={textboxValue}
        onChange={(e) => setTextboxValue(e.target.value)}
        placeholder="Your text will appear here..."
      />
    </div>
  );
};

export default MainContent;
