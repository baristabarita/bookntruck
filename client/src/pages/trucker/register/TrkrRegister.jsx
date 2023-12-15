import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../../common/config";
import axios from "axios";
import background from "../../../assets/login-back-pattern.png";
import logo from "../../../assets/web-logo-1.png";
import { BsFillPersonFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import {
  BsFillTelephoneFill,
  BsBriefcaseFill,
  BsFillImageFill,
  BsFillPersonVcardFill,
} from "react-icons/bs";
import { BiSolidLockAlt } from "react-icons/bi";
import { FaFileImage } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FiX } from "react-icons/fi";

const TruckerRegister = () => {
  const [truckerName, setTruckerName] = useState("");
  const [emailAdd, setEmailAdd] = useState("");
  const [business, setBusiness] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [empProof, setEmpProof] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("")
  const navigate = useNavigate();

  useEffect(() => { }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEmpProof(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !truckerName ||
      !emailAdd ||
      !business ||
      !address ||
      !position ||
      !contactNum ||
      !password ||
      !confirmPassword ||
      !empProof
    ) {
      setError('Please fill in all the fields.');
      return;
    }

    if (password === confirmPassword) {
      const formData = new FormData();
      formData.append('email_address', emailAdd);
      formData.append('password', password);
      formData.append('user_type', 'trucker'); 
      formData.append('business_name', business);
      formData.append('trucker_name', truckerName);
      formData.append('contact_number', contactNum);
      formData.append('address', address);
      formData.append('position', position);
      formData.append('emp_proof', empProof);

      axios
        .post(`${config.API}/trkregister`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          if (res.data.success === true) {
            setError('');
            setShowSuccess(true);
          } else {
            setError(res.data.error);
          }
        })
        .catch((err) => {
          setError('Failed to Register. Please try again.');
        });
    } else {
      setError('Passwords do not match!');
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
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center flex justify-between items-center">
          <span>{error}</span>
          <button onClick={closeError}>
            <FiX className="text-white" />
          </button>
        </div>
      )}
      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-green-500 text-white p-2 text-center flex justify-between items-center animate-slide-down">
          <span>Trucker Registration Success! Please wait for admin approval.</span>
          <button onClick={()=>{
            navigate('/trkrlogin');
          }}>
            <FiX className="text-white" />
          </button>
        </div>
      )}
      <div className="relative flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-[4px_15px_10px_4px_gray] rounded-[7px_7px_7px_7px]">
        {/* Left Box */}
        <div className="leftBox flex flex-col items-center justify-center w-full md:w-1/2 bg-white p-10 rounded-[7px_0px_0px_7px]">
          <div className="imgBox mb-8">
            <img className="w-48" src={logo} alt="logo" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl text-[#003249] font-semibold">Sign Up</h1>
            <h1 className="text-2xl text-[#003249] font-semibold mb-2">
              As Manager
            </h1>
            <div className="divider w-[100%] h-[2px] bg-[#003249] mb-2"></div>
            <p className="text-sm font-light">
              Access the features tailored for trucking managers. Sign your
              account up now!
            </p>
          </div>
          <div className="mt-8">
            <span className="text-sm text-[#003249] font-semibold">
              Sign Up as a Regular User?
            </span>
            <Link
              to="/usregister"
              className="block bg-[#003249] text-white py-2 px-4 rounded-full mt-2 hover:bg-[#007EA7] hover:text-white transition-colors delay-250 duration-3000 ease-in text-center"
            >
              User Sign Up
            </Link>
          </div>
        </div>
        {/* Right Box */}
        <div className="right flex flex-col items-center justify-center w-full md:w-1.2/2 p-10 bg-[#003249]">
          <h2 className="text-2xl text-white font-bold mb-2">
            Create Your Account
          </h2>

          <div className="w-[100%]">
            <div className="w-[45%] float-left text-[white]">
              <div className="mt-2.5">
                <BsFillPersonFill className="float-left text-[21px]" />
                <label className="float-left ml-[2px]">Full Name</label>
                <input
                  type="text"
                  name="trucker_owner"
                  className="w-full text-[black] inline-block border rounded box-border bg-[#EDF5F3] mx-0 my-2 px-5 py-3 border-solid border-[#ccc]"
                  onChange={(e) => {
                    setTruckerName(e.target.value);
                    setError('');
                  }}
                ></input>
              </div>
              <div className="mt-2.5">
                <BsBriefcaseFill className="float-left ml-[2px] text-[18px]" />
                <label className="float-left ml-[4px]">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  className="w-full text-[black] inline-block border rounded box-border bg-[#EDF5F3] mx-0 my-2 px-5 py-3 border-solid border-[#ccc]"
                  onChange={(e) => {
                    setBusiness(e.target.value);
                    setError('');
                  }}
                ></input>
              </div>
              <div className="mt-2.5">
                <BsFillPersonVcardFill className="float-left text-[19px]" />
                <label className="float-left ml-[4px]">Position</label>
                <input
                  type="text"
                  name="position"
                  className="w-full text-[black] inline-block border rounded box-border bg-[#EDF5F3] mx-0 my-2 px-5 py-3 border-solid border-[#ccc]"
                  onChange={(e) => {
                    setPosition(e.target.value);
                    setError('');
                  }}
                ></input>
              </div>
              <div className="mt-2.5">
                <BiSolidLockAlt className="float-left text-[19px]" />
                <label className="float-left ml-[4px]">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full text-[black] inline-block border rounded box-border bg-[#EDF5F3] mx-0 my-2 px-5 py-3 border-solid border-[#ccc]"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                ></input>
              </div>
              <div className="mt-2.5">
                <FaFileImage className="float-left text-[20px] mr-[10px] text-[#ffffff]" />
                <label className="float-left ml-[4px]">Proof of Employment</label>
                <label className="group flex cursor-pointer bg-white text-white text-center py-2 px-4 rounded-lg shadow-md float-left align-middle w-[100%]  ">
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    className="float-left cursor-pointer my-[.5em] text-[14px] text-[#003249] inline-block border-solid border-[#ccc]"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <div className="w-[45%] float-left ml-[40px] text-[white]">
              <div className="mt-2.5">
                <MdEmail className="float-left text-[21px]" />
                <label className="float-left ml-[2px]">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full text-[black] inline-block border rounded box-border bg-[#EDF5F3] mx-0 my-2 px-5 py-3 border-solid border-[#ccc]"
                  onChange={(e) => {
                    setEmailAdd(e.target.value);
                    setError('');
                  }}
                ></input>
              </div>
              <div className="mt-2.5">
                <FaLocationDot className="float-left text-[20px]" />
                <label className="float-left ml-[3px]">Address</label>
                <input
                  type="text"
                  name="address"
                  className="w-full text-[black] inline-block border rounded box-border bg-[#EDF5F3] mx-0 my-2 px-5 py-3 border-solid border-[#ccc]"
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setError('');
                  }}
                ></input>
              </div>
              <div className="mt-2.5">
                <BsFillTelephoneFill className="float-left text-[20px]" />
                <label className="float-left ml-[3px]">Contact Number</label>
                <input
                  type="text"
                  name="contactNum"
                  className="w-full text-[black] inline-block border rounded box-border bg-[#EDF5F3] mx-0 my-2 px-5 py-3 border-solid border-[#ccc]"
                  onChange={(e) => {
                    setContactNum(e.target.value);
                    setError('');
                  }}
                ></input>
              </div>
              <div className="mt-2.5">
                <BiSolidLockAlt className="float-left text-[19px]" />
                <label className="float-left ml-[3px]">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full text-[black] inline-block border rounded box-border bg-[#EDF5F3] mx-0 my-2 px-5 py-3 border-solid border-[#ccc]"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                ></input>
              </div>
            </div>
          </div>
          <div className="buttons flex flex-col items-center space-y-5 mt-5">
            <button
              type="submit"
              className="flex items-center justify-center button bg-white text-[#003249] p-[0.5em] w-[50%] rounded-full 
                                hover:bg-[#007EA7] hover:text-white font-bold transition-colors delay-250 duration-[3000] ease-in"
              onClick={handleSubmit}
              value="Register"
            >
              Sign Up
            </button>
            <div className="text-center text-sm">
              <span className="capitalize text-white">
                Already Have an account?{" "}
              </span>
              <Link
                to="/trkrlogin"
                className="text-white font-bold hover:text-[#6ccaf6] transition-colors delay-250 duration-3000 ease-in"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckerRegister;
