import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../../common/config";
import axios from "axios";
import background from "../../../assets/login-back-pattern.png";
import logo from "../../../assets/web-logo-1.png";
import { FiX } from "react-icons/fi";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [emailAdd, setEmailAdd] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const closeError = () => {
        setError("");
    };

    const handleLogin = (event) => {
        event.preventDefault();

        if (emailAdd === "" || password === "") {
            setError("Please fill up the required fields!");
        } else {
            axios
                .post(`${config.API}/admin/adlogin`, {
                    email_address: emailAdd,
                    password: password,
                    user_type: 'admin',
                })
                .then((res) => {
                    if (res.data.success == true) {
                        localStorage.setItem(
                            "adminDetails",
                            JSON.stringify(res.data.admin_info)
                        );
                        console.log(res.data);
                        navigate("/admin/admindash");
                    } else {
                        setError(res.data.error);
                    }
                })
                .catch((err) => {
                    setError("Login failed. Please try again.");
                });
        }
    };

    return (
        <div className='h-screen flex items-center justify-center overflow-hidden font-roboto animate-fade-in'>
            {/* Background Picture */}
            <img className='absolute h-screen w-full object-cover' src={background} alt='background' />
            {error && (
                <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={closeError}>
                        <FiX className="text-white" />
                    </button>
                </div>
            )}
            <div className='relative flex flex-col md:flex-row max-w-3xl w-full bg-white shadow-[4px_15px_10px_4px_gray] rounded-[7px_7px_7px_7px]'>
                {/* Left Box */}
                <div className='leftBox flex flex-col items-center justify-center w-full md:w-1/2 bg-white p-10 rounded-[7px_0px_0px_7px]'>
                    <div className='imgBox mb-8'>
                        <img className='w-48' src={logo} alt='logo' />
                    </div>
                    <div className='text-center'>
                        <h1 className='text-2xl text-[#003249] font-semibold'>Gateway to</h1><h1 className='text-2xl text-[#003249] font-semibold mb-2'>Admin</h1>
                        <div className="divider w-[100%] h-[2px] bg-[#003249] mb-2"></div>
                        <p className='text-sm font-light'>Manage your users in one platform. Log into your account now!</p>
                    </div>
                </div>
                {/* Right Box */}
                <div className='right flex flex-col items-center justify-center w-full md:w-1.2/2 p-10 bg-[#003249]'>
                    <h2 className='text-2xl text-white font-bold mb-6'>Login to your Account</h2>
                    <form className='w-full max-w-sm'>
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-white"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                className="mt-1 p-3 w-full border rounded bg-[#EDF5F3] focus:ring focus:ring-[#007EA7] focus:border-[#007EA7]"
                                id="emailAdd"
                                name="emailAdd"
                                value={emailAdd}
                                onChange={(e) => {
                                    setEmailAdd(e.target.value);
                                    setError("");
                                }}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-white"
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
                        <div className='buttons flex flex-col items-center space-y-5'>
                            <button
                                type="submit"
                                onClick={handleLogin}
                                className="flex items-center justify-center button bg-white text-[#003249] p-[0.5em] w-[50%] rounded-full 
                                hover:bg-[#007EA7] hover:text-white font-bold transition-colors delay-250 duration-[3000] ease-in"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
