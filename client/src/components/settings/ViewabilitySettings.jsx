import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import config from "../../common/config";
import Rating from '@mui/material/Rating';
import { TiBusinessCard } from "react-icons/ti";
import { BiSolidCamera } from "react-icons/bi";
import { IoIosCall } from "react-icons/io";
import { FaMapMarker, FaTruck, FaEye, FaBan, FaTrailer, FaTruckMoving } from "react-icons/fa";
const ViewabilitySettings = () => {
    const navigate = useNavigate(); 
    const [truckerDetails, setTruckerDetails] = useState({});
    const [truckCount, setTruckCount] = useState(0);
    const [trailerCount, setTrailerCount] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [isViewable, setIsViewable] = useState(false); // Initialize with false initially
    const [confirmationText, setConfirmationText] = useState("");
    const [isConfirming, setIsConfirming] = useState(false);
    const storedAcc = localStorage.getItem('truckerDetails');
    const truckerid = storedAcc !== null && Number(JSON.parse(storedAcc).truckerID);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch trucker details
                const response = await axios.get(`${config.API}/trucker/retrieve?col=trucker_id&val=${truckerid}`);
                if (response.data && response.data.trucker && response.data.trucker.length > 0) {
                    setTruckerDetails(response.data.trucker[0]);
                    setIsViewable(response.data.trucker[0].is_viewable === 1); // Update isViewable based on fetched data
                }

                // Fetch other necessary data (e.g., ratings, counts)
                const ratingResponse = await axios.get(`${config.API}/review/retrieve_avg?trucker_id=${truckerid}`);
                setAverageRating(ratingResponse.data.average);

                const truckResponse = await axios.get(`${config.API}/asset/retrivecount_two?col1=trucker_id&val1=${truckerid}&col2=asset_category&val2=Truck`);
                setTruckCount(truckResponse.data.totalCount);

                const trailerResponse = await axios.get(`${config.API}/asset/retrivecount_two?col1=trucker_id&val1=${truckerid}&col2=asset_category&val2=Trailer`);
                setTrailerCount(trailerResponse.data.totalCount);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [truckerid]);

    const handleViewableChange = async (newValue) => {
        setIsConfirming(true);
        try {
            await axios.post(`${config.API}/trucker/update?truckerID=${truckerid}`, {
                trucker: {
                    is_viewable: newValue,
                },
            });
            setIsViewable(newValue);
            setConfirmationText(`Viewability status updated successfully to ${newValue === 1 ? "Viewable" : "Not Viewable"}.`);
        } catch (error) {
            console.error("Error updating viewability status: ", error);
            setConfirmationText("Error updating viewability status. Please try again.");
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <div className="mt-8">
            {/* View Card Overview Section */}
            <div className="w-auto h-auto bg-white m-8 p-5 rounded-lg animate-fade-in drop-shadow-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Service Viewability Preview</h2>
                <p className="text-sm text-gray-600">
                    You can view how other users can see your services.
                </p>
                <div className="card bg-white border border-gray-300 shadow-lg p-4 m-2 rounded-lg grid grid-cols-4 gap-4 w-[98%]">
                    {/* Logo Column */}
                    <div className="md:col-span-1 col-span-4 mr-[2em]">
                        {(truckerDetails.logo === null) ? (
                            <FaTruckMoving className="h-[15em] w-[15em] mr-2 mb-4 border border-darkblue text-gray-500" />
                        ) : (
                            <div className="rounded-lg overflow-hidden h-[15em] w-[15em] mr-2 mb-4 border border-darkblue">
                                <img src={truckerDetails.logo} alt="Business Logo" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>


                    {/* Contents Column */}
                    <div className="col-span-2 ml-[3em] mt-2">
                        <h2 className="font-bold text-darkblue text-[1.5em] mb-1">{truckerDetails.business_name}</h2>
                        <div className="flex items-center my-2">
                            <FaMapMarker className="text-darkblue" />
                            <div className="text-darkblue mx-2">{truckerDetails.address}</div>
                        </div>
                        <div className="flex items-center my-2">
                            <FaTruck className="text-darkblue mr-1" />
                            <div className="text-darkblue mx-2">{truckCount} Truck Assets</div>
                        </div>
                        <div className="flex items-center my-2">
                            <FaTrailer className="text-darkblue mr-1" />
                            <div className="text-darkblue mx-2">{trailerCount} Trailer Assets</div>
                        </div>
                        <div className="flex items-center my-2">
                            {truckerDetails.description ? (
                                <div className="text-darkblue">{truckerDetails.description}</div>
                            ) : (
                                <div className="text-darkblue">Your Description Shown Here</div>
                            )}
                        </div>
                    </div>

                    {/* Rating, Price, and Buttons Column */}
                    <div className="col-span-1 flex flex-col items-end">
                        {/* Ratings section */}
                        <div className="mb-[5em]">
                            <div className="flex items-center">
                                <div className="mr-2">
                                    <div className="text-right">Rating Score Here</div>
                                    <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                                </div>
                                <div className="bg-[#007EA7] text-white font-bold rounded-lg p-3">{Math.round(averageRating)}</div>
                            </div>
                        </div>

                        {/* Price and Buttons Section */}
                        <div className="text-black text-[0.8em]">Service Charge Shown Here</div>
                        {(truckerDetails.servCharge === null) ? (
                            <div className="text-black text-[1.5em] font-bold mb-2">₱ 00.00</div>
                        ) : (
                            <div className="text-black text-[1.5em] font-bold mb-2">₱ {truckerDetails.servCharge}</div>
                        )}
                        <div className="flex space-x-2">
                            <button
                                className="bg-[#007EA7] font-medium text-white rounded-md p-2 flex items-center"
                            >
                                <FaEye className="mr-1" />
                                View Service Button
                            </button>
                        </div>

                    </div>
                </div>
                <div className="mt-4 ml-2">
                    {(truckerDetails.servCharge === null) ? (
                    <p><strong>No charges set yet?</strong> Set up your charges <span style={{ cursor: "pointer", color: "blue" }} onClick={() => navigate("/trucker/paymentlist")}>here</span>.</p>
                    ) : (<></>)}
                    {(truckCount === 0) || (trailerCount === 0) ? (
                   <p><strong>Lacking or No available Assets?</strong> Add assets through <span style={{ cursor: "pointer", color: "blue" }} onClick={() => navigate("/trucker/assetlist")}>here</span>.</p>
                   ) : (<></>)}
                    </div>
            </div>



            <div className="w-auto h-auto bg-white m-8 p-5 rounded-lg animate-fade-in drop-shadow-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Set Viewability Settings</h2>
                <p className="text-sm text-gray-600">Set your Viewability Settings Here. Determine how you want users to see your services.</p>

                <div className="flex items-center mt-4 mb-2">
                    <p className="text-darkblue font-semibold mr-2">Viewability Status:</p>
                    {isViewable ? (
                        <span className="text-green-500">Viewable to Clients</span>
                    ) : (
                        <span className="text-red-500">Not Viewable to Clients</span>
                    )}
                </div>

                <div className="mb-4 flex items-center">
                    <p className="text-darkblue font-semibold mr-2">Change Viewability:</p>
                    <div className="flex space-x-2">
                        <button
                            className={`bg-green-500 font-medium text-white rounded-md p-2 flex items-center ${isViewable ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            onClick={() => handleViewableChange(1)}
                            disabled={isViewable || isConfirming}
                        >
                            <FaEye className="mr-1" />
                            Viewable
                        </button>
                        <button
                            className={`bg-red-500 font-medium text-white rounded-md p-2 flex items-center ${!isViewable ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            onClick={() => handleViewableChange(0)}
                            disabled={!isViewable || isConfirming}
                        >
                            <FaBan className="mr-1" />
                            Not Viewable
                        </button>
                    </div>
                </div>


                {confirmationText && (
                    <div className={`text-sm ${isConfirming ? "text-gray-600" : "text-green-500"}`}>
                        {confirmationText}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewabilitySettings;
