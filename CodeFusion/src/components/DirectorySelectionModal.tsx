import React, { useState, useMemo } from "react";
import { FaInfoCircle } from "react-icons/fa";

interface DirectoryItem {
  name: string;
  path: string;
  selected: boolean;
  children?: DirectoryItem[];
}

interface AppSettings {
  autoUnselectFolders: string[];
}

interface DirectorySelectionModalProps {
  directories: DirectoryItem[];
  onConfirm: (selectedDirs: DirectoryItem[]) => void;
  onCancel: () => void;
  settings: AppSettings;
}

// Helper function to determine if a folder has mixed selection state
const hasMixedSelection = (item: DirectoryItem): boolean => {
  if (!item.children || item.children.length === 0) return false;

  const selectedCount = item.children.reduce((count, child) => {
    return count + (child.selected ? 1 : 0);
  }, 0);

  return selectedCount > 0 && selectedCount < item.children.length;
};

// Helper function to check if an item or any of its descendants are selected
const hasSelectedDescendant = (item: DirectoryItem): boolean => {
  if (item.selected) return true;
  if (!item.children) return false;
  return item.children.some((child) => hasSelectedDescendant(child));
};

const DirectoryTree: React.FC<{
  items: DirectoryItem[];
  onToggle: (path: string) => void;
  level?: number;
  excludedFolders: string[];
}> = ({ items, onToggle, level = 0, excludedFolders }) => {
  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      if (level === 0) return true;
      return hasSelectedDescendant(item);
    });
  }, [items, level]);

  if (visibleItems.length === 0) return null;

  return (
    <ul className={`space-y-2 ${level > 0 ? "ml-4" : ""}`}>
      {visibleItems.map((item) => {
        const isExcluded = excludedFolders.includes(item.name.toLowerCase());
        return (
          <li key={item.path} className="flex flex-col">
            <div className="flex items-center justify-between group">
              <span className="flex items-center">
                {item.children && (
                  <span
                    className={`mr-2 ${
                      hasMixedSelection(item)
                        ? "text-yellow-500"
                        : item.selected
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    📁
                  </span>
                )}
                <span
                  className={`
                  ${item.selected ? "text-gray-900" : "text-gray-500"}
                  ${isExcluded ? "text-red-500 font-semibold" : ""}
                `}
                >
                  {item.name}
                </span>
                {isExcluded && (
                  <span className="ml-2 text-red-500 text-sm">
                    (Auto-excluded)
                  </span>
                )}
              </span>
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => onToggle(item.path)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 
                         focus:ring-blue-500 group-hover:visible"
              />
            </div>
            {item.children && (
              <DirectoryTree
                items={item.children}
                onToggle={onToggle}
                level={level + 1}
                excludedFolders={excludedFolders}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

const DirectorySelectionModal: React.FC<DirectorySelectionModalProps> = ({
  directories,
  onConfirm,
  onCancel,
  settings,
}) => {
  const [dirs, setDirs] = useState(directories);
  const [searchTerm, setSearchTerm] = useState("");
  const [showExcludedList, setShowExcludedList] = useState(false);

  const excludedFolders = useMemo(
    () => settings.autoUnselectFolders.map((folder) => folder.toLowerCase()),
    [settings.autoUnselectFolders]
  );

  const toggleDirectory = (path: string) => {
    const updateItems = (items: DirectoryItem[]): DirectoryItem[] => {
      return items.map((item) => {
        // If this is the item we're toggling
        if (item.path === path) {
          const newSelected = !item.selected;

          // Recursive function to update all children
          const updateChildren = (
            children?: DirectoryItem[]
          ): DirectoryItem[] | undefined => {
            return children?.map((child) => ({
              ...child,
              selected: newSelected,
              children: updateChildren(child.children),
            }));
          };

          return {
            ...item,
            selected: newSelected,
            children: updateChildren(item.children),
          };
        }

        // If this item contains the path we're looking for
        if (item.children) {
          const updatedChildren = updateItems(item.children);
          const allChildrenSelected = updatedChildren.every(
            (child) => child.selected
          );
          const someChildrenSelected = updatedChildren.some(
            (child) => child.selected
          );

          return {
            ...item,
            children: updatedChildren,
            selected: allChildrenSelected
              ? true
              : someChildrenSelected
              ? item.selected
              : false,
          };
        }

        return item;
      });
    };

    setDirs(updateItems(dirs));
  };

  // Filter directories based on search term
  const filteredDirs = useMemo(() => {
    const filterItems = (items: DirectoryItem[]): DirectoryItem[] => {
      return items
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.children &&
              item.children.some((child) => filterItems([child]).length > 0))
        )
        .map((item) => ({
          ...item,
          children: item.children ? filterItems(item.children) : undefined,
        }))
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.children && item.children.length > 0)
        );
    };

    return searchTerm ? filterItems(dirs) : dirs;
  }, [dirs, searchTerm]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        <div className="relative bg-white rounded-lg p-8 max-w-lg w-full shadow-xl">
          <h2 className="text-2xl font-bold mb-4">
            Select Directories to Include
          </h2>

          {/* Info about excluded folders */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaInfoCircle className="text-blue-500 mr-2" />
                <span className="text-sm text-blue-700">
                  Folders in{" "}
                  <span className="font-semibold text-red-600">red</span> are
                  automatically excluded based on your settings.
                </span>
              </div>
              <button
                onClick={() => setShowExcludedList(!showExcludedList)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                aria-expanded={showExcludedList}
                aria-controls="excluded-folders-list"
              >
                {showExcludedList ? "Hide" : "Show"} excluded folders
              </button>
            </div>

            {/* Collapsible list of excluded folders */}
            {showExcludedList && (
              <div
                id="excluded-folders-list"
                className="mt-2 p-2 bg-white border rounded"
              >
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {settings.autoUnselectFolders.map((folder, index) => (
                    <li key={index} className="text-red-600 font-medium">
                      {folder}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-gray-500">
                  You can modify this list in the application settings.
                </p>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <label htmlFor="directory-search" className="sr-only">
              Search directories
            </label>
            <input
              id="directory-search"
              type="text"
              placeholder="Search directories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none 
                       focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Directory Tree */}
          <div className="max-h-96 overflow-y-auto border rounded-md p-4">
            <DirectoryTree
              items={filteredDirs}
              onToggle={toggleDirectory}
              excludedFolders={excludedFolders}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md 
                       hover:bg-gray-300 focus:outline-none focus:ring-2 
                       focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(dirs)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500"
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
