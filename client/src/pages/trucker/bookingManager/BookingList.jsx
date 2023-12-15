import React, { useEffect, useState } from "react";
import config from '../../../common/config';
import axios from 'axios';
import { BiSolidBookBookmark } from "react-icons/bi";
import ViewBookingModal from "../../../components/modals/truckerModals/viewBookingModal.jsx";
import EditBookingModal from "../../../components/modals/truckerModals/editBookingModal.jsx";
import SuccessPopup from "../../../components/popups/SuccessPopup.jsx";

const BookingList = () => {
    const [bookings, setBookings] = useState([]); // State to hold the booking data
    const [filter, setFilter] = useState("All"); // State to manage the active tab
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
    const [selectedBookingToDelete, setSelectedBookingToDelete] = useState(null);
    const truckerID = Number(localStorage.getItem('trkr_id')); //to be used

    const statusOptions = [
        "All",
        "Pending",
        "Pullout Docs Required",
        "Reserved",
        "Ongoing",
        "Completed",
    ];

    // Function to fetch booking data from the API
    const fetchBookings = () => {
        const col = "trucker_id";
        const val = truckerID;
        const orderCol = "booking_date";
        const order = "DESC";

        axios
            .get(
                `${config.API}/booking/retrieve?col=${col}&val=${val}&orderVal=${orderCol}&order=${order}`
            )
            .then((response) => {
                const bookingData = response.data.records;
                console.log(bookingData);
                // Check if bookingData is an array
                if (Array.isArray(bookingData)) {
                    Promise.all(
                        bookingData.map((booking) => {
                            const clientCol = "client_id";
                            const clientVal = booking.client_id;
                            console.log("CLIENT VAL:", clientVal);
                            return axios
                                .get(`${config.API}/client/retrieve?col=client_id&val=${clientVal}`)
                                .then((clientResponse) => {
                                    // Check if the 'clients' array exists in the response data
                                    if (Array.isArray(clientResponse.data.clients) && clientResponse.data.clients.length > 0) {
                                        // Update the booking object with client details and formatted date
                                        booking.client_name = clientResponse.data.clients[0].client_name;
                                        booking.booking_date = new Date(booking.booking_date).toISOString().split('T')[0];
                                        booking.est_finish_date = new Date(booking.est_finish_date).toISOString().split('T')[0];

                                    } else {
                                        console.error("Invalid or empty 'clients' array in API response");
                                        // Handle the case where 'clients' array is invalid or empty in the API response
                                    }
                                    return booking;
                                })
                                .catch((error) => {
                                    console.error("Error fetching client details:", error);
                                    return booking; // Keep the original booking if there was an error
                                });
                        })
                    )
                        .then((bookingsWithClientNames) => {
                            // Update the bookings state with the fetched data
                            setBookings(bookingsWithClientNames);
                        })
                        .catch((error) => {
                            console.error("Error fetching client details for all bookings:", error);
                        });
                } else {
                    console.error("Invalid data format for bookings:", bookingData);
                }
            })
            .catch((error) => {
                console.error("Error fetching bookings:", error);
            });
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter((booking) => {
        if (filter === "All") {
            return booking.is_visible === 1; // Only show visible bookings
        }
        return booking.status === filter && booking.is_visible === 1; // Only show visible bookings with the selected status
    });


    const handleTabClick = (status) => {
        setFilter(status);
    };


    const handleViewModalOpen = (booking) => {
        setSelectedBooking(booking);
        setViewModalOpen(true);
    };

    const handleEditModalOpen = (booking) => {
        setSelectedBooking(booking);
        setEditModalOpen(true);
    };

    const handleEditModalSave = (updatedData) => {
        // Find the index of the edited booking in the state
        const index = bookings.findIndex((booking) => booking.booking_id === selectedBooking.booking_id);

        // Create a new array with the updated booking
        const updatedBookings = [...bookings];
        updatedBookings[index] = { ...selectedBooking, ...updatedData };

        // Update the state with the new array
        setBookings(updatedBookings);

        // Update the selectedBooking state
        setSelectedBooking(updatedBookings[index]);

        // Close the modal
        setEditModalOpen(false);
    };

    const handleDelete = (booking) => {
        // Set the selected booking for deletion
        setShowDeleteConfirmationModal(true);
        setSelectedBookingToDelete(booking);
    };

    const confirmDelete = async () => {
        if (selectedBookingToDelete && selectedBookingToDelete.booking_id) {
            try {
                // Send a request to the server to delete the booking
                await axios.post(`${config.API}/booking/set_invisible`, { booking_id: selectedBookingToDelete.booking_id });

                // Filter out the deleted booking from the state
                const updatedBookings = bookings.filter((booking) => booking.booking_id !== selectedBookingToDelete.booking_id);

                // Update the state with the new array
                setBookings(updatedBookings);

                // Close the delete confirmation modal
                setShowDeleteConfirmationModal(false);

                // Clear the selected booking for deletion
                setSelectedBookingToDelete(null);

                // Show the success popup
                setShowDeleteSuccessPopup(true);
            } catch (error) {
                console.error("Error deleting booking:", error);
                // Handle error here, such as showing an error message to the user
            }
        } else {
            console.error("Selected booking is null or does not have a booking_id property");
        }
    };
    const closeDeleteConfirmationModal = () => {
        // Close the delete confirmation modal
        setShowDeleteConfirmationModal(false);
    };

    const closeDeleteSuccessPopup = () => {
        // Close the success popup
        setShowDeleteSuccessPopup(false);
    };
    return (
        <div className="animate-fade-in">
            <div className="my-4 mx-8 flex text-[2em] font-bold items-center">
                <BiSolidBookBookmark className="mr-2" /> Bookings List
            </div>
            <div className="flex items-center overflow-y-auto overflow-x-hidden">
                <div className="w-[70%] py-[1%] pl-[2%]">
                    {/* Buttons for filtering bookings */}
                    <div className="flex space-x-4 ml-6">
                        {statusOptions.map((status) => (
                            <button
                                key={status}
                                className={`text-[1.1em] font-bold xl:max-2xl:text-[0.8em] py-2 px-4 cursor-pointer focus:outline-none ${filter === status
                                    ? "bg-[#003249] text-white font-bold border-b-[4px] border-solid border-[#007bff]"
                                    : "text-[#003249] border-b-5 border-[#132c47] border-solid"
                                    }`}
                                onClick={() => handleTabClick(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-[82.5vh] overflow-y-auto">
                <div className="font-roboto mx-[3%] mt-[1%] mb-[1%]">
                    <div className="px-[1%] bg-white rounded-lg drop-shadow-lg shadow-lg opacity-1">
                        {/* Table to display bookings */}
                        <table className="w-[100%] mt-[0.8%]">
                            <thead className="text-[1.2em] xl:max-2xl:text-[0.9em]">
                                <tr>
                                    <th className="py-[0.7%]">Client Name</th>
                                    <th>Delivery Address</th>
                                    <th>Booking Date</th>
                                    <th>Est. Arrival Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                <tr>
                                    <th
                                        colSpan={6}
                                        className="border-b-[1px] border-slate-500"
                                    ></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Display filtered bookings */}

                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <tr
                                            className="text-center xl:max-2xl:text-[0.8em]"
                                            key={booking.id}
                                        >
                                            <td className="py-[1%]">{booking.client_name}</td>
                                            <td>{booking.delivery_address}</td>
                                            <td>{booking.booking_date}</td>
                                            <td>{booking.est_finish_date}</td>
                                            <td className="flex justify-center">
                                                <p
                                                    className={`font-bold rounded-full mt-1 py-[2%] w-[60%] xl:max-2xl:text-[0.9em] 
                                            ${booking.status == "Pending"
                                                            ? "bg-[#f6b3b3] text-[#4f2417]"
                                                            : booking.status == "Pullout Docs Required"
                                                                ? "bg-[#fec06f] text-[#6d4c20]"
                                                                : booking.status == "Reserved"
                                                                    ? "bg-[#ffb998] text-[#531a1a]"
                                                                    : booking.status == "Ongoing"
                                                                        ? "bg-[#94cae9] text-[#1c4a64]"
                                                                        : booking.status == "Completed"
                                                                            ? "bg-[#8bdfa3] text-[#1a562b]"
                                                                            : "bg-[#262626] text-[#afafaf]"
                                                        }`}
                                                >
                                                    {booking.status}
                                                </p>
                                            </td>
                                            <td className="py-2 px-2">
                                                {/* Buttons for View and Edit actions */}
                                                <button
                                                    className="bg-[#011627] text-white px-2 py-1 rounded mr-2"
                                                    onClick={() => handleViewModalOpen(booking)}
                                                >
                                                    View
                                                </button>
                                                {(booking.status === "Completed") || (booking.status === "Cancelled") ? (
                                                    <button
                                                    className="bg-[#ce3636] text-[#ffffff] px-2 py-1 rounded mr-2"
                                                    onClick={() => handleDelete(booking)}
                                                >
                                                    Delete
                                                </button>
                                                ) : (
                                                    <button
                                                        className="bg-[#ff9736] text-[#1b1b1b] px-2 py-1 rounded mr-2"
                                                        onClick={() => handleEditModalOpen(booking)}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-gray-500 py-4">No current bookings</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* View Booking Modal */}
            {isViewModalOpen && (
                <ViewBookingModal
                    booking={selectedBooking}
                    onClose={() => setViewModalOpen(false)}
                />
            )}

            {/* Edit Booking Modal */}
            {isEditModalOpen && (
                <EditBookingModal
                    booking={selectedBooking}
                    onSave={handleEditModalSave}
                    onClose={() => setEditModalOpen(false)}
                    fetchBookings={fetchBookings}  // Pass the fetchBookings function
                />
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmationModal && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white w-1/3 p-8 rounded-lg">
                        <p className="text-xl font-bold mb-4">Confirm Deletion</p>
                        <p className="text-gray-700 mb-4">Are you sure you want to delete this booking?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                onClick={confirmDelete}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                onClick={closeDeleteConfirmationModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Success Popup */}
            {showDeleteSuccessPopup && (
                <SuccessPopup
                    message="Booking deleted successfully!"
                    onClose={closeDeleteSuccessPopup}
                />
            )}
        </div>
    );
};

export default BookingList;
