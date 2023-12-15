import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../../common/config.ts";
import axios from "axios";
import background from "../../../assets/login-back-pattern.png";
import logo from "../../../assets/web-logo-2.png";
import leftboximg from "../../../assets/medium-shot-man-wearing-helmet.png";
import { BiSolidUserCircle } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FaSquarePhone } from "react-icons/fa6";
import { BsFillShieldLockFill } from "react-icons/bs";
import { FiX } from "react-icons/fi";

const UserRegister = () => {
  const navigate = useNavigate();
  const [emailAdd, setEmailAdd] = useState("");
  const [userName, setUserName] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const regNavi = useNavigate();


  const register = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${config.API}/usregister`, {
        email_address: emailAdd,
        password: password,
        user_type: "client",
        client_name: userName,
        contact_number: contactNum,
      });

      if (res.data.success) {
        setShowSuccess(true);
        
      } else {
        setError(res.data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || "An error occurred. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An error occurred. Please double check your inputs and try again.");
      }
    }
  };

  const closeError = () => {
    setError("");
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden font-roboto animate-fade-in">
      {/* Background Picture */}
      <img
        className="absolute h-screen w-full object-cover"
        src={background}
        alt="background"
      />
      {error && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-red-500 text-white p-2 text-center flex justify-between items-center animate-slide-down">
          <span>{error}</span>
          <button onClick={closeError}>
            <FiX className="text-white" />
          </button>
        </div>
      )}
       {showSuccess && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-green-500 text-white p-2 text-center flex justify-between items-center animate-slide-down">
          <span>User Registration Success!</span>
          <button onClick={()=>{
            regNavi("/usrlogin");
          }}>
            <FiX className="text-white" />
          </button>
        </div>
      )}
      <div className="relative flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-[4px_15px_10px_4px_gray] rounded-[7px_7px_7px_7px]">
        {/* Left Box */}
        <div
          className="leftBox flex flex-col items-center justify-center w-full md:w-2/3 p-10 rounded-[7px_0px_0px_7px]"
          style={{
            backgroundImage: `url(${leftboximg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="imgBox mb-8">
            <img className="w-48" src={logo} alt="logo" />
          </div>
          <div className="text-center text-white">
            <h1 className="text-2xl font-semibold mb-2">
              Sign in to
              <br />
              Book-n-Truck!
            </h1>
            <div className="divider w-[100%] h-[2px] bg-white mb-8"></div>
            <p className="text-sm font-light">
              Get the most out of our platform by signing up!
            </p>
          </div>
          <div className="divider w-[80%] h-[2px] bg-white mt-8"></div>
          <div className="mt-8">
            <span className="text-sm text-white font-semibold">
              Sign in as a Trucker?
            </span>
            <a
              className="block bg-white text-[#007EA7] py-2 px-4 rounded-full mt-2 cursor-pointer hover:bg-[#003249] hover:text-white transition-colors delay-250 duration-3000 ease-in"
              onClick={() => {
                navigate("/trkregister");
              }}
            >
              Trucker Signup
            </a>
          </div>
        </div>
        {/* Right Box */}
        <div className="right flex flex-col items-center justify-center w-full md:w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6">Create your Account</h2>
          <form className="w-full max-w-sm" onSubmit={register}>
            <div className="mb-6">
              <BiSolidUserCircle className="float-left text-[21px] mr-2" />
              <label
                htmlFor="client_name"
                className="block text-sm font-semibold text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                className="mt-1 p-3 w-full border rounded bg-[#EDF5F3] focus:ring focus:ring-[#007EA7] focus:border-[#007EA7]"
                id="client_name"
                name="client_name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <div className="mb-6">
              <MdEmail className="float-left text-[20px] mr-2" />
              <label
                htmlFor="email_address"
                className="block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                className="mt-1 p-3 w-full border rounded bg-[#EDF5F3] focus:ring focus:ring-[#007EA7] focus:border-[#007EA7]"
                id="email_address"
                name="email_address"
                value={emailAdd}
                onChange={(e) => {
                  setEmailAdd(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <div className="mb-6">
              <FaSquarePhone className="float-left text-[17px] mr-2" />
              <label
                htmlFor="contactnum"
                className="block text-sm font-semibold text-gray-700"
              >
                Contact Number
              </label>
              <input
                type="text"
                className="mt-1 p-3 w-full border rounded bg-[#EDF5F3] focus:ring focus:ring-[#007EA7] focus:border-[#007EA7]"
                id="contactnum"
                name="contactnum"
                placeholder="Format: 09123456789"
                value={contactNum}
                onChange={(e) => {
                  setContactNum(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <div className="mb-6">
              <BsFillShieldLockFill className="float-left text-[20px] mr-2" />
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                className="mt-1 p-3 w-full border rounded bg-[#EDF5F3] focus:ring focus:ring-[#007EA7] focus:border-[#007EA7]"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
            <div className="buttons flex flex-col md:flex-row items-center space-y-5 md:space-y-0 md:space-x-5">
              <button
                type="submit"
                className="flex items-center justify-center button bg-[#007EA7] text-white p-[0.5em] w-[50%] rounded-full 
                              hover:bg-[#003249] font-bold transition-colors delay-250 duration-[3000] ease-in"
              >
                Register
              </button>
              <div className="text-center text-sm">
                <span className="capitalize">Already Have an account? </span>
                <a
                  onClick={() => {
                    navigate("/usrlogin");
                  }}
                  className="text-[#007EA7] font-bold hover:text-[#003249] transition-colors delay-250 duration-3000 ease-in"
                >
                  Sign In
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
