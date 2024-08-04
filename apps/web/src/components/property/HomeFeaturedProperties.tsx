import React from 'react';
import { BiSolidPlaneAlt } from 'react-icons/bi';

function HomeFeaturedProperties() {
  return (
    <>
      <div>
        <div className="mx-auto tracking-tighter mt-10 flex justify-center max-w-screen-lg px-10 lg:px-0">
          <div className="flex flex-col gap-3">
            {/* POPULAR DESTINATIONS */}
            <div className="flex text-2xl items-center gap-2 justify-start">
              <div>
                <BiSolidPlaneAlt />
              </div>
              <div className="font-semibold">Featured properties</div>
            </div>
            <div className="flex flex-row "></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeFeaturedProperties;
