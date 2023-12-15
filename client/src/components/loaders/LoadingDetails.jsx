import React from "react";

const LoadingDetails = () => {
    return (
        <div className="bg-white col-span-2 md:col-span-2 border rounded p-4 shadow-lg drop-shadow-lg m-5 w-[55%]">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-4 bg-gray-400 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-400 rounded"></div>
              <div className="h-4 bg-gray-400 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      );      
}

export default LoadingDetails;