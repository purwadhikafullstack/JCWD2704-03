'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/libs/redux/slices/user.slice';
import { User } from '@/models/user.model';
type Props = {};

export const Header = () => {
  const loggedinUser = useAppSelector((state) => state.auth) as User;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    window.location.reload();
  };

  const loginButton = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push('/auth/login/user');
  };

  const userRegisterButton = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push('/auth/signup/user');
  };

  const tenantRegisterButton = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push('/auth/signup/tenant');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="navbar bg-base-100 ">
        <div className="flex justify-between w-screen px-3 lg:px-10">
          <a href="/">
            <img
              src="https://i.ibb.co.com/Chkyq5g/ATCASA-3.png"
              alt=""
              className="w-36 lg:py-1"
            />
          </a>

          <div className="">
            <div className="flex flex-row gap-4 items-center justify-center">
              {!loggedinUser.first_name && (
                <button
                  className="font-semibold text-sm hidden lg:flex hover:text-[#ED777B] hover:border-b-2"
                  onClick={tenantRegisterButton}
                >
                  Become a property host
                </button>
              )}

              {loggedinUser.first_name && (
                <div className="font-semibold text-sm hidden lg:flex tracking-tight">
                  {`${loggedinUser.first_name} ${loggedinUser.last_name}`}
                </div>
              )}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar w-12"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div className="w-full rounded-full flex items-center justify-center">
                    {loggedinUser.first_name ? (
                      <img
                        src={
                          loggedinUser.image ||
                          'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
                        }
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                        role="presentation"
                        focusable="false"
                        className="w-full h-full"
                      >
                        <path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"></path>
                      </svg>
                    )}
                  </div>
                </div>
                {dropdownOpen && (
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-4 gap-2 shadow"
                    ref={dropdownRef}
                  >
                    {loggedinUser.first_name ? (
                      <>
                        <li>
                          <a className="justify-between">Profile</a>
                        </li>
                        <li>
                          <a>Settings</a>
                        </li>
                        <li>
                          <button onClick={handleLogout}>Logout</button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <button
                            onClick={userRegisterButton}
                            className="font-semibold"
                          >
                            Sign up
                          </button>
                        </li>
                        <li>
                          <button onClick={loginButton}>Log in</button>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
