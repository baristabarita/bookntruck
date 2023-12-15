import React, { useEffect, useState } from "react";
import axios from 'axios';
import config from '../../../common/config';
import { PiNotebookFill } from "react-icons/pi";
import { AiFillCloseCircle, AiFillDelete } from "react-icons/ai";
import DocumentModal from '../viewDocumentModal.jsx';
import LoadingViewBookingModal from "../../loaders/LoadingViewBookingModal.jsx";

const ViewBookingModal = ({ booking, onClose }) => {
    const truckerID = Number(localStorage.getItem('trkr_id'));
    const [clientDetails, setClientDetails] = useState({});
    const [userDetails, setUserDetails] = useState(null);
    const [assignedTruck, setAssignedTruck] = useState([]);
    const [assignedTrailer, setAssignedTrailer] = useState([]);
    const [containerDetails, setContainerDetails] = useState([]);
    const [pulloutDocUrl, setPulloutDocUrl] = useState(null);
    const [eirDocUrl, setEirDocUrl] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState(null);
    const bookDate = new Date(booking.booking_date).toISOString().split('T')[0];
    const [truckAssets, setTruckAssets] = useState([]);
    const [trailerAssets, setTrailerAssets] = useState([]);
    const [selectedTruckAsset, setSelectedTruckAsset] = useState(null);
    const [selectedTrailerAsset, setSelectedTrailerAsset] = useState(null);
    const [isAssigningAssets, setIsAssigningAssets] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dataFetched, setDataFetched] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const col1 = 'trucker_id';
                const val1 = truckerID;
                const col2 = 'asset_category';
                const tkval2 = "Truck";
                const trval2 = "Trailer";
                const col3 = 'booking_id';
                const val3 = booking.booking_id;

                const [
                    clientDetailsResponse,
                    assignedTruckResponse,
                    assignedTrailerResponse,
                    truckAssetsResponse,
                    trailerAssetsResponse,
                    containerDetailsResponse
                ] = await Promise.all([
                    axios.get(`${config.API}/client/retrieve`, { params: { col: 'client_id', val: booking.client_id } }),
                    axios.get(`${config.API}/asset/retrievethreeparams?col1=${col1}&val1=${val1}&col2=${col2}&val2=${tkval2}&col3=${col3}&val3=${val3}`),
                    axios.get(`${config.API}/asset/retrievethreeparams?col1=${col1}&val1=${val1}&col2=${col2}&val2=${trval2}&col3=${col3}&val3=${val3}`),
                    axios.get(`${config.API}/asset/retrieveparams?col1=${col1}&val1=${val1}&col2=${col2}&val2=${tkval2}`),
                    axios.get(`${config.API}/asset/retrieveparams?col1=${col1}&val1=${val1}&col2=${col2}&val2=${trval2}`),
                    axios.get(`${config.API}/container/retrieve`, { params: { col: 'container_id', val: booking.container_id } })
                ]);

                if (clientDetailsResponse.data && clientDetailsResponse.data.clients && clientDetailsResponse.data.clients.length > 0) {
                    setClientDetails(clientDetailsResponse.data.clients[0]);
                    fetchUserDetails(clientDetailsResponse.data.clients[0]?.user_id);
                }

                if (assignedTruckResponse.data && assignedTruckResponse.data.data && assignedTruckResponse.data.data.length > 0) {
                    setAssignedTruck(assignedTruckResponse.data.data[0]);
                }

                if (assignedTrailerResponse.data && assignedTrailerResponse.data.data && assignedTrailerResponse.data.data.length > 0) {
                    setAssignedTrailer(assignedTrailerResponse.data.data[0]);
                }

                if (containerDetailsResponse.data && containerDetailsResponse.data.data && containerDetailsResponse.data.data.length > 0) {
                    setContainerDetails(containerDetailsResponse.data.data[0]);
                }

                if (truckAssetsResponse.data && truckAssetsResponse.data.data && truckAssetsResponse.data.data.length > 0) {
                    setTruckAssets(truckAssetsResponse.data.data);
                }

                if (trailerAssetsResponse.data && trailerAssetsResponse.data.data && trailerAssetsResponse.data.data.length > 0) {
                    setTrailerAssets(trailerAssetsResponse.data.data);
                }

                if (booking.pullout_doc) {
                    setPulloutDocUrl(`${config.API}/${booking.pullout_doc}`);
                }

                if (booking.eir_doc) {
                    setEirDocUrl(`${config.API}/${booking.eir_doc}`);
                }

                setDataFetched(true);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error as needed
                setLoading(false);
            }
        };

        fetchData();
    }, [booking, assignedTruck, assignedTrailer]);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`${config.API}/user/retrieve`, {
                params: {
                    col: 'user_id',
                    val: userId,
                },
            });
            console.log("Fetch User Details Reponse: ", response.data.users);
            setUserDetails(response.data.records);
        } catch {
            console.error('Error fetching user details: ', error);
        }
    }

    const handleAssignAssets = () => {
        setIsAssigningAssets(true);
    };

    const handleSetAssets = async () => {
        // Check if both truck and trailer assets are selected
        if (selectedTruckAsset && selectedTrailerAsset) {
            // API call to set assets for the booking
            const truckAssetId = selectedTruckAsset.asset_id;
            const trailerAssetId = selectedTrailerAsset.asset_id;

            const truckAssetUpdate = {
                asset_id: truckAssetId,
                status: "In-Use",
                booking_id: booking.booking_id,
            };

            const trailerAssetUpdate = {
                asset_id: trailerAssetId,
                status: "In-Use",
                booking_id: booking.booking_id,
            };

            try {
                // API call to update truck asset
                await axios.post(`${config.API}/asset/setbooking`, truckAssetUpdate);

                // API call to update trailer asset
                await axios.post(`${config.API}/asset/setbooking`, trailerAssetUpdate);

                // Update the local state immediately after successful API calls
                setAssignedTruck(truckAssetUpdate);
                setAssignedTrailer(trailerAssetUpdate);

                // Close the assigning assets section
                setIsAssigningAssets(false);
            } catch (error) {
                console.error("Error updating assets:", error);
                // Handle error as needed
            }
        } else {
            // Handle the case where both truck and trailer assets are not selected
            console.error("Both truck and trailer assets must be selected");
        }
    };


    const openDocumentModal = (documentUrl) => {
        setModalVisible(true);
        setSelectedDocumentUrl(documentUrl); // Update the selected document URL
    };

    const closeDocumentModal = () => {
        setModalVisible(false);
    };

    return (
        <div>
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="animate-slide-up font-roboto fixed top-[8%] left-[18%] right-0 bg-white z-50 bg-[rgba(0, 0, 0, 0.5)] w-[70%] p-4 overflow-x-hidden overflow-y-auto h-[80%] drop-shadow rounded-3xl">
                <div className="flex w-full h-[5vh]">
                    <div className="flex items-center w-[96%] mt-[0.5%]">
                        <PiNotebookFill className="text-[2.8em] ml-[1%] mr-[1%] xl:max-2xl:text-[2em]" />
                        <div>
                            <h1 className="font-bold text-[1.5em] xl:max-2xl:text-[1.2em]">
                                Booking Details
                            </h1>
                            <p className="mt-[-1%] text-[1.2em] xl:max-2xl:text-[0.9em]">
                                Viewing ID: {booking.booking_id}
                            </p>
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

                {(dataFetched && !loading) ? (
                    <div>
                        <h1 className="font-bold uppercase text-[1.5em] ml-[2%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                            General Booking Information
                        </h1>
                        <h1 className="font-bold uppercase text-[1.5em] ml-[18%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                            Assigned Assets Information
                        </h1>
                        {(booking.status === 'Cancelled') || (booking.status == 'Completed') ? (
                            <></>
                        ) : (
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded ml-2 hover:bg-blue-700"
                                onClick={handleAssignAssets}
                            >
                                Assign Assets
                            </button>
                        )}

                        <div className="flex mx-[2%] text-[1.2em] xl:max-2xl:text-[0.8em]">
                            <div className="w-[25%]">
                                <p className="my-[1%]">
                                    <span className="font-bold">From: </span>
                                    {containerDetails.pickup_location}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">To: </span>
                                    {booking.delivery_address}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Est. Finish Date: </span>
                                    {booking.est_finish_date}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Status: </span>
                                    {booking.status}
                                </p>
                            </div>
                            <div className="w-[25%]">
                                <p className="my-[1%]">
                                    <span className="font-bold">Date Booked: </span>
                                    {bookDate}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Client Name: </span>
                                    {clientDetails.client_name}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Email: </span>
                                    {userDetails && userDetails.length > 0 && userDetails[0].email_address}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Contact Number: </span>
                                    {clientDetails.contact_number}
                                </p>
                            </div>

                            {!isAssigningAssets && booking.status !== 'Cancelled' && booking.status !== 'Completed' ? (
                                <>
                                    <div className="w-[25%] ml-[3%]">
                                        <p className="my-[1%]">
                                            <span className="font-bold">Truck Brand: </span>
                                            {assignedTruck.asset_name}
                                        </p>
                                        <p className="my-[1%]">
                                            <span className="font-bold">Truck Type: </span>
                                            {assignedTruck.type}
                                        </p>
                                        <p className="my-[1%]">
                                            <span className="font-bold">Plate #: </span>
                                            {assignedTruck.plate_number}
                                        </p>
                                    </div>

                                    <div className="w-[25%]">
                                        <p className="my-[1%]">
                                            <span className="font-bold">Trailer Type: </span>
                                            {assignedTrailer.type}
                                        </p>
                                        <p className="my-[1%]">
                                            <span className="font-bold">Measurements: </span>
                                            {assignedTrailer.measurements}
                                        </p>
                                        <p className="my-[1%]">
                                            <span className="font-bold">Plate #: </span>
                                            {assignedTrailer.plate_number}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="w-[50%] mx-auto mt-4 text-center">
                                    <p className={`text-lg font-semibold ${booking.status === 'Cancelled' ? 'text-red-500' : 'text-green-500'}`}>
                                        {booking.status === 'Cancelled' ? 'Booking Cancelled. Unable to assign assets.' :  booking.status === 'Completed' ? 'Booking Completed. Unable to assign assets.' : ' ' }
                                    </p>
                                </div>
                            )}

                            {/* Assign Assets Section */}
                            {isAssigningAssets && booking.status !== 'Cancelled' && (
                                <div className="mt-4 mr-[20%] w-[50%]">
                                    <div className="flex">
                                        <div className="mb-2 w-[50%] pr-2">
                                            <label className="block text-[1.2em] mb-2">Select Truck Asset:</label>
                                            <select
                                                className="w-full border border-gray-400 p-2 rounded"
                                                onChange={(e) => setSelectedTruckAsset(JSON.parse(e.target.value))}
                                            >
                                                <option value="">Select Truck Asset</option>
                                                {truckAssets.map((asset) => (
                                                    <option key={asset.asset_id} value={JSON.stringify(asset)}>
                                                        {asset.asset_name} - {asset.plate_number}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-2 w-[50%] pl-2">
                                            <label className="block text-[1.2em] mb-2">Select Trailer Asset:</label>
                                            <select
                                                className="w-full border border-gray-400 p-2 rounded"
                                                onChange={(e) => setSelectedTrailerAsset(JSON.parse(e.target.value))}
                                            >
                                                <option value="">Select Trailer Asset</option>
                                                {trailerAssets.map((asset) => (
                                                    <option key={asset.asset_id} value={JSON.stringify(asset)}>
                                                        {asset.type} - {asset.plate_number}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex mt-4 items-start ml-auto justify-end">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                            onClick={handleSetAssets}
                                        >
                                            Set Assets
                                        </button>
                                        <button
                                            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                                            onClick={() => setIsAssigningAssets(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                        <h1 className="font-bold uppercase text-[1.5em] ml-[2%] bg-[#003249] inline-block px-[1%] mt-[2%] text-white rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                            Container and Item Information
                        </h1>
                        <div className="flex mx-[2%] text-[1.2em] xl:max-2xl:text-[0.8em]">
                            <div className="w-[33%]">
                                <p className="my-[1%]">
                                    <span className="font-bold">Container Type: </span>
                                    {containerDetails.container_type}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Container Quantity: </span>
                                    {containerDetails.quantity}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Container Weight: </span>
                                    {containerDetails.weight}
                                </p>
                            </div>

                            <div className="w-[33%]">
                                <p className="my-[1%]">
                                    <span className="font-bold">Item Name: </span>
                                    {containerDetails.item_name}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Item Type: </span>
                                    {containerDetails.item_type}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Item Quantity: </span>
                                    {containerDetails.item_quantity}
                                </p>
                                <p className="my-[1%]">
                                    <span className="font-bold">Item weight: </span>
                                    {containerDetails.item_weight}
                                </p>
                            </div>
                        </div>

                        <h1 className="font-bold uppercase text-[1.5em] ml-[2%] bg-[#003249] inline-block px-[1%] mt-[2%] text-white text-center rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                            Submitted Documents
                        </h1>
                        <div className="flex mx-[2%] text-[1.2em] xl:max-2xl:text-[0.6em] w-full">
                            <div>
                                <h1 className="italic text-[1.6em]">Pullout Documents:</h1>
                            </div>
                            <button className="bg-blue-500 text-white px-2 py-1 rounded ml-2 hover:bg-blue-700"
                                onClick={() => openDocumentModal(pulloutDocUrl)}>
                                View
                            </button>
                        </div>
                        <div className="flex my-[1%] mx-[2%] text-[1.2em] xl:max-2xl:text-[0.6em] w-full">
                            <div>
                                <h1 className="italic text-[1.6em]">PROOF OF COMPLETION (EIR):</h1>
                            </div>
                            <button className="bg-blue-500 text-white px-2 py-1 rounded ml-2 hover:bg-blue-700"
                                onClick={() => openDocumentModal(eirDocUrl)}>
                                View
                            </button>
                        </div>
                    </div>
                ) : (
                    <LoadingViewBookingModal />
                )}
                <div className="fixed bottom-[2%] ml-[-1%] w-[100%]">
                    <hr className=" w-[100%] h-[1px] bg-black border-0" />
                </div>

            </div>

            {/* Document Modal */}
            {modalVisible && (
                <DocumentModal
                    documentUrl={selectedDocumentUrl}  // Use the selected document URL
                    altText="Document"
                    onClose={closeDocumentModal}
                />
            )}
        </div>
    );
};

export default ViewBookingModal;
