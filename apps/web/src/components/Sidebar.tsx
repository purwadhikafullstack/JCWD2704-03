'use client';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaClipboardList } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { IoLogOut, IoPerson } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex">
      <span
        className="sticky lg:hidden text-gray-600 text-4xl cursor-pointer"
        onClick={toggleSidebar}
      >
        <RxHamburgerMenu className="px-2 bg-gray-50 rounded-md" />
      </span>
      <div
        className={`fixed lg:static top-0 bottom-0 lg:flex lg:flex-col p-2 w-[300px] overflow-y-auto text-center bg-gray-900 ${isSidebarOpen ? '' : 'hidden lg:block'}`}
      >
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <img
              src="https://i.ibb.co.com/wz56gwV/ATCASA-2.png"
              alt="Logo"
              width={150}
            />
            <IoMdClose
              className="cursor-pointer ml-auto lg:hidden"
              onClick={toggleSidebar}
            />
          </div>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <FaHouse />
          <span className="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <FaClipboardList />
          <span className="text-[15px] ml-4 text-gray-200 font-bold">
            Orders
          </span>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <IoPerson />
          <span className="text-[15px] ml-4 text-gray-200 font-bold">
            Profile
          </span>
        </div>
        <div className="my-4 bg-gray-600 h-[1px]"></div>

        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <IoLogOut />
          <span className="text-[15px] ml-4 text-gray-200 font-bold">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
