'use client';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaClipboardList } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { IoLogOut, IoPerson } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import { logout } from '@/libs/redux/slices/user.slice';
import { useAppDispatch } from '@/app/hooks';
import { useRouter } from 'next/navigation';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    window.location.reload();
  };
  const handleHome = () => {
    router.push('/');
  };
  const handleProfile = () => {
    router.push('/profile');
  };
  const handleEditProfile = () => {
    router.push('/profile/settings');
  };
  const handleMyOrders = () => {
    router.push('/profile/my-order');
  };
  return (
    <div className="flex z-50 tracking-tighter">
      <span
        className="sticky lg:hidden text-gray-600 text-4xl cursor-pointer"
        onClick={toggleSidebar}
      >
        <RxHamburgerMenu className="px-2 bg-gray-50 rounded-md" />
      </span>
      <div
        className={`fixed lg:static top-0 bottom-0 lg:flex lg:flex-col p-2 w-[300px] overflow-y-auto text-center bg-zinc-100 ${isSidebarOpen ? '' : 'hidden lg:block'}`}
      >
        <div className=" text-xl">
          <div className="p-3 mt-2 flex items-center">
            <img src="https://i.imgur.com/rWDq04n.png" alt="Logo" width={150} />
            <IoMdClose
              className="cursor-pointer ml-auto lg:hidden"
              onClick={toggleSidebar}
            />
          </div>
        </div>
        <hr />

        <div
          onClick={handleHome}
          className="p-2.5 mt-3 flex items-center rounded-full px-4 duration-300 cursor-pointer hover:bg-zinc-300 text-black"
        >
          <div className="text-xl">
            <FaHouse />
          </div>
          <span className="text-[15px] ml-4 font-semibold text-black hover:text-white ">
            Home
          </span>
        </div>

        <div className="p-2.5 mt-3 flex items-center rounded-full px-4 duration-300 cursor-pointer  hover:bg-zinc-300  text-black">
          <div className="text-xl">
            <FaClipboardList />
          </div>
          <span
            onClick={handleMyOrders}
            className="text-[15px] ml-4 text-black font-semibold"
          >
            Reservation history
          </span>
        </div>

        <div
          className="p-2.5 mt-3 flex items-center rounded-full px-4 duration-300 cursor-pointer  hover:bg-zinc-300  text-black"
          onClick={handleEditProfile}
        >
          <div className="text-xl">
            <IoPerson />
          </div>
          <span className="text-[15px] ml-4 text-black font-semibold">
            Profile settings
          </span>
        </div>

        <div
          className="p-2.5 mt-3 flex items-center rounded-full px-4 duration-300 cursor-pointer  hover:bg-zinc-300  text-black"
          onClick={handleLogout}
        >
          {' '}
          <div className="text-xl">
            <IoLogOut />
          </div>
          <span className="text-[15px] ml-4 text-black font-semibold">
            Log out
          </span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
