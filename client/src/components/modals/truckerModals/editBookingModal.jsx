import React, { useEffect, useState } from "react";
import config from '../../../common/config';
import axios from 'axios';
import SuccessPopup from "../../popups/SuccessPopup";
import { AiFillSave, AiFillCloseCircle, AiFillEdit, AiFillDelete } from "react-icons/ai";

const EditBookingModal = ({ booking, onSave, onClose, fetchBookings }) => {
    const [finishDate, setFinishDate] = useState(booking.est_finish_date);
    const [status, setStatus] = useState(booking.status);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const truckerID = Number(localStorage.getItem('trkr_id'));

    console.log("BOOKING ID??: ", booking.booking_id);

    // Set initial state values when the 'booking' prop changes
    useEffect(() => {
        // Update local state when the 'booking' prop changes
        setFinishDate(booking.est_finish_date);
        setStatus(booking.status);
    }, [booking]); // Add 'booking' as a dependency



    const handleFileChange = (e) => {
        // Handle the file change event
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('booking_id', booking.booking_id);
        formData.append('file_type', 'eir_doc'); // Add this line for eir_doc

        try {
            const response = await axios.post(`${config.API}/booking/submit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('File submitted successfully:', response.data.filePath);
            // You may want to update the state or perform other actions upon successful file submission
        } catch (error) {
            console.error('Error submitting file:', error);
            // Handle error
        }
    };

    const handleSave = async () => {
        // Convert local time to UTC
        const localDate = new Date(finishDate + "T00:00:00Z");
    
        let updatedBookingData = {
            est_finish_date: localDate.toISOString().split('T')[0],
            status: status,
            booking_id: booking.booking_id,
        };
    
        // Conditionally update data based on status
        if (status === "Completed") {
            // Update finish_date if it's not set
            if (!booking.finish_date) {
                updatedBookingData = {
                    ...updatedBookingData,
                    finish_date: new Date().toISOString().split('T')[0],
                };
            }
    
            if (selectedFile) {
                // Handle file submission logic
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('booking_id', booking.booking_id);
                formData.append('file_type', 'eir_doc'); // Add this line for eir_doc
    
                try {
                    const response = await axios.post(`${config.API}/booking/submit`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
    
                    console.log('File submitted successfully:', response.data.filePath);
                    // You may want to update the state or perform other actions upon successful file submission
                } catch (error) {
                    console.error('Error submitting file:', error);
                    // Handle error
                }
            } else if (!booking.eir_doc) {
                // Handle error when eir_doc is still null for completed status
                console.error("Error: EIR document is required for Completed status.");
                return;
            }
            try {
                // Call the complete API
                await axios.post(`${config.API}/booking/complete`, { booking_id: booking.booking_id });
    
                // Perform save logic here
                onSave({ finishDate, status });
    
                // Close the modal
                onClose();
    
                // Fetch updated bookings to reflect changes immediately
                fetchBookings();
            } catch (error) {
                console.error("Error completing booking:", error);
                // Handle error here
            }
        } else if (status === "Cancelled") {
            try {
                // Call the cancel API
                await axios.post(`${config.API}/booking/cancel`, { booking_id: booking.booking_id });
    
                // Perform save logic here
                onSave({ finishDate, status });
    
                // Close the modal
                onClose();
    
                // Fetch updated bookings to reflect changes immediately
                fetchBookings();
            } catch (error) {
                console.error("Error cancelling booking:", error);
                // Handle error here
            }
        }
    
        try {
            // Update booking data
            await axios.post(`${config.API}/booking/update`, updatedBookingData);
    
            // Perform save logic here
            onSave({ finishDate, status });
    
            // Close the modal
            onClose();
    
            // Fetch updated bookings to reflect changes immediately
            fetchBookings();
        } catch (error) {
            console.error("Error updating data:", error);
            // Handle error here
        }
    };
    const handleDelete = async () => {
        try {
            // Call the set_invisible API
            await axios.post(`${config.API}/booking/set_invisible`, { booking_id: booking.booking_id });

            // Perform delete logic here
            // For example, you might update the UI or show a notification
            console.log("Booking deleted successfully!");

            // Show the success popup
            setShowSuccessPopup(true);

            // Close the modal
            onClose();

            // Fetch updated bookings to reflect changes immediately
            fetchBookings();
        } catch (error) {
            console.error("Error deleting booking:", error);
            // Handle error here, such as showing an error message to the user
        }
    };
    const closeSuccessPopup = () => {
        setShowSuccessPopup(false);
    };
    // Conditionally render EIR section based on status
    const renderEIRSection = () => {
        if (status === "Completed") {
            return (
                <>
                    {/* EIR Section UI */}
                    <div className="flex items-center w-full">
                        <h1 className="font-bold uppercase text-[1.5em] ml-[4%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                            Submit Proof of Completion (EIR)
                        </h1>
                    </div>
                    <div className="flex ml-[4%] mr-[2%] text-[1.2em] xl:max-2xl:text-[0.8em]">
                        <div>
                            <h1 className="italic text-[1em]">
                                This document is essential for the completion of bookings.
                            </h1>
                            <input
                                type="file"
                                className="my-2"
                                onChange={handleFileChange}
                            />
                            {/* 
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={handleFileSubmit}
                            >
                                Upload EIR Document
                            </button>
                            */}
                        </div>
                    </div>
                </>
            );
        }
        return null;
    };

    const renderCancellationSection = () => {
        if (status === "Cancelled") {
            return (
                <>
                    {/* Cancellation Section UI */}
                    <div className="flex items-center w-full">
                        <h1 className="font-bold uppercase text-[1.5em] ml-[4%] bg-[#DD2803] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                            Confirm Cancellation
                        </h1>
                    </div>
                    <div className="flex ml-[4%] mr-[2%] text-[1.2em] xl:max-2xl:text-[0.8em]">
                        <div>
                            <p className="italic text-[1em]">
                                By cancelling this booking, you will be unable to make any modifications.
                            </p>
                        </div>
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            <div className="animate-slide-up font-roboto fixed top-[25%] left-[30%] right-0 bg-white z-50 bg-[rgba(0, 0, 0, 0.5)] w-[40%] p-4 overflow-x-hidden overflow-y-auto h-[45%] drop-shadow rounded-3xl">
                <div className="flex w-[95%] h-[5vh]">
                    <div className="flex items-center w-[96%] mt-[0.5%]">
                        <div className="flex items-center w-[100%] ml-[1%]">
                            <AiFillEdit className="mr-[1%] text-[2em] xl:max-2xl:text-[1.3em]" />
                            <h1 className="font-bold text-[1.5em] xl:max-2xl:text-[1.2em]">
                                Update Booking Details
                            </h1>
                        </div>
                    </div>
                    <div className="mt-[0.5%]">
                        <AiFillCloseCircle
                            className="text-[2.5em] hover:cursor-pointer xl:max-2xl:text-[1.8em]"
                            onClick={onClose}
                        />
                    </div>
                </div>
                <hr className="h-[2px] w-full my-[1.2%] bg-gray-200 border-0" />

                {/* General Information */}
                <div className="flex items-center w-full">
                    <h1 className="font-bold uppercase text-[1.5em] ml-[4%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                        Status and Date
                    </h1>
                </div>
                <div className="flex ml-[4%] mr-[2%] text-[1.2em] w-full xl:max-2xl:text-[0.8em]">
                    <div className="w-[50%]">
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Set New Status</p>
                            <select
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Pullout Docs Required">Pullout Docs Required</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-[50%]">
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Set New Est. Finish Date</p>
                            <input
                                type="date"
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="res_date"
                                value={finishDate}
                                onChange={(e) => setFinishDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Conditionally render section based on status */}
                {renderEIRSection()}
                {renderCancellationSection()}
                <div className="relative bottom-[2%] top-[2%] mb-[2%] w-[100%]">
                    <hr className=" w-[99%] h-[1px] bg-black border-0" />
                    <div className="flex justify-end mr-[3%] mt-[1%]">
                        <button
                            className="flex mr-2 text-white text-[1.1em] bg-[#17A200] px-[2%] py-[0.5%] rounded-2xl xl:max-2xl:text-[0.8em] hover:bg-[#117600]"
                            onClick={handleSave}
                        >
                            <AiFillSave className="my-[2%]  text-[1.2em] mr-[1%]" />
                            Save
                        </button>
                        {(booking.status === "Cancelled" || booking.status === "Completed") ? (
                            <button
                                className="flex text-white text-[1.1em] bg-[#DD2803] px-[2%] py-[0.5%] rounded-2xl xl:max-2xl:text-[0.8em]
                hover:bg-[#840705] transition-colors delay-450 duration-[3000] ease-in-out"
                                onClick={handleDelete}
                            >
                                <AiFillDelete className="mt-[5%] pr-[5%] " />
                                Delete
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            {/* Success Popup */}
            {showSuccessPopup && (
                <SuccessPopup
                    message="Booking deleted successfully!"
                    onClose={closeSuccessPopup}
                />
            )}
        </div>
    );
};

export default EditBookingModal;
