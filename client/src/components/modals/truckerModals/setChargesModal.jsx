import React, { useEffect, useState } from "react";
import axios from 'axios';
import config from '../../../common/config';
import { AiOutlineAppstoreAdd, AiFillCloseCircle, AiFillSave } from "react-icons/ai";

const SetChargesModal = ({ isOpen, onClose }) => {
    const truckerID = Number(localStorage.getItem("trkr_id"));
    const [chargesData, setChargesData] = useState({
      serviceCharge: "",
      distanceCharge: "",
      containerCharge: "",
    });
    const [existingCharges, setExistingCharges] = useState({});
  
    useEffect(() => {
      if (isOpen) {
        axios
          .get(`${config.API}/trucker/retrieve`, {
            params: { col: "trucker_id", val: truckerID },
          })
          .then((response) => {
            setExistingCharges(response.data.trucker[0]);
          })
          .catch((error) => {
            console.error("Error fetching existing charges:", error);
          });
      }
    }, [isOpen, truckerID]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setChargesData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleCharges = () => {
      axios
        .post(`${config.API}/trucker/update?truckerID=${truckerID}`, {
          trucker: {
            servCharge: chargesData.serviceCharge,
            distCharge: chargesData.distanceCharge,
            contrCharge: chargesData.containerCharge,
          },
        })
        .then((response) => {
          // Handle success, e.g., show a success message to the user
          console.log("Charges updated successfully:", response.data);
        })
        .catch((error) => {
          // Handle error, e.g., show an error message to the user
          console.error("Error updating charges:", error);
        });
  
      onClose(); // Close the modal after updating charges
    };
  
    useEffect(() => {
      if (existingCharges) {
        setChargesData({
          serviceCharge: existingCharges.servCharge || "",
          distanceCharge: existingCharges.distCharge || "",
          containerCharge: existingCharges.contrCharge || "",
        });
      }
    }, [existingCharges]);

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? "" : "hidden"}`}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>

            <div className="animate-slide-up bg-white z-50 w-[40%] p-4 overflow-x-hidden overflow-y-auto h-[40%] rounded-3xl">
                <div className="flex w-[95%] h-[5vh]">
                    <div className="flex items-center w-[96%] mt-[0.5%]">
                        <div className="flex items-center w-[100%] ml-[1%]">
                            <AiOutlineAppstoreAdd className="mr-[1%] text-[2em] xl:max-2xl:text-[1.3em]" />
                            <h1 className="font-bold text-[1.5em] xl:max-2xl:text-[1.2em]">
                                Set Your Charges
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
                        Booking Charges:
                    </h1>
                </div>

                {/* input fields based on selectedCategory */}

                <div className="flex ml-[4%] mr-[2%] text-[1.2em] w-full xl:max-2xl:text-[0.8em]">
                    <div className="w-[50%]">
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                Set Service Charge
                            </p>
                            <input
                                type="text"
                                name="serviceCharge"
                                value={chargesData.serviceCharge}
                                onChange={handleInputChange}
                                placeholder="Service Charge"
                                className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                            />
                        </div>
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                Set Distance Charge
                            </p>
                            <input
                                type="text"
                                name="distanceCharge"
                                value={chargesData.distanceCharge}
                                onChange={handleInputChange}
                                placeholder="Distance Charge"
                                className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                            />
                        </div>
                    </div>
                    <div className="w-[50%]">
                        <div className="mb-[2.5%]">
                            <p className="mt-[1.5%] mb-[0.3%] mr-[1%] font-semibold">
                                Set Container Charge
                            </p>
                            <input
                                type="text"
                                name="containerCharge"
                                value={chargesData.containerCharge}
                                onChange={handleInputChange}
                                placeholder="Container Charge"
                                className="input-field border border-gray-500 w-[70%] pl-[1%] rounded-lg text-[0.9em]"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative bottom-[2%] top-[5%] mb-[2%] w-[100%]">
                    <hr className=" w-[99%] h-[1px] bg-black border-0" />
                    <div className="flex justify-end mr-[3%] mt-[1%]">
                        <button
                            className="flex text-white text-[1.1em] bg-[#17A200] px-[2%] py-[0.5%] rounded-2xl xl:max-2xl:text-[0.8em] hover:bg-[#117600]"
                            onClick={handleCharges}
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

export default SetChargesModal;
