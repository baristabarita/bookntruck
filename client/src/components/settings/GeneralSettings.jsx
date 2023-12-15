import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../common/config";
import { TiBusinessCard } from "react-icons/ti";
import { BiSolidCamera } from "react-icons/bi";
import { IoIosCall } from "react-icons/io";

const GeneralSettings = () => {
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [userID, setUserID] = useState(null);
  const truckerID = Number(localStorage.getItem("trkr_id"));
  console.log(truckerID);

  const [formData, setFormData] = useState({
    logo: "https://i.imgur.com/fmPxjF2.png",
    businessName: "",
    ownerName: "",
    description: "",
    address: "",
    contactNumber: "",
    emailAddress: "",
  });

  useEffect(() => {
    // Fetch data from localStorage
    const localStorageData = JSON.parse(
      localStorage.getItem(`trucker_${truckerID}_data`)
    );
    if (localStorageData) {
      setFormData(localStorageData);
    }

    // Fetch data from the API
    axios
      .get(`${config.API}/trucker/retrieve`, {
        params: { col: "trucker_id", val: truckerID },
      })
      .then((response) => {
        const apiData = response.data.trucker[0];
        setFormData((prevData) => ({
          ...prevData,
          businessName: apiData.business_name,
          ownerName: apiData.trucker_name,
          description: apiData.description,
          address: apiData.address,
          contactNumber: apiData.contact_number,
          logo: apiData.logo || "https://i.imgur.com/fmPxjF2.png",
        }));
        setUserID(apiData.user_id);
        axios.get(`${config.API}/user/retrieve?col=user_id&val=${apiData.user_id}`)
          .then((userResponse) => {
            const userData = userResponse.data.records[0];
            setFormData((prevData) => ({
              ...prevData,
              emailAdd: userData.email_address,
            }));
          })
          .catch((userError) => {
            console.error("Error fetching user details:", userError);
          });
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, [truckerID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImageChange = () => {
    setIsChangingImage(true);
  };

  const handleImageUrlChange = (e) => {
    setNewImageUrl(e.target.value);
  };

  const handleImageUrlSubmit = () => {
    setFormData((prevData) => ({
      ...prevData,
      logo: newImageUrl,
    }));
    setIsChangingImage(false);
  };
  const handleCancelChange = () => {
    setIsChangingImage(false);
    setNewImageUrl("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the data to be sent to the API
    const updatedData = {
      trucker: {
        business_name: formData.businessName,
        trucker_name: formData.ownerName,
        description: formData.description,
        address: formData.address,
        contact_number: formData.contactNumber,
        logo: formData.logo,
      },
    };

    // Send a POST request to update the data
    axios.post(`${config.API}/trucker/update?truckerID=${truckerID}`, updatedData)
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        
        if(response.data.success){

          const userUpdateData ={
            email_address: formData.emailAdd,
          };

          // Send a POST request to update user data
        axios.post(`${config.API}/user/update?userID=${userID}`, userUpdateData)
        .then(userResponse => {
          console.log("User data updated successfully:", userResponse.data);
          // Handle success, show a success message, or perform additional actions if needed
        })
        .catch(userError => {
          console.error("Error updating user data:", userError);
        });
    } else {
      console.error("Error updating trucker data:", response.data.message);
    }
      })
      .catch((error) => {
        console.error("Error updating trucker data:", error);
        // Handle errors, show an error message, or perform additional actions if needed
      });
  };

  return (
    <div className="mt-2">
      {/* First Box */}
      <div className="w-auto h-auto bg-white m-8 p-5 rounded-lg animate-fade-in drop-shadow-lg shadow-lg">
        <div className="flex flex-row mr-5 ml-5">
          <TiBusinessCard className="text-4xl xl:max-2xl:text-[1.5em]" />
          <h3 className="text-2xl mb-2 p-1 xl:max-2xl:text-lg">
            <strong>Business Overview</strong>
          </h3>
        </div>
        <form className="mt-2 mr-5 ml-5" onSubmit={handleSubmit}>
          {/* LOGO SECTION - PLEASE EDIT THIS PART */}
          <div className="m-2 mb-8 flex flex-row">
            <label
              className="text-lg p-2 w-auto flex-shrink-0 font-semibold text-black xl:max-2xl:text-[0.8em]"
              style={{ lineHeight: "3.0rem" }}
            >
              Business Logo
            </label>
            {!isChangingImage ? (
              <div className="relative cursor-pointer flex items-center justify-center">
                <img
                  className="ml-5 overflow-hidden w-[7rem] rounded-2xl xl:max-2xl:w-[6rem]"
                  src={formData.logo}
                  alt="Business Logo"
                />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-80 bg-white">
                  <BiSolidCamera className="relative text-[35px] left-[39%] bottom-[11.2%] xl:max-2xl:text-[1.3em] xl:max-2xl:left-[43%]" />
                  <p
                    className="relative text-black font-bold text-[12px] top-[10%] right-[8%] xl:max-2xl:text-[0.6em] xl:max-2xl:right-[4%]"
                    onClick={handleImageChange}
                  >
                    Change Image
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center mt-2">
                <input
                  type="text"
                  className="m-2 ml-4 p-2 w-full flex border border-gray-300 rounded-md xl:max-2xl:text-[0.7em] focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="Enter Image URL"
                  value={newImageUrl}
                  onChange={handleImageUrlChange}
                />
                <button
                  className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
                  onClick={handleImageUrlSubmit}
                >
                  Submit
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-gray-300 text-black rounded text-xs"
                  onClick={handleCancelChange}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="m-2 flex flex-row ">
            <label
              className="text-lg p-2 w-auto flex-shrink-0 font-semibold text-black xl:max-2xl:text-[0.8em]"
              style={{ lineHeight: "3.0rem" }}
            >
              Business Name
            </label>
            <input
              type="text"
              placeholder="Enter your business name here..."
              className="m-2 ml-2 p-2 w-full flex border border-gray-300 rounded-md xl:max-2xl:text-[0.7em] focus:outline-none focus:ring focus:ring-blue-500"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
            />
          </div>
          <div className="m-2 flex flex-row ">
            <label
              className="text-lg p-2 w-auto flex-shrink-0 font-semibold text-black xl:max-2xl:text-[0.8em]"
              style={{ lineHeight: "3.0rem" }}
            >
              Owner's Name
            </label>
            <input
              type="text"
              placeholder="Enter your owner name here..."
              className="m-2 ml-4 p-2 w-full flex border border-gray-300 rounded-md xl:max-2xl:text-[0.7em] focus:outline-none focus:ring focus:ring-blue-500"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
            />
          </div>
          <div className="m-2 flex flex-row ">
            <label
              className="text-lg p-2 w-auto flex-shrink-0 font-semibold text-black xl:max-2xl:text-[0.8em]"
              style={{ lineHeight: "3.0rem" }}
            >
              Full Address
            </label>
            <input
              type="text"
              placeholder="Enter your address/location here..."
              className="m-2 ml-9 p-2 w-full flex border border-gray-300 rounded-md xl:max-2xl:text-[0.7em] focus:outline-none focus:ring focus:ring-blue-500"
              name="ownerName"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="m-2 flex flex-row ">
            <label
              className="text-lg p-2 w-auto flex-shrink-0 font-semibold text-black xl:max-2xl:text-[0.8em]"
              style={{ lineHeight: "3.0rem" }}
            >
              Description
            </label>
            <textarea
              placeholder="Enter your business description here..."
              className="m-2 ml-10 p-2 text w-full flex border border-gray-300 rounded-md resize-none xl:max-2xl:text-[0.7em] focus:outline-none focus:ring focus:ring-blue-500"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>

      {/* Second Box */}
      <div className="w-auto h-auto bg-white m-8 p-5 rounded-lg animate-fade-in drop-shadow-lg shadow-lg">
        <div className="flex flex-row mr-5 ml-5">
          <IoIosCall className="text-4xl xl:max-2xl:text-[1.5em]" />
          <h3 className="text-2xl mb-2 p-1 xl:max-2xl:text-lg">
            <strong>Contact Details</strong>
          </h3>
        </div>
        <form className="mt-2 mr-5 ml-5" onSubmit={handleSubmit}>
          <div className="m-2 flex flex-row ">
            <label
              className="text-lg p-2 w-auto flex-shrink-0 font-semibold text-black xl:max-2xl:text-[0.8em]"
              style={{ lineHeight: "3.0rem" }}
            >
              Contact Number
            </label>
            <input
              type="text"
              placeholder="Enter your contact number here..."
              className="m-2 ml-2 p-2 w-full flex border border-gray-300 rounded-md xl:max-2xl:text-[0.7em] focus:outline-none focus:ring focus:ring-blue-500"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="m-2 flex flex-row ">
            <label
              className="text-lg p-2 w-auto flex-shrink-0 font-semibold text-black xl:max-2xl:text-[0.8em]"
              style={{ lineHeight: "3.0rem" }}
            >
              Email Address
            </label>
            <input
              type="text"
              placeholder="Enter your email address here..."
              className="m-2 ml-7 p-2 w-full flex border border-gray-300 rounded-md xl:max-2xl:text-[0.7em] focus:outline-none focus:ring focus:ring-blue-500"
              name="emailAdd"
              value={formData.emailAdd}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="ml-2 px-2 py-1 bg-[#21a1da] text-white hover:bg-[#011627] rounded text-xs"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeneralSettings;
