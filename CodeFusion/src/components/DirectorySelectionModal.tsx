import React, { useState } from "react";

interface DirectoryItem {
  name: string;
  path: string;
  selected: boolean;
  children?: DirectoryItem[];
}

interface DirectorySelectionModalProps {
  directories: DirectoryItem[];
  onConfirm: (selectedDirs: DirectoryItem[]) => void;
  onCancel: () => void;
}

const DirectoryTree: React.FC<{
  items: DirectoryItem[];
  onToggle: (path: string) => void;
  level?: number;
}> = ({ items, onToggle, level = 0 }) => {
  return (
    <ul className={`space-y-2 ${level > 0 ? "ml-4" : ""}`}>
      {items.map((item) => (
        <li key={item.path} className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              {item.children && "📁"}
              {item.name}
            </span>
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => onToggle(item.path)}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>
          {item.children && (
            <DirectoryTree
              items={item.children.filter(
                (child) => item.selected || child.selected
              )}
              onToggle={onToggle}
              level={level + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

const DirectorySelectionModal: React.FC<DirectorySelectionModalProps> = ({
  directories,
  onConfirm,
  onCancel,
}) => {
  const [dirs, setDirs] = useState(directories);

  const toggleDirectory = (path: string) => {
    const updateItems = (items: DirectoryItem[]): DirectoryItem[] => {
      return items.map((item) => {
        if (item.path === path) {
          const newSelected = !item.selected;
          return {
            ...item,
            selected: newSelected,
            children: item.children
              ? updateItems(item.children).map((child) => ({
                  ...child,
                  selected: newSelected,
                }))
              : undefined,
          };
        } else if (item.children) {
          return {
            ...item,
            children: updateItems(item.children),
          };
        }
        return item;
      });
    };

    setDirs(updateItems(dirs));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        <div className="relative bg-white rounded-lg p-8 max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4">
            Select Directories to Include
          </h2>
          <div className="max-h-96 overflow-y-auto">
            <DirectoryTree items={dirs} onToggle={toggleDirectory} />
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => onCancel()}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(dirs)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorySelectionModal;
