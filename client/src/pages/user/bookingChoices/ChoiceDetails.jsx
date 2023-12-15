import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../common/config';
import Rating from '@mui/material/Rating';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FaUser, FaPhone, FaEnvelope, FaMapMarker } from 'react-icons/fa';
import { FiX } from "react-icons/fi";
import bookingchoiceimg from '../../../assets/bookingchoices-section-2.png'
import AssetCard from '../../../components/card/AssetCard.jsx';
import truckicon from '../../../assets/truckasseticon.png'
import trailericon from '../../../assets/trailerasseticon.png'
import LoadingBar from '../../../components/loaders/LoadingBar.jsx';

const ChoiceDetails = () => {
  const navigate = useNavigate();
  const [businessDetails, setBusinessDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [assets, setAssets] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const storedAcc = localStorage.getItem('clientDetails');
  const parsedAcc = JSON.parse(storedAcc);
  const selectedTrucker = JSON.parse(localStorage.getItem('selectedTrucker'));
  const [showAlert, setShowAlert] = useState(false);
  console.log("Current User: ", storedAcc);
  console.log("ID OF STORED ACC: ", storedAcc);

  useEffect(() => {
    // Retrieve selected trucker data from localStorage
    console.log(selectedTrucker?.trucker_id);
    // Check if selected trucker data exists
    if (selectedTrucker && selectedTrucker.user_id && selectedTrucker.trucker_id) {
      setBusinessDetails(selectedTrucker);
      // Fetch assets using selectedTrucker.trucker_id
      fetchUserDetails(selectedTrucker.user_id);
      fetchAssets(selectedTrucker.trucker_id); // Pass trucker_id as a parameter
    } else {
      // Handle case when selected trucker data is not found
      console.error('Selected trucker data not found');
    }
  }, []);

  useEffect(() => {
    axios.get(`${config.API}/review/retrieve_avg?trucker_id=${selectedTrucker.trucker_id}`)
      .then((res) => {
        setAverageRating(res.data.average);
      })
      .catch((error) => {
        console.error('Error fetchign average rating: ', error);
      });
  }, [selectedTrucker.trucker_id]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`${config.API}/user/retrieve`, {
        params: {
          col: 'user_id',
          val: userId,
        },
      });
      console.log("Fetch User Details Reponse: ", response.data.records);
      setUserDetails(response.data.records);
    } catch {
      console.error('Error fetching user details: ', error);
    }
  }

  const fetchAssets = async (truckerId) => {
    try {
      const response = await axios.get(`${config.API}/asset/retrieve`, {
        params: {
          col: 'trucker_id',
          val: truckerId, // Use truckerId from the function parameter
        },
      });
      console.log("Fetch Assets Response: ", response.data.data);
      setAssets(response.data.data); // Set assets in the state
    } catch (error) {
      console.error('Error fetching assets:', error);
      setAssets([]); // Set assets as an empty array in case of an error
    }
  };


  return (
    <div className="animate-fade-in font-poppings bg-white text-darkblue" >
      {/* Back to Bookings Page */}
      <div className="mt-[1em] text-[#003249] ml-[2%]">
        <h3
          className="py-[1%] font-bold flex items-center xl:max-2xl:text-[1.2em] xl:max-2xl:py-[0.5%]"
          onClick={() => {
            navigate('/bookingchoices');
          }}
        >
          <AiOutlineArrowLeft className="text-black mr-[1%] hover:text-[#007EA7]" />
          Back to Bookings Page
        </h3>
      </div>
      {(!businessDetails) && (
        <div><LoadingBar /></div>
      ) || ( 
          <div className="bg-white h-[100%] px-7 py-3" style={{ backgroundImage: `url(${bookingchoiceimg})` }}>
            {/* View your Selection */}
            <h1 className="font-bold text-2xl">View your Selection</h1>
            {/* Main Section */}
            <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
              {/* Business Details */}
              <div className="bg-white col-span-2 md:col-span-2 border rounded p-4 shadow-lg drop-shadow-xl">
                {/* Business Logo and Name */}
                <div className="flex items-center mb-4">
                  <img src={businessDetails.logo} alt="Business Logo" className="w-[40%] h-auto mr-4" />
                  <div>
                    <h1 className="text-[2em] font-bold mb-1">{businessDetails.business_name}</h1>
                    <div className="flex items-center mb-2">
                      <FaUser className="mr-2" /> {businessDetails.trucker_name}
                    </div>
                    <div className="flex items-center mb-2">
                      <FaPhone className="mr-2" /> {businessDetails.contact_number}
                    </div>
                    <div className="flex items-center mb-2">
                      <FaEnvelope className="mr-2" /> {userDetails && userDetails.length > 0 && userDetails[0].email_address}
                    </div>
                    <div className="flex items-center mb-2">
                      <FaMapMarker className="mr-2" /> {businessDetails.address}
                    </div>
                  </div>
                </div>

                {/* Divider Line */}
                <hr className="my-4 border-gray-400" />

                {/* Star Ratings */}
                <div className="flex items-center">
                  {/* Use the appropriate field from businessDetails object for rating */}
                  <div className="bg-blue-500 text-white font-bold rounded-md ml-2 p-2">
                    {/*businessDetails.rating.toFixed(1)*/}
                    {Math.round(averageRating)}
                  </div>
                  <div className="ml-4">
                    <div className="text-left">Review Score</div>
                    <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                  </div>
                </div>
              </div>

              {/* Service Charges Breakdown */}
              <div className="bg-white md:col-span-1 border rounded p-4 shadow-lg drop-shadow-xl flex flex-col h-auto">
                <h2 className="font-bold text-2xl mb-4">Charges Range</h2>

                {/* Divider Line */}
                <hr className="my-4 border-gray-400" />

                {/* Service Price */}
                <div className="flex justify-between mb-4">
                  <div>Price for Service</div>
                  <div>₱ {businessDetails.servCharge}</div>
                </div>
                <div className="flex justify-between mb-4">
                  <div>Price per Container</div>
                  <div>₱ {businessDetails.contrCharge}</div>
                </div>
                <hr className="my-4 border-gray-400" />

                {/* Book Services Button */}
                <button
                  className="bg-[#007EA7] hover:bg-[#011627] font-medium text-white rounded-md p-2 self-start ml-auto shadow-lg drop-shadow-md"
                  onClick={() => {
                    if (storedAcc != null) {
                      navigate('/bookingchoices/book');
                    } else {
                      setShowAlert(true);
                    }
                  }}
                >
                  Book Services
                </button>

              </div>
            </div>

            {/* Assets Section */}
            <hr className="my-4 border-gray-400" />
            <h2 className="font-bold text-4xl mt-7 text-center">Current Business Assets</h2>

            <div className="flex gap-4 mt-4">
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center">

                <div className="flex flex-col items-center mb-4">
                  <img src={truckicon} alt="Truck Icon" className="w-50 h-50 mb-2" />
                  <h2 className="font-bold text-2xl">Truck Assets</h2>
                </div>

                <div className="flex gap-4">
                  {assets
                    .filter((asset) => asset.asset_category === "Truck")
                    .map((asset) => (
                      <AssetCard key={asset.asset_id} asset={asset} />
                    ))}
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-center items-center">

                <div className="flex flex-col items-center mb-4">
                  <img src={trailericon} alt="Trailer Icon" className="w-50 h-50 mr-4" />
                  <h2 className="font-bold text-2xl">Trailer Assets</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {assets
                    .filter((asset) => asset.asset_category === "Trailer")
                    .map((asset) => (
                      <AssetCard key={asset.asset_id} asset={asset} />
                    ))}
                </div>
              </div>
            </div>

          </div>
        )}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black backdrop-blur">
          <div className="bg-white p-6 rounded-md shadow-md flex flex-col items-end">
            <button
              onClick={() => setShowAlert(false)}
              className="self-end mb-4"
            >
              <FiX className="text-black hover:text-[#2d7df6]" />
            </button>
            <p className="text-lg font-semibold">
              Unable to book services. Please login to your account!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoiceDetails;
