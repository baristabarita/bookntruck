import React, { useState } from "react";
import axios from 'axios';
import config from '../../../common/config'
import { BiX } from "react-icons/bi";
import { AiOutlineAppstoreAdd, AiFillCloseCircle, AiFillSave } from "react-icons/ai";

const AddAssetModal = ({ isOpen, onClose }) => {
    const truckerID = Number(localStorage.getItem('trkr_id'));
    console.log("Adding ID: ", truckerID);
    const [selectedCategory, setSelectedCategory] = useState("Truck"); // Default category
    const [formData, setFormData] = useState({
        asset_name: "",
        brand: "",
        type: "",
        plateNumber: "",
        measurements: "",
        weight: "",
    });

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddAsset = async () => {
        try {
          const response = await axios.post(`${config.API}/asset/create`, {
            asset_category: selectedCategory,
            asset_name: formData.name || '',
            brand: formData.brand || '',
            type: formData.type,
            measurements: formData.measurements || '',
            weight: formData.weight || '',
            plate_number: formData.plateNumber,
            trucker_id: truckerID, // Replace this with the actual trucker ID from your authentication or context
            booking_id: null, // If applicable, provide the booking ID, otherwise set it to null
          });
    
          // Handle the response accordingly, for example, show a success message
          console.log("Asset added successfully:", response.data);
          window.location.reload();
          
          // Reset form data after adding asset
          setFormData({
            asset_name: "",
            brand: "",
            type: "",
            plateNumber: "",
            measurements: "",
            weight: "",
          });
          
          onClose(); // Close the modal after adding asset
        } catch (error) {
          // Handle error, for example, show an error message
          console.error("Error adding asset:", error);
        }
      };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? "" : "hidden"}`}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        
                <div className="animate-slide-up bg-white z-50 w-[40%] p-4 overflow-x-hidden overflow-y-auto h-[40%] rounded-3xl">
                <div className="flex w-[95%] h-[5vh]">
                    <div className="flex items-center w-[96%] mt-[0.5%]">
                        <div className="flex items-center w-[100%] ml-[1%]">
                            <AiOutlineAppstoreAdd className="mr-[1%] text-[2em] xl:max-2xl:text-[1.3em]" />
                            <h1 className="font-bold text-[1.5em] xl:max-2xl:text-[1.2em]">
                                Add an Asset
                            </h1>
                        </div>
                    </div>
                    <div className="mt-[0.5%]">
                    <AiFillCloseCircle
                        className="text-[2.5em] hover:cursor-pointer xl:max-2xl:text-[1.8em]"
                        onClick={onClose} // Close the modal on click
                    />
                    </div>
                </div>
                <hr className="h-[2px] w-full my-[1.2%] bg-gray-200 border-0" />
                {/* Inputs Here */}

                <div className="flex items-center w-full">
                    <h1 className="font-bold uppercase text-[1.5em] ml-[4%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                        Select a Category:
                    </h1>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="border border-gray-500 w-[50%] ml-2 pl-[1%] rounded-md text-[0.9em]"
                    >
                        <option value="Truck">Truck</option>
                        <option value="Trailer">Trailer</option>
                    </select>
                </div>

                {/* input fields based on selectedCategory */}
                {selectedCategory === "Truck" ? (
                    <div className="flex ml-[4%] mr-[2%] text-[1.2em] w-full xl:max-2xl:text-[0.8em]">
                        <div className="w-[50%]">
                            <div className="mb-[2.5%]">
                                <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                    Enter Truck Name
                                </p>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Truck Name"
                                    className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                />
                            </div>
                            <div className="mb-[2.5%]">
                                <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                    Enter Truck Brand
                                </p>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    placeholder="Truck Brand"
                                    className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                />
                            </div>
                        </div>
                        <div className="w-[50%]">
                            <div className="mb-[2.5%]">
                                <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                    Enter Truck Type
                                </p>
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    placeholder="Truck Type"
                                    className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                />
                            </div>
                            <div className="mb-[2.5%]">
                                <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                    Enter Truck Plate Number
                                </p>
                                <input
                                    type="text"
                                    name="plateNumber"
                                    value={formData.plateNumber}
                                    onChange={handleInputChange}
                                    placeholder="Plate Number"
                                    className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex ml-[4%] mr-[2%] text-[1.2em] w-full xl:max-2xl:text-[0.8em]">
                        <div className="w-[50%]">
                            <div className="mb-[2.5%]">
                                <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                    Enter Trailer Type
                                </p>
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    placeholder="Trailer Type"
                                    className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                />
                            </div>
                            <div className="mb-[2.5%]">
                                <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                    Enter Trailer Measurements
                                </p>
                                <input
                                    type="text"
                                    name="measurements"
                                    value={formData.measurements}
                                    onChange={handleInputChange}
                                    placeholder="Measurements"
                                    className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                />
                            </div>
                        </div>
                        <div className="w-[50%]">
                            <div className="mb-[2.5%]">
                                <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                    Enter Trailer Weight
                                </p>
                                <input
                                    type="text"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    placeholder="Weight"
                                    className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]" 
                                />
                            </div>
                            <div className="mb-[2.5%]">
                                <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                    Enter Trailer Plate Number
                                </p>
                                <input
                                    type="text"
                                    name="plateNumber"
                                    value={formData.plateNumber}
                                    onChange={handleInputChange}
                                    placeholder="Plate Number"
                                    className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div className="relative bottom-[2%] top-[5%] mb-[2%] w-[100%]">
                    <hr className=" w-[99%] h-[1px] bg-black border-0" />
                    <div className="flex justify-end mr-[3%] mt-[1%]">
                        <button
                            className="flex text-white text-[1.1em] bg-[#17A200] px-[2%] py-[0.5%] rounded-2xl xl:max-2xl:text-[0.8em] hover:bg-[#117600]"
                            onClick={handleAddAsset}
                        >
                            <AiFillSave className="my-[2%]  text-[1.2em] mr-[1%]" />
                            Save 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAssetModal;
