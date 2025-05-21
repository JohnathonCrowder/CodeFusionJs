import React, { useState, useMemo, useCallback, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { 
  FaInfoCircle, 
  FaFolder, 
  FaFile,
  FaEye,
  FaSearch,
  FaTimes,
  FaFolderOpen,
  FaCheck
} from "react-icons/fa";

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
  const { darkMode } = useContext(ThemeContext);

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
    <ul className={`space-y-1 ${level > 0 ? "ml-6 border-l pl-4" : ""} 
                  ${level > 0 ? (darkMode ? "border-dark-600" : "border-gray-200") : ""}`}>
      {filteredItems.map((item) => {
        const isExcluded = excludedFolders.includes(item.name.toLowerCase());

        return (
          <li key={item.path}>
            <div className={`flex items-center justify-between py-2 px-3 rounded-lg
                           transition-all duration-200 group
                           ${darkMode 
                             ? 'hover:bg-dark-600' 
                             : 'hover:bg-gray-50'}`}>
              
              <label className="flex items-center flex-grow cursor-pointer min-w-0">
                <div className="flex items-center space-x-3">
                  {/* Checkbox */}
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => onToggle(item.path)}
                      className={`h-4 w-4 rounded border transition-all duration-200
                                focus:ring-2 focus:ring-offset-0
                                ${item.selected 
                                  ? darkMode
                                    ? 'bg-blue-600 border-blue-600 text-white focus:ring-blue-400'
                                    : 'bg-blue-600 border-blue-600 text-white focus:ring-blue-500'
                                  : darkMode
                                    ? 'border-dark-500 bg-dark-600 focus:ring-blue-400'
                                    : 'border-gray-300 bg-white focus:ring-blue-500'
                                }`}
                    />
                    {item.selected && (
                      <FaCheck className="absolute inset-0 m-auto h-2.5 w-2.5 text-white pointer-events-none" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`flex-shrink-0 transition-colors duration-200
                                 ${item.selected 
                                   ? darkMode ? 'text-blue-400' : 'text-blue-600'
                                   : darkMode ? 'text-dark-400' : 'text-gray-400'
                                 }`}>
                    {item.children ? (
                      <FaFolder className="h-4 w-4" />
                    ) : (
                      <FaFile className="h-4 w-4" />
                    )}
                  </div>
                  
                  {/* Name */}
                  <span className={`font-medium truncate transition-colors duration-200
                                  ${item.selected 
                                    ? darkMode ? 'text-dark-100' : 'text-gray-900'
                                    : darkMode ? 'text-dark-300' : 'text-gray-600'
                                  }
                                  ${isExcluded ? 'line-through opacity-60' : ''}`}>
                    {item.name}
                  </span>
                  
                  {/* Excluded Badge */}
                  {isExcluded && (
                    <span className={`text-xs px-2 py-1 rounded-full
                                   ${darkMode 
                                     ? 'bg-red-900/30 text-red-400' 
                                     : 'bg-red-100 text-red-600'}`}>
                      excluded
                    </span>
                  )}
                </div>
              </label>

              {/* Selection Indicator */}
              <div className={`ml-2 transition-colors duration-200
                             ${item.selected 
                               ? darkMode ? 'text-green-400' : 'text-green-600'
                               : 'opacity-0'}`}>
                <FaEye className="h-3 w-3" />
              </div>
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
  const { darkMode } = useContext(ThemeContext);
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
    setDirs((prevDirs: DirectoryItem[]) => {
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

  // Count selected directories
  const selectedCount = useMemo(() => {
    const countSelected = (items: DirectoryItem[]): number => {
      return items.reduce((count, item) => {
        let currentCount = item.selected ? 1 : 0;
        if (item.children) {
          currentCount += countSelected(item.children);
        }
        return count + currentCount;
      }, 0);
    };
    return countSelected(dirs);
  }, [dirs]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl
                       transition-colors duration-300
                       ${darkMode 
                         ? 'bg-dark-800 border border-dark-600' 
                         : 'bg-white border border-gray-200'}`}>
          
          {/* Header */}
          <div className={`p-6 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg transition-colors duration-300
                             ${darkMode 
                               ? 'bg-blue-600/20 text-blue-400' 
                               : 'bg-blue-100 text-blue-600'}`}>
                <FaFolderOpen className="text-xl" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold transition-colors duration-300
                               ${darkMode ? 'text-dark-50' : 'text-gray-900'}`}>
                  Select Directories
                </h2>
                <p className={`text-sm transition-colors duration-300
                               ${darkMode ? 'text-dark-400' : 'text-gray-600'}`}>
                  Choose which folders to include in your project upload
                </p>
              </div>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg
                           ${darkMode 
                             ? 'bg-blue-900/20 border border-blue-700/50' 
                             : 'bg-blue-50 border border-blue-200'}`}>
              <div className="flex items-start space-x-3">
                <FaInfoCircle className={`mt-0.5 flex-shrink-0
                                        ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div className="text-sm">
                  <p className={`font-medium transition-colors duration-300
                               ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    Folders marked as <span className="text-red-500 font-semibold">excluded</span> are
                    automatically filtered based on your settings.
                  </p>
                  <p className={`mt-1 opacity-80 transition-colors duration-300
                               ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Click any checkbox to select/deselect that folder and all its contents.
                  </p>
                  <p className={`mt-1 text-xs transition-colors duration-300
                               ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Selected: {selectedCount} items
                  </p>
                </div>
              </div>
              
              {/* Toggle excluded list */}
              <button
                onClick={() => setShowExcludedList(!showExcludedList)}
                className={`text-sm font-medium transition-all duration-200
                          ${darkMode 
                            ? 'text-blue-400 hover:text-blue-300' 
                            : 'text-blue-600 hover:text-blue-800'}`}
              >
                {showExcludedList ? 'Hide' : 'Show'} excluded
              </button>
            </div>

            {/* Excluded folders list */}
            {showExcludedList && (
              <div className={`mt-3 p-4 rounded-lg border transition-colors duration-300
                             ${darkMode 
                               ? 'bg-dark-700 border-dark-600' 
                               : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-sm font-medium mb-2 transition-colors duration-300
                             ${darkMode ? 'text-dark-200' : 'text-gray-700'}`}>
                  Auto-excluded folders:
                </p>
                <div className="flex flex-wrap gap-2">
                  {settings.autoUnselectFolders.map((folder, index) => (
                    <span
                      key={index}
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                                ${darkMode 
                                  ? 'bg-red-900/30 text-red-400' 
                                  : 'bg-red-100 text-red-800'}`}
                    >
                      {folder}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className={`p-4 border-b transition-colors duration-300
                         ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search directories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-8 pr-10 py-3 rounded-lg border transition-all duration-200
                          focus:outline-none focus:ring-2 
                          ${darkMode
                            ? 'bg-dark-600 border-dark-500 text-dark-200 placeholder-dark-400 focus:ring-blue-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'}`}
              />
              <FaSearch className={`absolute left-3 top-3.5 h-4 w-4
                                  ${darkMode ? 'text-dark-400' : 'text-gray-400'}`} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`absolute right-3 top-3 p-1 rounded transition-colors
                            ${darkMode ? 'hover:bg-dark-500' : 'hover:bg-gray-100'}`}
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Directory Tree */}
          <div className="flex-1 overflow-y-auto p-4">
            {dirs.length > 0 ? (
              <div className={`rounded-lg border p-3 transition-colors duration-300
                             ${darkMode 
                               ? 'bg-dark-700 border-dark-600' 
                               : 'bg-gray-50 border-gray-200'}`}>
                <DirectoryTree
                  items={dirs}
                  onToggle={toggleDirectory}
                  excludedFolders={excludedFolders}
                  searchTerm={searchTerm}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <FaFolder className={`h-8 w-8 mx-auto mb-2
                                     ${darkMode ? 'text-dark-500' : 'text-gray-400'}`} />
                <p className={`transition-colors duration-300
                             ${darkMode ? 'text-dark-400' : 'text-gray-500'}`}>
                  No directories found
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`p-6 border-t flex justify-end space-x-3
                         ${darkMode 
                           ? 'border-dark-600 bg-dark-700/30' 
                           : 'border-gray-200 bg-gray-50/30'}`}>
            <button
              onClick={onCancel}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                        ${darkMode
                          ? 'bg-dark-600 text-dark-200 hover:bg-dark-500 border border-dark-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                        shadow-lg hover:shadow-xl
                        ${darkMode
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              Confirm Selection ({selectedCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorySelectionModal;