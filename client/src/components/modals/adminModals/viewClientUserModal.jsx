// ViewClientUserModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from '../../../common/config';

const ViewClientUserModal = ({ userId, onClose }) => {
    const [userDetails, setUserDetails] = useState({});
    const [clientDetails, setClientDetails] = useState({});
    const [confirmationVisible, setConfirmationVisible] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`${config.API}/user/retrieve?col=user_id&val=${userId}`);
                const clientResponse = await axios.get(`${config.API}/client/retrieve?col=user_id&val=${userId}`);
                setUserDetails(userResponse.data.records[0] || {});
                setClientDetails(clientResponse.data.clients[0] || {});
            } catch (error) {
                console.error("Error fetching user and client data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleDelete = async () => {
        try {
            // Call the first API to delete the client record
            await axios.delete(`${config.API}/client/harddelete?client_id=${clientDetails.client_id}`);
            
            // Call the second API to delete the user record after successful deletion of the client record
            await axios.delete(`${config.API}/user/delete?user_id=${userDetails.user_id}`);
            
            // Close the modal after successful deletion
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error deleting user and client data:", error);
            // Handle error as needed
        }
    };


    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#241B2F] p-8 rounded-md">
                {/* Display user details */}
                <div className="text-[#9577A9]">
                    {/* Display user details */}
                    <h2 className="text-2xl font-bold mb-4">User Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p>User ID:</p>
                            <p>Email Address:</p>
                            <p>User Type:</p>
                            <p>Current Status:</p>
                            <p>Date Registered:</p>
                            <p>Last Logged In:</p>
                        </div>
                        <div className="text-right">
                            <p>{userDetails.user_id}</p>
                            <p>{userDetails.email_address}</p>
                            <p>{userDetails.user_type}</p>
                            <p>{userDetails.status}</p>
                            <p>{userDetails.date_registered ? new Date(userDetails.date_registered).toLocaleDateString() : 'N/A'}</p>
                            <p>{userDetails.last_login ? new Date(userDetails.last_login).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                    {/* Display client details */}
                    <h2 className="text-2xl font-bold mt-4 mb-4">Client Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p>Client ID:</p>
                            <p>Client Name:</p>
                            <p>Contact Number:</p>
                            <p>Last Updated:</p>
                        </div>
                        <div className="text-right">
                            <p>{clientDetails.client_id}</p>
                            <p>{clientDetails.client_name}</p>
                            <p>{clientDetails.contact_number}</p>
                            <p>{clientDetails.date_updated ? new Date(clientDetails.date_updated).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
                {/* Close button */}
                {(userDetails.status === 'deleted') ? (
                    
                <button
                    className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
                    onClick={() => setConfirmationVisible(true)}
                >
                    Delete User
                </button>
                ) : (<></>)}
                <button
                    className="bg-[#514164] text-white px-4 py-2 mt-4 rounded hover:bg-[#423354]"
                    onClick={onClose}
                >
                    Close
                </button>
                {/* Confirmation Modal */}
                {confirmationVisible && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                        <div className="bg-[#241B2F] p-8 rounded-md">
                            <p className="text-xl font-bold mb-4">Are you sure you want to delete this user? <br/> This record will be lost forever.</p>
                            <div className="flex justify-end">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 mr-2 rounded hover:bg-red-600"
                                    onClick={handleDelete}
                                >
                                    Yes
                                </button>
                                <button
                                    className="bg-[#514164] text-white px-4 py-2 rounded hover:bg-[#423354]"
                                    onClick={() => setConfirmationVisible(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewClientUserModal;
