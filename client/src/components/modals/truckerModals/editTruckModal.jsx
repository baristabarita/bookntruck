import React, { useState } from "react";
import axios from 'axios';
import config from '../../../common/config'
import { AiFillSave, AiFillCloseCircle, AiFillEdit } from "react-icons/ai";

const EditTruckModal = ({ truck, onSave, onClose }) => {
    const [truckName, setTruckName] = useState(truck.asset_name);
    const [brand, setBrand] = useState(truck.brand);
    const [truckType, setTruckType] = useState(truck.type);
    const [plateNum, setPlateNum] = useState(truck.plate_number);
    const [status, setStatus] = useState(truck.status);

    const handleSave = async () => {
        try {
            const updatedData = {
                asset_id: truck.asset_id,
                asset_category: truck.asset_category,
                asset_name: truckName,
                brand: brand,
                type: truckType,
                plate_number: plateNum,
                status: status
            };
            console.log("Sending data to server:", updatedData); // Log the data being sent to the server
            await axios.post(`${config.API}/asset/update`, updatedData);
            onSave(updatedData); // Pass the updated data back to parent component
            onClose();
        } catch (error) {
            console.error('Error updating truck asset:', error);
        }
    };

    return (
        <div>
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="animate-slide-up font-roboto fixed top-[25%] left-[30%] right-0 bg-white z-50 bg-[rgba(0, 0, 0, 0.5)] w-[40%] p-4 overflow-x-hidden overflow-y-auto h-[50%] drop-shadow rounded-3xl">
                <div className="flex w-[95%] h-[5vh]">
                    <div className="flex items-center w-[96%] mt-[0.5%]">
                        <div className="flex items-center w-[100%] ml-[1%]">
                            <AiFillEdit className="mr-[1%] text-[2em] xl:max-2xl:text-[1.3em]" />
                            <h1 className="font-bold text-[1.5em] xl:max-2xl:text-[1.2em]">
                                Update Asset Details
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

                {/* Edit Inputs */}
                <div className="flex items-center w-full">
                    <h1 className="font-bold uppercase text-[1.5em] ml-[4%] bg-[#003249] inline-block text-white px-[1%] rounded-lg mb-[0.5%] xl:max-2xl:text-[1.0em]">
                        Details
                    </h1>
                </div>
                <div className="flex ml-[4%] mr-[2%] text-[1.2em] w-full xl:max-2xl:text-[0.8em]">
                    <div className="w-[50%]">
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Set Truck Status</p>
                            <select
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="status"
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                }}
                            >
                                <option value="Idle">Idle</option>
                                <option value="In-Use">In-Use</option>
                            </select>
                        </div>
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Set Truck Name</p>
                            <input
                                type="text"
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="truckName"
                                value={truckName}
                                onChange={(e) => setTruckName(e.target.value)}
                            />
                        </div>
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Set Truck Brand</p>
                            <input
                                type="text"
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-[50%]">
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Set Truck Type</p>
                            <input
                                type="text"
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="type"
                                value={truckType}
                                onChange={(e) => setTruckType(e.target.value)}
                            />
                        </div>
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">Set Plate Number</p>
                            <input
                                type="text"
                                className="border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                                name="plate_number"
                                value={plateNum}
                                onChange={(e) => setPlateNum(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative bottom-[2%] top-[2%] mb-[2%] w-[100%]">
                    <hr className=" w-[99%] h-[1px] bg-black border-0" />
                    <div className="flex justify-end mr-[3%] mt-[1%]">
                        <button
                            className="flex text-white text-[1.1em] bg-[#17A200] px-[2%] py-[0.5%] rounded-2xl xl:max-2xl:text-[0.8em] hover:bg-[#117600]"
                            onClick={handleSave}
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

export default EditTruckModal;
