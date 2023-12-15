import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidLogOutCircle } from 'react-icons/bi'
import { AiOutlineDown } from 'react-icons/ai'
import { RiLoginCircleFill } from 'react-icons/ri'
import logo from "../../assets/web-logo-1.png";

const UserHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState("");
  const [urlPart, setUrlPart] = useState('');
  const [shortLet, setShortLet] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const loggedUser = localStorage.getItem('clientDetails');
  const navigate = useNavigate();

  useEffect(() => {

    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 2) {
      setUrlPart(pathParts[1]);
    }

    if (loggedUser) {
      setUsername(JSON.parse(loggedUser).clientName);
    }

    if (username) {
      getShortLetter(username);
    }
  }, [window.location.pathname, username]);

  useEffect(() => {
    getClientID();
  }, [])

  //const truncatedUsername = username.slice(0, 6);

  const getShortLetter = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      setShortLet(nameParts[0].charAt(0).toUpperCase());
    } else if (nameParts.length > 1) {
      setShortLet(nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase());
    }
  };

  const getClientID = () => {
    const storedClientDetails = localStorage.getItem('clientDetails');
    if (storedClientDetails) {
      const clientID = JSON.parse(storedClientDetails).clientID;
      // Now you can use clientID for the whole website.
      console.log("Current Client ID:", clientID);
      localStorage.setItem('clnt_id', JSON.stringify(clientID));
    } else {
      console.error("client Details not found in local storage");
    }
  }

  /*
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
   */

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white p-4 grid grid-cols-3 justify-between items-center h-[6rem] border-solid border-2 shadow-lg">
      {/* Logo Column */}
      <div className="col-span-1 flex items-center">
        <img src={logo} alt="BooknTruck Logo" className="ml-[5%] w-[40%]" />
      </div>

      {/* Links Column */}
      <div className="col-span-1 flex items-center text-[1.2em] text-[#003249] font-bold space-x-10 justify-center">
        <nav className="xl:max-2xl:ml-[5%]">
          <ul className='flex text-[1.2em] text-black xs:max-sm:text-[0.8em] xl:max-2xl:text-[0.8em]'>
            <li className={`mr-28 hover:text-[#55c9ff] cursor-pointer hover:animate-zoom-in xs:max-sm:mr-8 xs:max-sm:pt-2 xl:max-2xl:mr-16
                        ${urlPart === '' ? 'text-[#2d7df6]' : ''} whitespace-nowrap`}
              onClick={() => { navigate('/') }}>Home</li>
            <li className={`mr-28 hover:text-[#55c9ff] text-center cursor-pointer hover:animate-zoom-in-end xs:max-sm:mr-8 xl:max-2xl:mr-16
                        ${urlPart === 'about' ? 'text-[#2d7df6]' : ''} whitespace-nowrap`}
              onClick={() => { navigate('/about') }}>About Us</li>
            <li className={`hover:text-[#55c9ff] text-center cursor-pointer hover:animate-zoom-in-end xs:max-sm:mr-8 xl:max-2xl:mr-16
                        ${urlPart === 'bookingchoices' ? 'text-[#2d7df6]' : ''} whitespace-nowrap`}
              onClick={() => { navigate('/bookingchoices') }}>Booking Choices</li>
          </ul>
        </nav>
      </div>

      {/* Buttons/Username and Dropdowns Column */}
      <div className="col-span-1 flex items-center justify-end space-x-4">
        {username
          ?
          <div className="relative inline-flex items-center justify-center w-11 h-10 overflow-hidden bg-[#003249] rounded-full">
            <span className="font-medium text-white">{shortLet}</span>
          </div>
          
          :
          <div className="flex space-x-2 items-center">
            <Link to="/usregister" className="px-4 py-2 bg-[#007EA7] text-white rounded hover:text-[#003249] hover:bg-[#e2e2e2] transition-colors delay-250 duration-3000 ease-in">
              Register
            </Link>
            <Link to="/usrlogin" className="px-4 py-2 border-solid border-2 border-[#007EA7] rounded text-[#003249] hover:bg-[#007EA7] hover:text-white transition-colors delay-250 duration-3000 ease-in">
              Login
            </Link>
          </div>
        }
        <AiOutlineDown
          className='text-black mt-[6%] ml-[6%] text-[1.3em] hover:cursor-pointer hover:text-[#DD2803] xl:max-2xl:text-[1em]'
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        />
        {showMenu &&
          <div className={`absolute ${username ? 'h-[17vh]' : 'h-[11vh]'} w-[7vw] right-0 mt-2 bg-white text-black block rounded-lg animate-slide-down xl:max-2xl:top-[80%]`}>
            <ul className='list-none pl-[15%] xl:max-2xl:text-[0.7em]'>
              <li><hr className="w-[85px] pt-[10%] xl:max-2xl:w-[60px]" /></li>
              {username
                ?
                <li className='pb-[10%]'>Hi, {username}!</li>
                :
                <li className='pb-[10%]'>Hi, Guest!</li>
              }

              <li><hr className="w-[85px] pt-[10%]  xl:max-2xl:w-[60px]" /></li>

              {username
                ?
                <>
                  <li className='flex hover:text-[#55c9ff] cursor-pointer py-[8%] hover:animate-zoom-in'
                    onClick={() => navigate('/userprofile')}>My Profile</li>
                  <li className='flex hover:text-[#55c9ff] cursor-pointer py-[8%] hover:animate-zoom-in'
                    onClick={() => {
                      localStorage.removeItem('clientDetails');
                      navigate('/logout');
                    }}>Log Out<BiSolidLogOutCircle className='ml-[2%] mt-[2%] text-[1.3em]' /></li>
                </>
                :
                <li className='flex hover:text-[#55c9ff] cursor-pointer py-[8%] hover:animate-zoom-in'
                  onClick={() => navigate('/usrlogin')}>Log In<RiLoginCircleFill className='ml-[2%] mt-[2%] text-[1.3em]' /></li>
              }
            </ul>
          </div>
        }
      </div>
    </nav>
  );
};

export default UserHeader;
