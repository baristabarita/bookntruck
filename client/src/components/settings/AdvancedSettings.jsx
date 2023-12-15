import React, { useState } from "react";
import axios from 'axios';
import config from '../../common/config';

const AdvancedSettings = () => {
  const storedAcc = localStorage.getItem('truckerDetails');
  const truckerid = storedAcc !== null && Number(JSON.parse(storedAcc).truckerID);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actionType, setActionType] = useState(""); // To track whether the user wants to delete or deactivate

  const handleDelete = () => {
    setShowConfirmationModal(true);
    setActionType("delete");
  };

  const handleDeactivate = () => {
    setShowConfirmationModal(true);
    setActionType("deactivate");
  };

  const handleConfirmation = () => {
    if (actionType === "delete") {
      axios.post(`${config.API}/trucker/delete?truckerID=${truckerid}`)
        .then((response) => {
          console.log("Account deletion successful:", response.data);
          localStorage.removeItem('truckerDetails');
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    } else if (actionType === "deactivate") {
      axios.post(`${config.API}/trucker/deactivate?truckerID=${truckerid}`)
        .then((response) => {
          console.log("Account deactivation successful:", response.data);
          localStorage.removeItem('truckerDetails');
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deactivating account:", error);
        });
    }
  };


  const handleCancellation = () => {
    setShowConfirmationModal(false);
    // Additional actions upon cancellation (if needed)
  };

  return (
    <div className="mt-8">
      <div className="w-auto h-auto bg-white m-8 p-5 rounded-lg animate-fade-in drop-shadow-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Account Deletion or Deactivation</h2>
        <p className="text-sm text-gray-600">
          You can permanently delete or temporarily deactivate your account.
        </p>

        <div className="flex justify-end">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={handleDeactivate}
          >
            Deactivate
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={handleDelete}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="mb-4">Are you sure you want to {actionType === 'delete' ? 'delete' : 'deactivate'} your account?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={handleConfirmation}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={handleCancellation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;
