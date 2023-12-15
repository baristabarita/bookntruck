// DocumentModal.jsx
import React from "react";

const DocumentModal = ({ documentUrl, altText, onClose }) => {
  if (!documentUrl) {
    return null; // Don't render the modal if documentUrl is not provided
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white p-6 rounded shadow-md max-w-3xl w-full max-h-full overflow-y-auto">
        <div className="flex justify-end">
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <img src={documentUrl} alt={altText} className="w-full h-auto" />
      </div>
    </div>
  );
};

export default DocumentModal;
