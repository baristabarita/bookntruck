import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaTruck, FaDollarSign, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { MdReviews } from 'react-icons/md'
import { BiSolidDashboard } from 'react-icons/bi';

const TruckerSide = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (!isSidebarOpen) {
      toggleSidebar(); // Close sidebar when navigating if it's not open
    }
  };

  return (
    <div className={`h-screen fixed bg-[#011627] text-[#6488a5] text-[1.2em] font-semibold p-4 flex flex-col items-start ${isSidebarOpen ? 'w-60' : 'w-16'} transition-all duration-300 ease-in-out`}>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/trucker/trkrdash' ? 'bg-gray-700 text-[#21a1da] p-2 rounded' : ''}`} onClick={() => handleNavigation('/trucker/trkrdash')}>
        <BiSolidDashboard className={`mr-2`} />
        {isSidebarOpen && 'Dashboard'}
      </div>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/trucker/bookinglist' ? 'bg-gray-700 text-[#21a1da] p-2 rounded' : ''}`} onClick={() => handleNavigation('/trucker/bookinglist')}>
        <FaBook className={`mr-2`} />
        {isSidebarOpen && 'Bookings'}
      </div>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/trucker/assetlist' ? 'bg-gray-700 text-[#21a1da] p-2 rounded' : ''}`} onClick={() => handleNavigation('/trucker/assetlist')}>
        <FaTruck className={`mr-2`} />
        {isSidebarOpen && 'Assets'}
      </div>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/trucker/paymentlist' ? 'bg-gray-700 text-[#21a1da] p-2 rounded' : ''}`} onClick={() => handleNavigation('/trucker/paymentlist')}>
        <FaDollarSign className={`mr-2`} />
        {isSidebarOpen && 'Payments'}
      </div>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/trucker/reviewlist' ? 'bg-gray-700 text-[#21a1da] p-2 rounded' : ''}`} onClick={() => handleNavigation('/trucker/reviewlist')}>
        <MdReviews className={`mr-2`} />
        {isSidebarOpen && 'Review List'}
      </div>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/trucker/trkrsettings' ? 'bg-gray-700 text-[#21a1da] p-2 rounded' : ''}`} onClick={() => handleNavigation('/trucker/trkrsettings')}>
        <FaUser className={`mr-2`} />
        {isSidebarOpen && 'Account Settings'}
      </div>
      <div className={`fixed bottom-[5%] ml-2 w-[15%] cursor-pointer flex items-center`} onClick={() => handleNavigation('/logout')}>
        <FaSignOutAlt className={`mr-2`} />
        {isSidebarOpen && 'Logout'}
      </div>
    </div>
  );
};

export default TruckerSide;
