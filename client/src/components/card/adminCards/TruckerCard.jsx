import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../common/config";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaMapMarker, FaTruckMoving} from "react-icons/fa";
import { MdMail } from "react-icons/md";

const TruckerCard = ({ trucker, onViewMore }) => {
  const {
    business_name,
    trucker_name,
    position,
    address,
    logo,
    trucker_status,
    user_id,
  } = trucker;
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `${config.API}/user/retrieve?col=user_id&val=${user_id}`
        );
        setUserDetails(userResponse.data.records[0] || {});
      } catch (error) {
        console.error("Error fetching user and trucker data:", error);
      }
    };

    fetchUserData();
  }, [user_id]);

  const handleViewMoreClick = () => {
    onViewMore(trucker);
  };

  const logoWidth = "20em";
  const logoHeight = "7em";

  return (
    <div className="bg-white shadow-lg mx-2 my-4 p-4 rounded-lg sm:flex sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <div className="sm:w-1/3 mb-4 sm:mb-0 flex items-center justify-center">
      {logo ? (
        <img
          src={logo}
          alt="Business Logo"
          className={`w-full h-auto object-cover rounded-lg`}
          style={{ width: logoWidth, height: logoHeight }}
        />
      ) : (
        <FaTruckMoving size={logoWidth} className="text-gray-500 h-20" />
      )}
    </div>
      <div className="sm:w-2/3 sm:ml-7">
        <h2 className="font-bold text-darkblue text-lg mb-1">
          {business_name}
        </h2>
        <div className="flex items-center text-sm">
          <FaUserCircle className="text-darkblue mr-2" />
          <div>{trucker_name}</div>
        </div>
        <div className="flex items-center text-sm">
          <MdMail className="text-darkblue mr-2" />
          <div>{userDetails.email_address}</div>
        </div>
        <div className="flex items-center text-sm">
          <FaMapMarker className="text-darkblue mr-2" />
          <div>{address}</div>
        </div>
      </div>
      <div className="sm:w-3/3 mt-4 sm:mt-0 sm:ml-auto flex flex-col items-center justify-center">
  <div
    className={`font-bold rounded-full my-2  mx-2 py-[2%] w-[100%] xl:max-2xl:text-[0.9em] flex items-center justify-center
      ${
        trucker_status === "Approved"
          ? "bg-[#45C69B] text-[#20634d]"
          : trucker_status === "Declined"
          ? "bg-[#f19d9d] text-[#753b3b]"
          : "bg-[#F6AE2D] text-[#5e4f32]"
      }`}
  >
    {trucker_status}
  </div>

  <button
    className="bg-blue-500 text-white rounded-md p-2 flex items-center"
    onClick={handleViewMoreClick}
  >
    View
  </button>
</div>

    </div>
  );
};

export default TruckerCard;
