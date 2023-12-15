import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../common/config";
import { MdMail, MdPhone } from "react-icons/md";
import { FaMapMarker } from "react-icons/fa";

const ManageTruckerModal = ({ isOpen, onClose, selectedTrucker, onUpdateTruckers, onUpdateStatus }) => {
    const [userDetails, setUserDetails] = useState({});
    const [imageSrc, setImageSrc] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (selectedTrucker && selectedTrucker.user_id) {
                    const userResponse = await axios.get(
                        `${config.API}/user/retrieve?col=user_id&val=${selectedTrucker.user_id}`
                    );
                    setUserDetails(userResponse.data.records[0] || {});
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const getImageSrc = async () => {
            try {
                if (selectedTrucker && selectedTrucker.emp_proof) {
                    // Assuming your backend serves static files from the 'uploads' directory
                    const empProofSrc = `${config.API}/${selectedTrucker.emp_proof}`;
                    setImageSrc(empProofSrc);
                }
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        if (isOpen && selectedTrucker) {
            fetchUserData();
            getImageSrc();
        }
    }, [isOpen, selectedTrucker]);

    const handleUpdateStatus = async (newStatus) => {
        try {
          setUpdateLoading(true);
    
          // Send the update request
          const updateResponse = await axios.post(`${config.API}/trucker/update?truckerID=${selectedTrucker.trucker_id}`, {
            trucker: {
              trucker_status: newStatus,
            },
          });
    
          console.log("Update response:", updateResponse.data);
    
          // Update the trucker status without refetching all data
          onUpdateTruckers(prevTruckers => {
            const updatedTruckers = [...prevTruckers];
            const updatedTruckerIndex = updatedTruckers.findIndex(trucker => trucker.trucker_id === selectedTrucker.trucker_id);
    
            if (updatedTruckerIndex !== -1) {
              updatedTruckers[updatedTruckerIndex].trucker_status = newStatus;
            }
    
            return updatedTruckers;
          });
    
          onUpdateStatus(selectedTrucker.trucker_id, newStatus);
        } catch (error) {
          console.error("Error updating trucker status:", error);
        } finally {
          setUpdateLoading(false);
          onClose(); // Close the modal after updating
        }
      };

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${isOpen ? "block" : "hidden"
                }`}
        >
            <div className="absolute w-full h-full bg-gray-800 opacity-50"></div>
            <div className="bg-white w-full max-w-md p-6 rounded-lg z-10">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg mb-4">Trucker Details</h2>
                    <button
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                {selectedTrucker && (
                    <div>
                        <div className="flex items-center mb-4">
                            <img
                                src={selectedTrucker.logo}
                                alt="Business Logo"
                                className="w-30 h-20 object-cover rounded-lg mr-4"
                            />
                            <div>
                                <h3 className="font-bold text-darkblue">
                                    {selectedTrucker.business_name}
                                </h3>
                                <p className="text-sm">
                                    <strong>Trucker Name:</strong> {selectedTrucker.trucker_name}
                                </p>
                                <p className="text-sm">
                                    <strong>Position:</strong> {selectedTrucker.position}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-sm mb-2">
                            <MdMail className="text-darkblue mb-1" />
                            <div>{userDetails.email_address}</div>
                        </div>
                        <div className="flex flex-col items-center text-sm mb-2">
                            <MdPhone className="text-darkblue mb-1" />
                            <div>{selectedTrucker.contact_number}</div>
                        </div>
                        <div className="flex flex-col items-center text-sm mb-2">
                            <FaMapMarker className="text-darkblue mb-1" />
                            <div>{selectedTrucker.address}</div>
                        </div>
                        <div className="flex flex-col items-center mb-4">
                            <strong className="mb-1">Proof of Employment:</strong>
                            <img
                                src={imageSrc}
                                alt="Employee Proof"
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                        </div>
                        {selectedTrucker.trucker_status === "Pending" && (
                            <div className="flex justify-center">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={() => handleUpdateStatus("Approved")}
                                    disabled={updateLoading}
                                >
                                    Approve Trucker
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleUpdateStatus("Declined")}
                                    disabled={updateLoading}
                                >
                                    Decline Trucker
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTruckerModal;
