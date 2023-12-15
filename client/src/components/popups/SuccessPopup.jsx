import React, { useState } from "react";

const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md">
        <p className="text-green-500 font-semibold">{message}</p>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
