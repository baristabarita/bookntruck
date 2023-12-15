import React from "react";
import axios from 'axios';
import config from '../../../common/config';
import { AiFillSave, AiFillCloseCircle, AiFillDelete } from "react-icons/ai";

const DeleteAssetModal = ({ isOpen, onDelete, onClose, assetId }) => {

    const handleDelete = async () => {
        try {
          // Call the API to delete the asset
          await axios.post(`${config.API}/asset/set_invisible`, { asset_id: assetId });
          
          // Notify the parent component that deletion was successful
          onDelete(assetId);
          window.location.reload();
        } catch (error) {
          console.error('Error deleting asset:', error);
        }
    
        // Close the modal
        onClose();
      };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-auto bg-smoke-dark bg-opacity-75 flex">
                    <div className="relative p-8 bg-white w-full max-w-[600px] m-auto flex-col flex rounded shadow">
                        <div className="flex justify-end">
                            <AiFillCloseCircle
                                className="text-[2.5em] hover:cursor-pointer"
                                onClick={onClose}
                            />
                        </div>
                        <h1 className="text-2xl font-bold mb-4">Asset Deletion Confirmation</h1>
                        <p className="mb-4">Are you sure you want to delete this asset?</p>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleDelete}
                            >
                                <AiFillDelete className="mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteAssetModal;
