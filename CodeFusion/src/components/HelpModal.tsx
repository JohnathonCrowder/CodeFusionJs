import React from "react";

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
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
              Help
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Here are some helpful resources:
              </p>
              <ul className="mt-4 list-disc pl-5 text-sm text-gray-500">
                <li>
                  Check out our{" "}
                  <a href="#" className="text-blue-600 underline">
                    documentation
                  </a>{" "}
                  for a comprehensive guide.
                </li>
                <li>
                  Visit our{" "}
                  <a href="#" className="text-blue-600 underline">
                    support forum
                  </a>{" "}
                  for community assistance.
                </li>
                <li>
                  Submit a{" "}
                  <a href="#" className="text-blue-600 underline">
                    bug report
                  </a>{" "}
                  if you encounter any issues.
                </li>
                <li>
                  Reach out to our{" "}
                  <a href="#" className="text-blue-600 underline">
                    support team
                  </a>{" "}
                  for further help.
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
