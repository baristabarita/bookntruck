import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import config from '../../../common/config'
import { BiSolidDashboard } from "react-icons/bi";
import { BsFillCalendar2EventFill } from "react-icons/bs"
import { MdPayments, MdPendingActions } from "react-icons/md"
import { FaCalendarCheck } from "react-icons/fa"
import LineChart from "../../../components/charts/truckercharts/LineChart.jsx";

const BusinDashboard = () => {
    const navigate = useNavigate(); 
    const truckerID = Number(localStorage.getItem('trkr_id'));
    const [totalBookings, setTotalBookings] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [ongoingBookings, setOngoingBookings] = useState([]);
    const [completeCount, setCompleteCount] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [isViewable, setIsViewable] = useState(false);

    const fetchViewability = async () => {
        try {
            const response = await axios.get(`${config.API}/trucker/retrieve?col=trucker_id&val=${truckerID}`);
            if (response.data && response.data.trucker && response.data.trucker.length > 0) {
                setIsViewable(response.data.trucker[0].is_viewable === 1);
            }
        } catch (error) {
            console.error("Error fetching viewability status: ", error);
        }
    }
    const fetchPendingBookings = async () => {
        try {
            setLoadingBookings(true);
            const response = await axios.get(
                `${config.API}/booking/retrieve_two?col1=trucker_id&val1=${truckerID}&col2=status&val2=Pending&orderVal=booking_id&order=ASC`
            );
            const updatedBookings = await Promise.all(response.data.records.map(async (booking) => {
                const clientDetailsResponse = await fetchClientDetails(booking.client_id);
                const containerDetailsResponse = await fetchContainerDetails(booking.container_id);

                return {
                    ...booking,
                    clientDetails: clientDetailsResponse.data.clients[0] || {},
                    containerDetails: containerDetailsResponse.data.data[0] || {},
                };
            }));
            setPendingBookings(updatedBookings);
        } catch (error) {
            console.error("Error fetching pending bookings:", error);
        } finally {
            setLoadingBookings(false);
        }
    };
    // Fetch assets owned by trucker
    const fetchTruckerAssets = async () => {
        try {
            const response = await axios.get(
                `${config.API}/asset/retrieve?col=trucker_id&val=${truckerID}`
            );

            setAssets(response.data.data);
        } catch (error) {
            console.error("Error fetching trucker's assets:", error);
        }
    };
    const fetchClientDetails = async (clientId) => {
        try {
            return await axios.get(`${config.API}/client/retrieve?col=client_id&val=${clientId}`);
        } catch (error) {
            console.error("Error fetching client details:", error);
            return {};
        }
    };

    const fetchContainerDetails = async (containerId) => {
        try {
            return await axios.get(`${config.API}/container/retrieve?col=container_id&val=${containerId}`);
        } catch (error) {
            console.error("Error fetching container details:", error);
            return {};
        }
    };

    const handleBookingAction = async (bookingId, action) => {
        try {
            setLoadingBookings(true);
            const newStatus = action === 'accept' ? 'Pullout Docs Required' : 'Cancelled';
            await axios.post(`${config.API}/booking/update`, {
                booking_id: bookingId,
                status: newStatus,
            });

            setPendingBookings(prevBookings => {
                return prevBookings.filter(booking => booking.booking_id !== bookingId);
            });
        } catch (error) {
            console.error("Error updating booking status:", error);
        } finally {
            setLoadingBookings(false);
        }
    };

    const fetchPendingPaymentsCount = async () => {
        try {
            // Fetch payment IDs with pending status
            const pendingPaymentIdsResponse = await axios.get(
                `${config.API}/payment/retrieve?col=payment_status&val=Pending`
            );
            const pendingPaymentIds = pendingPaymentIdsResponse.data.data.map(payment => payment.payment_id);

            let pendingPaymentsCount = 0;

            // Fetch bookings count for each pending payment ID
            for (const paymentId of pendingPaymentIds) {
                const pendingBookingsCountResponse = await axios.get(
                    `${config.API}/booking/retrievecount_two?col1=trucker_id&val1=${truckerID}&col2=payment_id&val2=${paymentId}`
                );
                pendingPaymentsCount += pendingBookingsCountResponse.data.count;
            }

            setPendingPayments(pendingPaymentsCount);
        } catch (error) {
            console.error("Error fetching pending payments count:", error);
        }
    };
    const fetchCounts = async () => {
        try {
            // Fetch total bookings count
            const totalBookingsCountResponse = await axios.get(
                `${config.API}/booking/retrievecount?col=trucker_id&val=${truckerID}`
            );
            const totalBookingsCount = totalBookingsCountResponse.data.count;


            // Fetch ongoing bookings count
            const ongoingBookingsCountResponse = await axios.get(
                `${config.API}/booking/retrievecount_two?col1=trucker_id&val1=${truckerID}&col2=status&val2=Ongoing`
            );
            const ongoingBookingsCount = ongoingBookingsCountResponse.data.count;

            // Fetch completed bookings count
            const completedBookingsCountResponse = await axios.get(
                `${config.API}/booking/retrievecount_two?col1=trucker_id&val1=${truckerID}&col2=status&val2=Completed`
            );
            const completedBookingsCount = completedBookingsCountResponse.data.count;

            setTotalBookings(totalBookingsCount);
            setOngoingBookings(ongoingBookingsCount);
            setCompleteCount(completedBookingsCount);
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchViewability();
            await fetchPendingBookings();
            await fetchTruckerAssets();
            await fetchPendingPaymentsCount();
            await fetchCounts();
        };

        fetchData();
    }, [truckerID]);


    return (
        <div className="animate-fade-in p-5">
            <div className="mt-4 flex text-[1.8em] font-bold items-center justify-between">
                <p className="flex">
                    <BiSolidDashboard className="mr-2" /> Dashboard
                </p>
                <div className="flex flex-col items-end">
                    <div className="flex">
                        <p className="text-darkblue font-bold mr-2 text-[0.7em]">Viewability Status:</p>
                        {isViewable ? (
                            <span className="text-green-500 text-[0.7em]">Viewable</span>
                        ) : (
                            <span className="text-red-500 text-[0.7em]">Not Viewable</span>
                        )}
                    </div>
                    <p className="flex font-medium mt-1 text-[0.7em]">Set up viewability <span className="ml-2" style={{ cursor: "pointer", color: "#21a1da" }} onClick={() => navigate("/trucker/trkrsettings")}> here</span>.</p>
                </div>
            </div>




            {/* Top Section */}
            <div className="h-[30vh] flex overflow-y-auto overflow-x-hidden rounded-lg">
                <div className="w-[30%] p-[1%] text-center">
                    <div className="align-center text-center p-[3%] h-[26vh] rounded-2xl bg-[#21a1da] shadow-lg drop-shadow-lg">
                        <h1 className="font-bold text-[1.8em] text-[#003249] xl:text-[1.5em] mt-3 text-shadow-lg">
                            Welcome, Manager!
                        </h1>
                        <p className="font-roboto text-[1.3em] text-[#003249] xl:text-[1em] mx-2 text-left">
                            <br />
                            Explore, manage, and stay updated with ease.
                        </p>
                    </div>
                </div>

                <div className="flex flex-row flex-wrap gap-4 items-center justify-between w-[90%] mx-auto mt-2">
                    <div className="bg-[#003249] h-[24vh] rounded-2xl flex flex-row shadow-lg drop-shadow-lg items-center p-4">
                        <p className="text-[#F6AE2D] text-[5em] font-bold text-center md:text-left xl:text-[3em] ml-2 mr-4">
                            {totalBookings}
                        </p>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-center md:justify-start">
                                <BsFillCalendar2EventFill className="text-[#F6AE2D] text-[2.5em] xl:text-[2.5em]" />
                            </div>
                            <p className="text-[#F6AE2D] font-bold text-center md:text-left text-[1.2em] xl:text-[0.8em] mt-2">
                                TOTAL BOOKINGS
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#003249] h-[24vh] rounded-2xl flex flex-row shadow-lg drop-shadow-lg items-center p-4">
                        <p className="text-[#F6AE2D] text-[5em] font-bold text-center md:text-left xl:text-[3em] ml-2 mr-4">
                            {pendingPayments}
                        </p>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-center md:justify-start">
                                <MdPayments className="text-[#F6AE2D] text-[2.5em] xl:text-[2.5em]" />
                            </div>
                            <p className="text-[#F6AE2D] font-bold text-center md:text-left text-[1.2em] xl:text-[0.8em] mt-2">
                                PENDING PAYMENTS
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#003249] h-[24vh] rounded-2xl flex flex-row shadow-lg drop-shadow-lg items-center p-4">
                        <p className="text-[#F6AE2D] text-[5em] font-bold text-center md:text-left xl:text-[3em] ml-2 mr-4">
                            {ongoingBookings}
                        </p>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-center md:justify-start">
                                <MdPendingActions className="text-[#F6AE2D] text-[2.5em] xl:text-[2.5em]" />
                            </div>
                            <p className="text-[#F6AE2D] font-bold text-center md:text-left text-[1.2em] xl:text-[0.8em] mt-2">
                                BOOKINGS ONGOING
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#003249] h-[24vh] rounded-2xl flex flex-row shadow-lg drop-shadow-lg items-center p-4">
                        <p className="text-[#F6AE2D] text-[5em] font-bold text-center md:text-left xl:text-[3em] ml-2 mr-4">
                            {completeCount}
                        </p>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-center md:justify-start">
                                <FaCalendarCheck className="text-[#F6AE2D] text-[2.5em] xl:text-[2.5em]" />
                            </div>
                            <p className="text-[#F6AE2D] font-bold text-center md:text-left text-[1.2em] xl:text-[0.8em] mt-2">
                                BOOKINGS COMPLETED
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            {/* Bookings This month section */}
            <div className="container mt-5 bg-[white] rounded-md border shadow-lg drop-shadow-lg ">
                <div className="flex items-center justify-between py-2 px-4 border-b-2 border-gray-300">
                    <h2 className="text-[1.5em] font-bold">Bookings This Month</h2>
                </div>
                <div className="h-[50vh] mx-10 pb-5">
                    <LineChart truckerID={truckerID} />
                </div>
            </div>

            {/* Tables Section */}
            <div className="h-[50vh] flex overflow-auto mt-5">
                {/* Pending Bookings */}
                <div className="w-[75%] m-[1%] text-center bg-white flex-col pt-0 overflow-auto border shadow-lg drop-shadow-lg">
                    <div className="text-left border-b-2 border-gray-300">
                        <p className="flex font-semibold text-[1.5em] xl:max-2xl:text-[1.2em] px-5 py-2">
                            Pending Bookings<br />
                        </p>
                    </div>
                    <div className="px-5 py-2">
                        <table className="flex-col w-[100%] text-left bg-white rounded-3xl overflow-auto xl:max-2xl:text-[0.8em]">
                            <thead>
                                <tr>
                                    <th>Client Name</th>
                                    <th>Container Type</th>
                                    <th>Booking Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingBookings ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">Loading Data...</td>
                                    </tr>
                                ) : (
                                    pendingBookings.length > 0 ? (
                                        pendingBookings.map((booking) => (
                                            <tr key={booking.booking_id}>
                                                <td className="py-2">{booking.clientDetails?.client_name || 'N/A'}</td>
                                                <td className="py-2">{booking.containerDetails?.container_type || 'N/A'}</td>
                                                <td className="py-2">{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}</td>
                                                <td className="py-2">
                                                    <button
                                                        onClick={() => handleBookingAction(booking.booking_id, 'accept')}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleBookingAction(booking.booking_id, 'decline')}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                                    >
                                                        Decline
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">No pending bookings</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="w-[75%] m-[1%] text-center bg-white flex-col pt-0 overflow-auto border shadow-lg drop-shadow-lg">
                    <div className="text-left border-b-2 border-gray-300">
                        <p className="flex font-semibold text-[1.5em] xl:max-2xl:text-[1.2em] px-5 py-2">
                            Asset Overview <br />
                        </p>
                    </div>
                    <div className="px-5 py-2">
                        <table className="w-[100%] text-left bg-white rounded-3xl overflow-auto xl:max-2xl:text-[0.8em]">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4">Asset ID</th>
                                    <th className="py-2 px-4">Asset Type</th>
                                    <th className="py-2 px-4">Current Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.length > 0 ? (
                                    assets.map((asset) => (
                                        <tr key={asset.asset_id}>
                                            <td className="py-3 px-4">{asset.asset_id}</td>
                                            <td className="py-2 px-4">{asset.asset_category}</td>
                                            <td
                                                className={`font-bold rounded-full py-2 px-4 text-center w-[30%] ${asset.status === 'Idle' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {asset.status}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">No assets available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default BusinDashboard;

