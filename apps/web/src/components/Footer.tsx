import React from 'react';

function Footer() {
  return (
    <div>
      <footer className="bg-zinc-200  dark:bg-gray-900 p-4">
        <div className="w-full max-w-screen-xl mx-auto p-4">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex flex-col text-black text-sm mb-8 lg:mb-0">
              <a
                href="/"
                className="flex items-center sm:mb-0 mb-2 space-x-3 rtl:space-x-reverse"
              >
                <div className="w-32 lg:mb-4">
                  <img
                    src="https://i.ibb.co.com/KF4Y9bZ/ATCASA-1.png"
                    alt="tickzy logo"
                  />
                </div>
              </a>
              <div>Jl. Jenderal Sudirman Kav. 21, Jakarta Selatan </div>
              <div>DKI Jakarta 12930</div>
            </div>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium  text-black no-underline sm:mb-0">
              <li>
                <a
                  href="#"
                  className="hover:underline me-4 md:me-6  text-black no-underline"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline me-4 md:me-6  text-black no-underline"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline me-4 md:me-6  text-black no-underline"
                >
                  Licensing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline  text-black no-underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-zinc-800 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-black no-underline sm:text-center dark:text-gray-400 ">
            © 2024{' '}
            <a
              href="/"
              className=" text-[#3251A5] no-underline font-bold hover:underline"
            >
              Atcasa™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
