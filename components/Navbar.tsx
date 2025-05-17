"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <div className='w-full h-12 shadow-sm bg-white fixed top-0 z-40 flex items-center justify-between px-3'>
      <div className='flex items-center gap-2'>
        <div className='text-gray-700 text-lg cursor-pointer lg:hidden'>
          <FontAwesomeIcon
            onClick={toggleSidebar}
            icon={faBars}
            className="hover:text-blue-500 transition-colors duration-200"
          />
        </div>
        <h1 className='font-semibold text-lg lg:text-xl text-gray-800'>
          TrackMyCash
        </h1>
      </div>
    </div>
  );
};

export default Navbar;