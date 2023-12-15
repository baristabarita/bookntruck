import React from 'react';
import { AiOutlineCopyrightCircle, AiFillFacebook, AiFillInstagram, AiFillTwitterSquare, AiFillGoogleSquare } from 'react-icons/ai';
import { FaRegEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { BsFillTelephoneFill } from 'react-icons/bs'
import logo from "../../assets/web-logo-2.png";

const Footer = () => {
    return (
        <footer className="text-white bg-gray-800 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-100">
            {/* Column 1: Logo and Description */}
            <div className="flex flex-col items-center md:items-start ml-[10%] mr-[5%]">
                <img src={logo} alt="BooknTruck Logo" className="w-[60%]" />
                <p className='text-sm text-[1.2rem] ml-2 mt-2 md:ml-0 md:mt-4'>BookNTruck is an web - application created by students.</p>
            </div>

            {/* Column 2: Contact Details */}
            <div className='text-center mt-4 md:mt-0 md:text-left ml-[20%]'>
                <h3 className="text-lg font-bold mb-2">Contact Details</h3>
                <div className="flex text-center md:text-left justify-center md:justify-start mb-2">
                    <FaMapMarkerAlt className="mr-2" /> Paseo Arcenas st., Cebu City, Philippines
                </div>
                <div className="flex items-center justify-center md:justify-start mb-2">
                    <FaRegEnvelope className="mr-2" /> bookntruck@gmail.com
                </div>
                <div className="flex items-center justify-center md:justify-start mb-2">
                    <BsFillTelephoneFill className="mr-2" /> +623257890
                </div>
            </div>

            {/* Column 3: Social Media Icons */}
            <div className="flex flex-col items-center md:items-start ml-[20%]">
                <h3 className="text-lg font-bold mb-2">External Links</h3>
                <div className="flex items-center space-x-4">
                    <AiFillFacebook className="text-2xl" />
                    <AiFillInstagram className="text-2xl" />
                    <AiFillTwitterSquare className="text-2xl" />
                    <AiFillGoogleSquare className="text-2xl" />
                </div>
            </div>


            {/* Copyright */}
            <div className="col-span-3 text-center mt-4">
                <p className='font-medium text-[1.2rem] flex items-center justify-center'>
                    Copyright <AiOutlineCopyrightCircle className='mr-2 ml-2' />2023 Book-n-Truck. All Rights Reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;
