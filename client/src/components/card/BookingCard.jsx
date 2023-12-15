import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import config from '../../common/config'
import { GiEmptyHourglass } from "react-icons/gi";
import { FaFile, FaCalendar, FaTruck, FaCheckCircle, FaTimesCircle} from "react-icons/fa";


const BookingCard = ({ status, bookingId, businessName, deliveryAddress, estFinishDate, handleDetailsClick }) => {
    const navigate = useNavigate();
    
    const getStatusIcon = () => {
        switch (status) {
            case "Pending":
                return <GiEmptyHourglass size={100} />;
            case "Pullout Docs Required":
                return <FaFile size={100} />;
            case "Reserved":
                return <FaCalendar size={100} />;
            case "Ongoing":
                return <FaTruck size={100} />;
            case "Completed":
                return <FaCheckCircle size={100} />;
            default:
                return <FaTimesCircle size={100} />;
        }
    };

    const getStatusTextColor = () => {
        switch (status) {
            case "Pending":
                return "bg-red-500";
            case "Pullout Docs Required":
                return "bg-orange-500";
            case "Reserved":
                return "bg-yellow-500";
            case "Ongoing":
                return "bg-blue-500";
            case "Completed":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    const handleViewDetailsClick = () => {
        handleDetailsClick({ bookingId, businessName, deliveryAddress, estFinishDate });
    };

    return (
        <div className="bg-white rounded-lg border p-4 mb-4 w-[100%] flex flex-col shadow-lg drop-shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="mr-4">{getStatusIcon()}</div>
              <div>
                <div className="flex items-center">
                  <h2 className="font-bold">{bookingId}</h2>
                </div>

                <div className="flex items-center">
                  <h2 className="font-bold text-[0.5 em] mr-2">Booking Status:</h2>
                  <h2
                    className={`font-bold text-[0.8em] text-white px-2 py-1 rounded ${getStatusTextColor()}`}
                  >
                    {status}
                  </h2>
                </div>
                <div>
                  <p>{businessName}</p>
                </div>
                <div>
                  <p className="max-w-[60%]">{deliveryAddress}</p>
                </div>
                <div>
                  <p>{estFinishDate}</p>
                </div>

              </div>
            </div>
            <button
              className="bg-[#007EA7] hover:bg-[#011627] text-white px-2 py-1 ml-4 rounded self-start"
              onClick={handleViewDetailsClick}
            >
              View Details
            </button>
          </div>
        </div>
      );
};

export default BookingCard;
