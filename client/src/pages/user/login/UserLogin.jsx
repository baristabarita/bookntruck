import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../../common/config";
import axios from "axios";
import background from "../../../assets/login-back-pattern.png";
import leftboximg from "../../../assets/logreg-img-1.png";
import logo from "../../../assets/web-logo-2.png";
import user from "../../../assets/user.png";
import { FiX } from "react-icons/fi";

const UserLogin = () => {
  const navigate = useNavigate();
  const [emailAdd, setEmailAdd] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGuest = () => {
    setError("");
    navigate("/");
  };

  const closeError = () => {
    setError("");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (emailAdd === "" || password === "") {
      setError("Please fill up the required fields!");
    } else {
      axios
        .post(`${config.API}/usrlogin`, {
          email_address: emailAdd,
          password: password,
          user_type: 'client'
        })
        .then((res) => {
          if (res.data.success === true) {
            localStorage.setItem(
              "clientDetails",
              JSON.stringify(res.data.client_info)
            );
            navigate("/");
          } else {
            setError(res.data.error);
          }
        })
        .catch((err) => {
          setError("Failed to login. Please try again."); // Provide a generic error message for security reasons
          console.error(err); // Log the actual error for debugging purposes
        });
    }
  };

  const handleEmailChange = (e) => {
    setEmailAdd(e.target.value);
    setError(""); // Clear error on email change
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(""); // Clear error on password change
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
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center flex justify-between items-center animate-slide-down">
          <span>{error}</span>
          <button onClick={closeError}>
            <FiX className="text-white" />
          </button>
        </div>
      )}
      {/* login box */}
      <div className="relative flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-[4px_15px_10px_4px_gray] rounded-[7px_7px_7px_7px]">
        {/* Left side */}
        <div
          className="leftBox flex flex-col items-center justify-center w-full md:w-2/3 p-10 rounded-[7px_0px_0px_7px]"
          style={{ backgroundImage: `url(${leftboximg})`, backgroundSize: 'cover' }}
        >
          <div className="imgBox mb-3">
            <img className="w-48" src={logo} alt="logo" />
          </div>
          <div className="text-center text-white">
            <h1 className="text-2xl font-m">Welcome to</h1>
            <h1 className="text-2xl text-[#f2BB05] font-bold mb-2">
              Book-n-Truck!
            </h1>
            <div className="divider w-[100%] h-[2px] bg-white mb-8"></div>
            <p className="text-sm font-light">
              Create bookings for trucking services with just a few clicks. Log
              into your account now!
            </p>
          </div>
          <div className="divider w-[100%] h-[2px] bg-white mt-8"></div>
          <div className="mt-7">
            <span className="text-lg text-white font-semibold">
              Are You a Trucking Manager?
            </span>
          </div>
          <Link
              to="/trkrlogin"
              className="block bg-white text-[#007EA7] w-[30%] py-2 px-4 rounded-full mt-2 hover:bg-[#003249] hover:text-white transition-colors delay-250 duration-3000 ease-in text-center"
            >
              Trucker Login
            </Link>
        </div>

        {/* Right Side */}
        <div className="right flex flex-col items-center justify-center w-full md:w-1/3 p-10">
          <div className="imgBox mb-2">
            <img className="w-16" src={user} alt="user" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Welcome!</h2>
          <form className="w-full max-w-sm">
            <div className="mt-3 mb-2">
              <input
                placeholder="Email Address"
                type="email"
                className="mt-1 p-3 w-full border rounded bg-[#EDF5F3] focus:ring focus:ring-[#007EA7] focus:border-[#007EA7]"
                id="emailAdd"
                name="emailAdd"
                value={emailAdd}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                placeholder="Password"
                type="password"
                className="mt-1 p-3 w-full border rounded bg-[#EDF5F3] focus:ring focus:ring-[#007EA7] focus:border-[#007EA7]"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="text-right text-sm mb-6">
              <Link
                to="/forgpass"
                className="text-[#007EA7] hover:text-[#003249] transition-colors delay-250 duration-3000 ease-in"
              >
                {" "}
                Forgot Password?{" "}
              </Link>
            </div>
            <div className="buttons flex flex-col items-center space-y-5">
              <button
                type="submit"
                onClick={handleLogin}
                className="flex items-center justify-center button bg-[#007EA7] text-white p-[0.5em] w-full rounded-full hover:bg-[#003249] font-bold transition-colors delay-250 duration-[3000] ease-in"
              >
                Login
              </button>
              <button
                type="submit"
                onClick={handleGuest}
                className="font-roboto button text-[#007EA7] p-[0.5em] w-full rounded-full border-solid border-2 border-[#007EA7] font-bold hover:bg-[#007EA7] hover:text-white transition-colors delay-250 duration-[3000] ease-in "
              >
                Continue as Guest
              </button>
            </div>
            <div className="text-center text-sm mt-5">
              <span className="capitalize">Don't Have an account? </span>
              <Link
                to="/usregister"
                className="text-[#007EA7] font-bold hover:text-[#003249] transition-colors delay-250 duration-3000 ease-in"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default UserLogin;
