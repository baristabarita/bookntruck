import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from '../../common/config';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import { FaMapMarker, FaTruck, FaEye, FaBook, FaTrailer, FaTruckMoving } from "react-icons/fa";

const TruckerCard = ({ business }) => {
  const { trucker_id, business_name, address, description, servCharge, logo } = business;
  const [truckCount, setTruckCount] = useState(0);
  const [trailerCount, setTrailerCount] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const navigate = useNavigate();
  const storedAcc = localStorage.getItem('clientDetails');

  useEffect(() => {
    axios.get(`${config.API}/review/retrieve_avg?trucker_id=${trucker_id}`)
      .then((res) => {
        setAverageRating(res.data.average);
      })
      .catch((error) => {
        console.error('Error fetchign average rating: ', error);
      });
  }, [trucker_id]);

  const fetchCounts = async () => {
    try {
      //Fetch truck Count
      const truckResponse = await axios.get(`${config.API}/asset/retrivecount_two?col1=trucker_id&val1=${trucker_id}&col2=asset_category&val2=Truck`)
      setTruckCount(truckResponse.data.totalCount);

      //fetch trailer count
      const trailerResponse = await axios.get(`${config.API}/asset/retrivecount_two?col1=trucker_id&val1=${trucker_id}&col2=asset_category&val2=Trailer`)
      setTrailerCount(trailerResponse.data.totalCount);

    } catch (error) {
      console.error("Error fetching counts: ", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchCounts();
    };
    fetchData();
  }, []);


  const handleViewMoreClick = () => {
    // Store selected trucker data in localStorage
    localStorage.setItem('selectedTrucker', JSON.stringify(business));
    navigate(`/bookingchoices/view/`);
  };
  const handleBookServClick = () => {
    // Navigate to ChoiceDetails page with the appropriate route path
    localStorage.setItem('selectedTrucker', JSON.stringify(business));
    navigate(`/bookingchoices/book`);
  };

  return (
    <div className=" animate-fade-in card bg-white shadow-lg p-4 m-2 rounded-lg grid grid-cols-4 gap-4 min-w-[80%] max-w-[80%]">
      {/* Logo Column */}
      <div className="md:col-span-1 col-span-4 mr-[2em]">
        {logo ? (
          <div className="rounded-lg overflow-hidden h-[15em] w-[15em] mr-2 mb-4 border border-darkblue">
            <img src={logo} alt="Business Logo" className="w-full h-full object-cover" />
          </div>
        ) : (
          <FaTruckMoving className="h-[15em] w-[15em] mr-2 mb-4 border border-darkblue text-gray-500" />
        )}
      </div>

      {/* Contents Column */}
      <div className="col-span-2 mr-[2em]">
        <h2 className="font-bold text-darkblue text-[2em] mb-1">{business_name}</h2>
        <div className="flex items-center my-2">
          <FaMapMarker className="text-darkblue" />
          <div className="text-darkblue mx-2">{address}</div>
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
          <div className="text-darkblue text-[0.8em]">{description}</div>
        </div>
      </div>

      {/* Rating, Price, and Buttons Column */}
      <div className="col-span-1 flex flex-col items-end">
        {/* Ratings section */}
        <div className="mb-[5em]">
          <div className="flex items-center">
            <div className="mr-4">
              <div className="text-right">Review Score</div>
              <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
            </div>
            <div className="bg-[#007EA7] text-white font-bold rounded-lg p-3">{Math.round(averageRating)}</div>
          </div>
        </div>

        {/* Price and Buttons Section */}
        <div className="text-black">Trucking Service Charge</div>
        {(servCharge === null) ? (
        <div className="text-black text-[1.5em] font-bold mb-2">₱ 00.00</div>
        ) : (
        <div className="text-black text-[1.5em] font-bold mb-2">₱ {servCharge}</div>
        )}
        <div className="flex space-x-2">
          <button
            className="bg-[#007EA7] font-medium text-white rounded-md p-2 flex items-center"
            onClick={handleViewMoreClick}
          >
            <FaEye className="mr-1" />
            View Trucking Service
          </button>
        </div>

      </div>
    </div>
  );
};

export default TruckerCard;
