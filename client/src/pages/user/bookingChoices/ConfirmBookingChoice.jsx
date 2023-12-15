import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaMapMarker, FaCheck, FaTimes } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import axios from 'axios';
import config from '../../../common/config';
import bookingchoiceimg from '../../../assets/bookingchoices-section-2.png'

const ConfirmBookingChoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [businessDetails, setBusinessDetails] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const storedAcc = JSON.parse(localStorage.getItem('clientDetails'));
  const selectedTrucker = JSON.parse(localStorage.getItem('selectedTrucker'));
  const storedFormData = JSON.parse(localStorage.getItem('formData'));

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        if (selectedTrucker && selectedTrucker.user_id && selectedTrucker.trucker_id) {
          setBusinessDetails(selectedTrucker);
          fetchUserDetails(selectedTrucker.user_id);
        }
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    };
    fetchBusinessDetails();
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


  const handleConfirmBooking = async () => {
    try {
      // Step 1: Create Container
      const containerResponse = await axios.post(`${config.API}/container/create`, {
        container_type: storedFormData.container_type,
        weight: storedFormData.weight,
        quantity: storedFormData.quantity,
        pickup_location: storedFormData.pickup_location,
        item_name: storedFormData.item_name,
        item_quantity: storedFormData.item_quantity,
        item_type: storedFormData.item_type,
        item_weight: storedFormData.item_weight,
      });

      if (!containerResponse.data.success) {
        throw new Error("Error creating container:", containerResponse.data.error);
      }

      const containerId = containerResponse.data.data.containerId;

      // Step 2: Create Payment
      const paymentResponse = await axios.post(`${config.API}/payment/create`, {
        service_charge: businessDetails.servCharge,
        distance_charge: businessDetails.distCharge,
        container_charge: storedFormData.quantity * businessDetails.contrCharge,
        total_balance: (storedFormData.quantity * businessDetails.contrCharge) + businessDetails.servCharge + businessDetails.distCharge,
      });

      if (!paymentResponse.data.success) {
        throw new Error("Error creating payment details:", paymentResponse.data.error);
      }

      const paymentId = paymentResponse.data.data.paymentId;

      // Step 3: Create Booking
      const bookingResponse = await axios.post(`${config.API}/booking/create`, {
        est_finish_date: storedFormData.est_finish_date,
        delivery_address: storedFormData.delivery_address,
        book_price: (storedFormData.quantity * businessDetails.contrCharge) + businessDetails.servCharge + businessDetails.distCharge,
        trucker_id: businessDetails.trucker_id,
        client_id: storedAcc?.clientID,
        container_id: containerId,
        payment_id: paymentId,
      });

      if (!bookingResponse.data.success) {
        throw new Error("Error creating booking:", bookingResponse.data.error);
      }

      // Redirect the user to the success page after successful booking confirmation
      navigate("/bookingsent");
    } catch (error) {
      console.error("Error confirming booking:", error);
    } finally {
      // Clear the stored form data from localStorage
      localStorage.removeItem('formData');
    }
  };


  return (
    <div className="animate-fade-in bg-image bg-cover h-full" style={{ backgroundImage: `url(${bookingchoiceimg})` }}>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-2 gap-8 p-4">
          {/* First Column */}
          <div className="ml-4">
            {/* First Box */}
            <div className="bg-white border-gray-400 rounded p-4 shadow-lg drop-shadow-lg">
              <h1 className="font-bold mb-2">Selected Service Overview</h1>
              <hr className="my-4 border-gray-400" />
              <div className="flex items-center mb-4">
                <img
                  src={businessDetails.logo}
                  alt="Business Logo"
                  className="w-[40%] h-auto mr-4"
                />
                <div>
                  <h1 className="text-[2em] font-bold mb-1">
                    {businessDetails.business_name}
                  </h1>
                  {/* Business Details */}
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
              <div className="flex items-center mb-2">
              <div className="bg-[#007EA7] text-white font-bold rounded-lg p-3">{Math.round(averageRating)}</div>
                <div className="ml-4">
                  <div className="text-left">Review Score</div>
                  <Rating name="read-only" value={averageRating} precision={0.1} readOnly />
                </div>
              </div>

            </div>
          </div>

          {/* Second Column */}
          <div>
            <div className="bg-white border-gray-400 rounded p-4 shadow-lg drop-shadow-lg">
              <h2 className="font-bold mb-4">Booking Price Breakdown</h2>
              <hr className="my-4 border-gray-400" />
              <div className="flex justify-between mb-2">
                <div>
                  <p>Price for {storedFormData.quantity} Containers</p>
                  <p>Service Charge</p>
                  <p>Distance Charge</p>
                </div>
                <div className="text-right">
                  <p>{businessDetails.contrCharge * storedFormData.quantity}</p>
                  <p>{businessDetails.servCharge}</p>
                  <p>{businessDetails.distCharge}</p>
                </div>
              </div>
              <hr className="my-2 border-gray-400" />
              <div className="flex justify-between">
                <p>Total Price</p>
                <p className="font-bold">₱ {(storedFormData.quantity * businessDetails.contrCharge) + businessDetails.servCharge + businessDetails.distCharge}</p> {/* Sample Total Price */}
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-bold mb-4 mx-8 mt-1 text-[200%]">Confirm Inputted Details</h2>
        {/* Confirm Inputted Details Section and Buttons */}
        <div className="bg-white mt-1 border-gray-400 rounded p-4 mx-8 shadow-lg drop-shadow-lg">

          <table className="w-full border-collapse border">
            <tbody>
              {/* General Information */}
              <tr>
                <td colSpan="2" className="border-b border-r font-bold p-2 bg-[#011627] text-[#21a1da]">General Information</td>
              </tr>
              <tr>
                <td className="border-b border-r p-2 border-[#21a1da]">Pickup Location:</td>
                <td className="border-b p-2 border-[#21a1da]">{storedFormData.pickup_location}</td>
              </tr>
              <tr>
                <td className="border-b border-r p-2 border-[#21a1da]">Delivery Location:</td>
                <td className="border-b p-2 border-[#21a1da]">{storedFormData.delivery_address}</td>
              </tr>
              <tr>
                <td className="border-b border-r p-2 border-[#21a1da]">Est. Finish Date:</td>
                <td className="border-b p-2 border-[#21a1da]">{storedFormData.est_finish_date}</td>
              </tr>

              {/* Container Information */}
              <tr>
                <td colSpan="2" className="border-b border-r font-bold p-2 bg-[#011627] text-[#21a1da]">Container Information</td>
              </tr>
              <tr>
                <td className="border-b border-r p-2 border-[#21a1da]">Container Quantity:</td>
                <td className="border-b p-2 border-[#21a1da]">{storedFormData.quantity}</td>
              </tr>
              <tr>
                <td className="border-b border-r p-2 border-[#21a1da]">Container Type:</td>
                <td className="border-b p-2 border-[#21a1da]">{storedFormData.container_type}</td>
              </tr>
              <tr>
                <td className="border-b border-r p-2 border-[#21a1da]">Container Weight:</td>
                <td className="border-b p-2 border-[#21a1da]">{storedFormData.weight}</td>
              </tr>

              {/* Item Information */}
              <tr>
                <td colSpan="2" className="border-b border-r font-bold p-2 bg-[#011627] text-[#21a1da]">Item Information</td>
              </tr>
              <tr>
                <td className="border-b border-r p-2 border-[#21a1da]">Item Name:</td>
                <td className="border-b p-2 border-[#21a1da]">{storedFormData.item_name}</td>
              </tr>
              <tr>
                <td className="border-b border-r p-2 border-[#21a1da]">Item Quantity:</td>
                <td className="border-b p-2 border-[#21a1da]">{storedFormData.item_quantity}</td>
              </tr>
              <tr>
                <td className="border-b border-r p-2 border-[#21a1da]">Item Type:</td>
                <td className="border-b p-2 border-[#21a1da]">{storedFormData.item_type}</td>
              </tr>
            </tbody>
          </table>

          {/* Buttons Section */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
              onClick={() => {
                // Clear the stored form data from localStorage on cancel
                localStorage.removeItem('formData');
                navigate("/bookingchoices");
              }}
            >
              Cancel Booking <FaTimes className="inline ml-2 " />
            </button>
            <button
              type="button"
              className="bg-[#007EA7] hover:bg-[#003249] text-white p-2 rounded ml-2"
              onClick={handleConfirmBooking}
            >
              Book Now <FaCheck className="inline ml-2" />
            </button>
          </div>
        </div>



      </div>
    </div>
  );
};

export default ConfirmBookingChoice;
