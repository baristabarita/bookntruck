import React, { useState, useEffect } from "react";
import config from '../../../common/config';
import axios from 'axios';
import { BiSolidTruck, BiSolidAddToQueue } from "react-icons/bi";
import AddAssetModal from "../../../components/modals/truckerModals/addAssetModal.jsx";
import EditTruckModal from "../../../components/modals/truckerModals/editTruckModal.jsx";
import EditTrailerModal from "../../../components/modals/truckerModals/editTrailerModal.jsx";
import DeleteAssetModal from "../../../components/modals/truckerModals/assetDeleteModal.jsx";

const AssetList = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditTruckModalOpen, setEditTruckModalOpen] = useState(false);
  const [isEditTrailerModalOpen, setEditTrailerModalOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [truckAssets, setTruckAssets] = useState([]);
  const [trailerAssets, setTrailerAssets] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  const truckerID = Number(localStorage.getItem('trkr_id'));
  console.log('ID:', truckerID);

  useEffect(() => {
    // Function to fetch truck assets
    const fetchTruckAssets = async () => {
      try {
        const response = await axios.get(
          `${config.API}/asset/retrieveparams?col1=trucker_id&val1=${truckerID}&col2=asset_category&val2=Truck`
        );
        setTruckAssets(response.data.data);
      } catch (error) {
        console.error('Error fetching truck assets: ', error);
      }
    };

    // Function to fetch trailer assets
    const fetchTrailerAssets = async () => {
      try {
        const response = await axios.get(
          `${config.API}/asset/retrieveparams?col1=trucker_id&val1=${truckerID}&col2=asset_category&val2=Trailer`
        );
        setTrailerAssets(response.data.data);
      } catch (error) {
        console.error('Error fetching trailer assets: ', error);
      }
    };

    fetchTruckAssets();
    fetchTrailerAssets();
  }, []);



  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditTruckModalOpen = (truck) => {
    setSelectedTruck(truck);
    setEditTruckModalOpen(true);
  };

  const handleEditTrailerModalOpen = (trailer) => {
    setSelectedTrailer(trailer);
    setEditTrailerModalOpen(true);
  };
  const handleEditTruckModalSave = async (updatedData) => {
    try {
      // Send an API request to update the truck asset
      await axios.post(`${config.API}/asset/update`, updatedData);
      // Update the truckAssets state with the updated data
      setTruckAssets(prevState =>
        prevState.map(truck =>
          truck.asset_id === updatedData.asset_id ? updatedData : truck
        )
      );
      // Close the modal after updating
      setEditTruckModalOpen(false);
    } catch (error) {
      console.error('Error updating truck asset:', error);
    }
  };

  const handleEditTrailerModalSave = (updatedData) => {
    // Implement logic to save edited data
    console.log("Saving edited trailer data: ", updatedData);

    // Update trailerAssets state with the edited data
    setTrailerAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.asset_id === updatedData.asset_id ? updatedData : asset
      )
    );

    // Close the modal after saving
    setEditTrailerModalOpen(false);
  };

  const handleDeleteAsset = (assetId) => {
    setDeleteModalOpen(true);
    setSelectedAssetId(assetId);
  };

  // Functions for delete modal actions
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedAssetId(null);
  };

  const handleDeleteModalDelete = async () => {
    try {
      // Call the API to delete the asset
      await axios.post(`${config.API}/asset/set_invisible`, { asset_id: selectedAssetId });

      // Update the state or perform other actions as needed
      setTruckAssets((prevAssets) => prevAssets.filter((asset) => asset.asset_id !== selectedAssetId));
      setTrailerAssets((prevAssets) => prevAssets.filter((asset) => asset.asset_id !== selectedAssetId));

      // Provide user feedback, e.g., a toast notification
      alert("Asset Deletion Complete");
      window.location.reload();
    } catch (error) {
      // Handle API request errors
      console.error("Error deleting asset:", error);
    }

    // Close the modal
    setDeleteModalOpen(false);
    setSelectedAssetId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="my-4 mx-8 flex  font-bold items-center">
        <p className="flex text-[2em]">
          <BiSolidTruck className="mr-2" /> Assets Overview
        </p>
        <button
          className="flex ml-auto items-center bg-[#132c47] text-white font-bold px-4 py-3 rounded"
          onClick={handleAddModalOpen}
        >
          <BiSolidAddToQueue className="mt-[5%] mr-2" /> Add Asset
        </button>
      </div>
      <div className="h-[82.5vh] overflow-y-auto" >
        <div className="font-roboto mx-[3%] mt-[1%] mb-[1%]">
          <div className="px-[1%] bg-white rounded-lg drop-shadow-lg shadow-lgopacity-1">
            <div className="flex justify-between p-3 border-b-[1px] border-slate-500">
              <p className="flex font-bold text-[1.5em] xl:max-2xl:text-[1.2em] py-3">
                Truck Units
                <br />
              </p>
            </div>
            <table className="w-[100%] mt-[0.8%]">
              <thead className="text-[1.2em] xl:max-2xl:text-[0.9em]">
                <tr>
                  <th className="py-[0.7%]">Truck ID</th>
                  <th>Truck Name</th>
                  <th>Brand</th>
                  <th>Type</th>
                  <th>Plate Number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
                <tr>
                  <th
                    colSpan={7}
                    className="border-b-[1px] border-slate-500"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {truckAssets.filter(truck => truck.is_visible === 1).length > 0 ? (
                  truckAssets.filter(truck => truck.is_visible === 1).map((truck) => (
                    <tr
                      key={truck.asset_id}
                      className="text-center xl:max-2xl:text-[0.8em]"
                    >
                      <td className="py-[1%]">{truck.asset_id}</td>
                      <td>{truck.asset_name}</td>
                      <td>{truck.brand}</td>
                      <td>{truck.type}</td>
                      <td>{truck.plate_number}</td>
                      <td className="flex justify-center">
                        <p
                          className={`font-bold rounded-full mt-1 py-[2%] w-[60%] xl:max-2xl:text-[0.9em] 
                       ${truck.status == "Idle"
                              ? "bg-[#f6e8b3] text-[#574916]"
                              : "bg-[#93c3a0] text-[#14381f]"
                            }`}
                        >
                          {truck.status}
                        </p>
                      </td>
                      <td className="py-2 px-4">
                        {/* Buttons for Edit and Delete actions */}
                        <button
                          className="bg-[#3096e4] text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleEditTruckModalOpen(truck)}
                        >
                          Edit
                        </button>
                        <button className="bg-[#da3939] text-white px-2 py-1 rounded"
                          onClick={() => handleDeleteAsset(truck.asset_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))) : (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-500 py-4">No truck assets</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="font-roboto mx-[3%] mt-[1%] mb-[1%]">
          <div className="px-[1%] bg-white rounded-lg drop-shadow-lg shadow-lg opacity-1">
            <div className="flex justify-between p-3 text-left border-b-[1px] border-slate-500">
              <p className="flex font-bold text-[1.5em] xl:max-2xl:text-[1.2em] py-3">
                Trailer Units
                <br />
              </p>
            </div>
            <table className="w-[100%] mt-[0.8%]">
              <thead className="text-[1.2em] xl:max-2xl:text-[0.9em]">
                <tr>
                  <th className="py-[0.7%]">Trailer ID</th>
                  <th>Trailer Type</th>
                  <th>Measurements</th>
                  <th>Weight</th>
                  <th>Plate Number</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
                <tr>
                  <th
                    colSpan={7}
                    className="border-b-[1px] border-slate-500"
                  ></th>
                </tr>
              </thead>


              <tbody>
                {trailerAssets.length > 0 ? (
                  trailerAssets.map((trailer) => (
                    <tr
                      key={trailer.asset_id}
                      className="text-center xl:max-2xl:text-[0.8em]"
                    >
                      <td className="py-[1%]">{trailer.asset_id}</td>
                      <td>{trailer.type}</td>
                      <td>{trailer.measurements}</td>
                      <td>{trailer.weight}</td>
                      <td>{trailer.plate_number}</td>
                      <td className="flex justify-center">
                        <p
                          className={`font-bold rounded-full mt-1 py-[2%] w-[60%] xl:max-2xl:text-[0.9em] 
                       ${trailer.status == "Idle"
                              ? "bg-[#f6e8b3] text-[#574916]"
                              : "bg-[#93c3a0] text-[#14381f]"
                            }`}
                        >
                          {trailer.status}
                        </p>
                      </td>
                      <td className="py-2 px-4">
                        {/* Buttons for Edit and Delete actions */}
                        <button className="bg-[#3096e4] text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleEditTrailerModalOpen(trailer)}>
                          Edit
                        </button>
                        <button className="bg-[#da3939] text-white px-2 py-1 rounded"
                          onClick={() => handleDeleteAsset(trailer.asset_id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))) : (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-500 py-4">No trailer assets</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddAssetModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
      {isEditTruckModalOpen && (
        <EditTruckModal
          truck={selectedTruck}
          onSave={handleEditTruckModalSave}
          onClose={() => setEditTruckModalOpen(false)}
        />
      )}
      {isEditTrailerModalOpen && (
        <EditTrailerModal
          trailer={selectedTrailer}
          onSave={handleEditTrailerModalSave}
          onClose={() => setEditTrailerModalOpen(false)}
        />
      )}
      {/* Add the DeleteAssetModal component */}
      <DeleteAssetModal
        isOpen={isDeleteModalOpen}
        onDelete={handleDeleteModalDelete}
        onClose={handleDeleteModalClose}
        assetId={selectedAssetId}
      />
    </div>
  );
};

export default AssetList;
