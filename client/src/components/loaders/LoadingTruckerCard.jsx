import React from 'react';

const LoadingTruckerCard = () => {
    return (
      <div className="card bg-white shadow-lg p-4 m-2 rounded-lg grid grid-cols-4 gap-4">
        {/* Logo Column */}
        <div className="md:col-span-1 col-span-4 mr-[2em]">
          <div className="rounded-lg overflow-hidden h-[15em] w-[15em] mr-2 mb-4 border border-darkblue">
            <div className="animate-pulse bg-gray-300 h-full w-full" />
          </div>
        </div>
  
        {/* Contents Column */}
        <div className="col-span-2 mr-[2em]">
          <div className="animate-pulse bg-gray-300 h-8 w-full rounded-lg mb-1" />
          <div className="animate-pulse bg-gray-300 h-4 w-full rounded-lg my-2" />
          <div className="animate-pulse bg-gray-300 h-4 w-full rounded-lg my-2" />
          <div className="animate-pulse bg-gray-300 h-4 w-full rounded-lg my-2" />
          <div className="animate-pulse bg-gray-300 h-[5em] w-full rounded-lg my-2" />
        </div>
  
        {/* Rating, Price, and Buttons Column */}
        <div className="col-span-1 flex flex-col items-end">
          {/* Ratings section */}
          <div className="mb-[5em]">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="animate-pulse bg-gray-300 h-4 w-[40%] rounded-lg" />
                <div className="animate-pulse bg-gray-300 h-4 w-[25%] rounded-lg" />
              </div>
              <div className="bg-gray-300  text-white font-bold rounded-lg p-3">
                <div className="animate-pulse bg-gray-300 h-4 w-[25%] rounded-lg" />
              </div>
            </div>
          </div>
  
          {/* Price and Buttons Section */}
          <div className="animate-pulse bg-gray-300 h-4 w-[50%] rounded-lg mb-2" />
          <div className="flex space-x-2">
            <button className="bg-gray-300 font-medium text-white rounded-md p-2 flex items-center disabled">
              <div className="animate-pulse bg-gray-300 h-4 w-[15%] rounded-lg mr-1" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default LoadingTruckerCard;