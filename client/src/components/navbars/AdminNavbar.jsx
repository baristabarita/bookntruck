import React, { useEffect, useState } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/web-logo-2.png';

const AdminNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [adminname, setAdminname] = useState("");
  const storedAdmin = localStorage.getItem('adminDetails');
  const [shortLet, setShortLet] = useState("");

  console.log(storedAdmin);

  useEffect(() => {
    if (storedAdmin) {
      setAdminname(JSON.parse(storedAdmin).adminName);
    }

    if (adminname) {
      getShortLetter(adminname);
    }
  }, [adminname]);

  useEffect(() => {
    getAdminID();
  }, [])

  const getShortLetter = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      setShortLet(nameParts[0].charAt(0).toUpperCase());
    } else if (nameParts.length > 1) {
      setShortLet(nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase());
    }
  };

  const getAdminID = () => {
    const storedAdminDetails = localStorage.getItem('adminDetails');
    console.log('stored =', storedAdminDetails);
    if (storedAdminDetails) {
      const adminID = JSON.parse(storedAdminDetails).adminID;

      console.log("Admin ID:", adminID);
      localStorage.setItem('adm_id', JSON.stringify(adminID));
      // Perform any other actions or set states related to the trucker ID as needed.
    } else {
      // Handle the case when trucker details are not found in localStorage.
      console.error("Admin details not found in localStorage.");
    }
  };

  return (
    <nav className="bg-[#241B2F] text-white p-4 flex justify-between items-center shadow-2xl">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-3xl ml-1">
          <FaBars />
        </button>
        <img src={logo} alt="Logo" className="h-10 ml-10" />
      </div>
      <div className="flex items-center">
        <p className='ml-[0.8rem] mr-2 font-semibold text-[#37F9F6] text-[1.1em] xs:max-sm:text-[1em] xs:max-sm:ml-[0.7em] xl:max-2xl:text-[0.9em]'>{adminname}</p>
        {adminname ?
          <div className="relative inline-flex items-center justify-center w-10 mr-[2%] h-10 overflow-hidden bg-[#840705] 
        rounded-full dark:bg-gray-600 xs:max-sm:w-[1.4rem] xs:max-sm:h-[1.4rem] xl:max-2xl:w-8 xl:max-2xl:h-8">
            <span className="font-medium text-white dark:text-gray-300 xs:max-sm:text-[0.7em] xl:max-2xl:text-[0.8em]">{shortLet}</span>
          </div>
          :
          <div className="mr-6">
            <FaUserCircle className="text-2xl cursor-pointer" />
          </div>
        }
      </div>
    </nav>
  );
};

export default AdminNavbar;
