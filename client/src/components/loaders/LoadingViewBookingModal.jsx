import React from 'react';

const LoadingViewBookingModal = () => {
    return (
        <div className="flex mx-[2%] text-[1.2em] xl:max-2xl:text-[0.8em] animate-pulse">
          <div className="w-[25%]">
            <div className="my-[1%] bg-gray-300 h-5 rounded"></div>
            <div className="my-[1%] bg-gray-300 h-5 rounded"></div>
            <div className="my-[1%] bg-gray-300 h-5 rounded"></div>
            <div className="my-[1%] bg-gray-300 h-5 rounded"></div>
          </div>
          <div className="w-[25%]">
            <div className="my-[1%] bg-gray-300 h-5 rounded"></div>
            <div className="my-[1%] bg-gray-300 h-5 rounded"></div>
            <div className="my-[1%] bg-gray-300 h-5 rounded"></div>
            <div className="my-[1%] bg-gray-300 h-5 rounded"></div>
          </div>
          {/* Add similar code for other sections as needed */}
        </div>
      );
}

export default LoadingViewBookingModal;