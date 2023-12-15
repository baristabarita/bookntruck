import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaTruck, FaDollarSign, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { BiSolidDashboard } from 'react-icons/bi';

const AdminSide = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (!isSidebarOpen) {
      toggleSidebar(); // Close sidebar when navigating if it's not open
    }
  };

  return (
    <div className={`h-screen fixed bg-[#241B2F] text-[#626068] text-[1.2em] font-semibold p-4 flex flex-col items-start ${isSidebarOpen ? 'w-60' : 'w-20'} transition-all duration-200 ease-in-out`}>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/admin/admindash' ? 'bg-gray-700 text-[#BF458D] p-2 rounded' : ''}`} onClick={() => handleNavigation('/admin/admindash')}>
        <BiSolidDashboard className={`mr-2`} />
        {isSidebarOpen && 'Dashboard'}
      </div>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/admin/truckerlist' ? 'bg-gray-700 text-[#BF458D] p-2 rounded' : ''}`} onClick={() => handleNavigation('/admin/truckerlist')}>
        <FaTruck className={`mr-2`} />
        {isSidebarOpen && 'Trucker Management'}
      </div>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/admin/userlist' ? 'bg-gray-700 text-[#BF458D] p-2 rounded' : ''}`} onClick={() => handleNavigation('/admin/userlist')}>
        <FaUser className={`mr-2`} />
        {isSidebarOpen && 'User Logs'}
      </div>
      <div className={`mb-5 cursor-pointer flex items-center ${location.pathname === '/admin/bookinglogs' ? 'bg-gray-700 text-[#BF458D] p-2 rounded' : ''}`} onClick={() => handleNavigation('/admin/bookinglogs')}>
        <FaBook className={`mr-2`} />
        {isSidebarOpen && 'Booking Logs'}
      </div>
      <div className={`fixed bottom-[5%] ml-2 w-[15%] cursor-pointer flex items-center`} onClick={() => handleNavigation('/logout')}>
        <FaSignOutAlt className={`mr-2`} />
        {isSidebarOpen && 'Logout'}
      </div>
    </div>
  );
};

export default AdminSide;
