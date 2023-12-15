import React from 'react';

const LoadingBar = () => (
  <div className="w-full float-left">
    <div className='w-full rounded animate-pulse'>
        <div className='w-full'>
            <div className='h-[50px] border border-black bg-gray-300 rounded-lg dark:bg-gray-600 w-full mb-[20px]'></div>
        </div>
    </div>
  </div>
);

export default LoadingBar;