import React, { useState } from "react";

interface SettingsModalProps {
  settings: {
    newLineCount: number;
    acceptedTypes: string[];
  };
  onClose: () => void;
  onSave: (settings: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onClose,
  onSave,
}) => {
  const [newLineCount, setNewLineCount] = useState(settings.newLineCount);
  const [acceptedTypes, setAcceptedTypes] = useState(settings.acceptedTypes);

  const handleCheckboxChange = (type: string) => {
    if (acceptedTypes.includes(type)) {
      setAcceptedTypes(acceptedTypes.filter((t) => t !== type));
    } else {
      setAcceptedTypes([...acceptedTypes, type]);
    }
  };

  const handleSave = () => {
    onSave({
      newLineCount,
      acceptedTypes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
          &#8203;
        </span>
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Settings
            </h3>
            <div className="mt-4">
              <h4 className="text-base font-medium text-gray-900">
                New Lines Between Files
              </h4>
              <div className="ml-4 mt-2">
                <label
                  htmlFor="newLineCount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of new lines:
                </label>
                <input
                  type="number"
                  id="newLineCount"
                  min="0"
                  max="10"
                  value={newLineCount}
                  onChange={(e) => setNewLineCount(parseInt(e.target.value))}
                  className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Add more settings sections here */}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex w-full justify-center rounded-md border border-transparent 
                       bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border 
                       border-gray-300 bg-white px-4 py-2 text-base font-medium 
                       text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                       sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
