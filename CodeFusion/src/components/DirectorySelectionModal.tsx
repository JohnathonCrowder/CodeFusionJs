import React, { useState, useMemo, useCallback } from "react";
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

const DirectoryTree: React.FC<{
  items: DirectoryItem[];
  onToggle: (path: string) => void;
  level?: number;
  excludedFolders: string[];
  searchTerm?: string;
}> = ({ items, onToggle, level = 0, excludedFolders, searchTerm = "" }) => {
  // Filter items based on search term only
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    const filterRecursive = (items: DirectoryItem[]): DirectoryItem[] => {
      return items.reduce((acc: DirectoryItem[], item) => {
        const nameMatches = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const filteredChildren = item.children
          ? filterRecursive(item.children)
          : undefined;
        const hasMatchingChildren =
          filteredChildren && filteredChildren.length > 0;

        if (nameMatches || hasMatchingChildren) {
          acc.push({
            ...item,
            children: filteredChildren || item.children,
          });
        }

        return acc;
      }, []);
    };

    return filterRecursive(items);
  }, [items, searchTerm]);

  return (
    <ul className={`space-y-1 ${level > 0 ? "ml-6" : ""}`}>
      {filteredItems.map((item) => {
        const isExcluded = excludedFolders.includes(item.name.toLowerCase());

        return (
          <li key={item.path}>
            <div className="flex items-center justify-between py-1 hover:bg-gray-50 rounded px-2">
              <label className="flex items-center flex-grow cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => onToggle(item.path)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 
                           focus:ring-blue-500 mr-3"
                />
                <span className="flex items-center">
                  {item.children && <span className="mr-2">📁</span>}
                  {!item.children && <span className="mr-2">📄</span>}
                  <span
                    className={`
                    ${
                      item.selected
                        ? "text-gray-900 font-medium"
                        : "text-gray-600"
                    }
                    ${isExcluded ? "text-red-500 line-through" : ""}
                  `}
                  >
                    {item.name}
                  </span>
                  {isExcluded && (
                    <span className="ml-2 text-red-500 text-xs">
                      (excluded)
                    </span>
                  )}
                </span>
              </label>
            </div>

            {/* Always show children if they exist */}
            {item.children && item.children.length > 0 && (
              <DirectoryTree
                items={item.children}
                onToggle={onToggle}
                level={level + 1}
                excludedFolders={excludedFolders}
                searchTerm={searchTerm}
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
  const [dirs, setDirs] = useState(() =>
    JSON.parse(JSON.stringify(directories))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showExcludedList, setShowExcludedList] = useState(false);

  const excludedFolders = useMemo(
    () => settings.autoUnselectFolders.map((folder) => folder.toLowerCase()),
    [settings.autoUnselectFolders]
  );

  // Simple toggle function - only affects the clicked item and its children
  const toggleDirectory = useCallback((path: string) => {
    setDirs((prevDirs) => {
      const updateItem = (items: DirectoryItem[]): DirectoryItem[] => {
        return items.map((item) => {
          if (item.path === path) {
            // Toggle this item and all its children
            const newSelected = !item.selected;

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

          // Recursively search in children
          if (item.children) {
            return {
              ...item,
              children: updateItem(item.children),
            };
          }

          return item;
        });
      };

      return updateItem(prevDirs);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(dirs);
  }, [dirs, onConfirm]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Select Directories to Include
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Choose which folders to include in your project upload
            </p>
          </div>

          {/* Info section */}
          <div className="px-6 py-4 bg-blue-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-700">
                    Folders marked in{" "}
                    <span className="text-red-500 font-semibold">red</span> are
                    automatically excluded based on your settings.
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    Click any checkbox to select/deselect that folder and all
                    its contents.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExcludedList(!showExcludedList)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
              >
                {showExcludedList ? "Hide" : "Show"} excluded list
              </button>
            </div>

            {showExcludedList && (
              <div className="mt-3 p-3 bg-white border rounded">
                <p className="text-sm text-gray-700 mb-2">
                  Auto-excluded folders:
                </p>
                <div className="flex flex-wrap gap-2">
                  {settings.autoUnselectFolders.map((folder, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium"
                    >
                      {folder}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="px-6 py-4 border-b">
            <input
              type="text"
              placeholder="Search directories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Directory Tree */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {dirs.length > 0 ? (
              <DirectoryTree
                items={dirs}
                onToggle={toggleDirectory}
                excludedFolders={excludedFolders}
                searchTerm={searchTerm}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No directories found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorySelectionModal;
