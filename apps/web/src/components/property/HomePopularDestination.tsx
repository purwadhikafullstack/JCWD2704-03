import React from 'react';
import Link from 'next/link';
import { BiSolidPlaneAlt } from 'react-icons/bi';

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayDate = getTodayDate();
const tomorrowDate = getTomorrowDate();

function HomePopularDestination() {
  return (
    <div className="mx-auto tracking-tighter mt-10 flex justify-center max-w-screen-lg px-10 lg:px-0">
      <div className="flex flex-col gap-3">
        {/* POPULAR DESTINATIONS */}
        <div className="flex text-2xl items-center gap-2 justify-start">
          <div>
            <BiSolidPlaneAlt />
          </div>
          <div className="font-semibold">
            Rediscover yourself in our popular destinations
          </div>
        </div>
        <div className="relative overflow-x-auto ">
          <div className="flex flex-row gap-4 flex-nowrap justify-start md:flex-wrap max-w-sm lg:max-w-screen-lg">
            {/* BALI */}
            <Link
              href={`/search?city=Denpasar,%20Denpasar%20City,%20Bali,%20Indonesia&checkIn=${todayDate}&checkOut=${tomorrowDate}&page=1`}
            >
              <div className="relative w-80 h-60 overflow-hidden rounded-xl">
                <img
                  className="h-full w-full rounded-xl object-cover object-center"
                  src="https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Featured"
                />

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10">
                  <div className="text-lg font-medium text-white md:text-2xl">
                    Bali
                  </div>
                  <div className="text-xs text-white md:text-sm">
                    Enjoy an unforgettable vacation in Bali&apos;s beachfront
                    villas
                  </div>
                </div>
              </div>
            </Link>

            {/* JAKARTA */}
            <Link
              href={`/search?city=Jakarta,%20Indonesia&checkIn=${todayDate}&checkOut=${tomorrowDate}&page=1`}
            >
              <div className="relative w-80 h-60 overflow-hidden rounded-xl">
                <img
                  className="h-full w-full rounded-xl object-cover object-center"
                  src="https://images.unsplash.com/photo-1718729362445-51d2da1ee7a7?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Featured"
                />

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10">
                  <div className="text-lg font-medium text-white md:text-2xl">
                    Jakarta
                  </div>
                  <div className="text-xs text-white md:text-sm">
                    Luxury in the heart of the city with stunning views
                  </div>
                </div>
              </div>
            </Link>

            {/* YOGYAKARTA */}
            <Link
              href={`/search?city=Yogyakarta,%20Yogyakarta%20City,%20Special%20Region%20of%20Yogyakarta,%20Indonesia&checkIn=${todayDate}&checkOut=${tomorrowDate}&page=1`}
            >
              <div className="relative w-80 h-60 overflow-hidden rounded-xl">
                <img
                  className="h-full w-full rounded-xl object-cover object-center"
                  src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Featured"
                />

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10">
                  <div className="text-lg font-medium text-white md:text-2xl">
                    Yogyakarta
                  </div>
                  <div className="text-xs text-white md:text-sm">
                    Discover the serene ambiance and rich heritage of Yogyakarta
                  </div>
                </div>
              </div>
            </Link>

            {/* MALANG */}
            <Link
              href={`/search?city=Malang,%20Malang%20City,%20East%20Java,%20Indonesia&checkIn=${todayDate}&checkOut=${tomorrowDate}&page=1`}
            >
              <div className="relative w-80 h-60 overflow-hidden rounded-xl">
                <img
                  className="h-full w-full rounded-xl object-cover object-center"
                  src="https://images.unsplash.com/photo-1637292872273-1fc99340ac04?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Featured"
                />

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10">
                  <div className="text-lg font-medium text-white md:text-2xl">
                    Malang
                  </div>
                  <div className="text-xs text-white md:text-sm">
                    Experience a picturesque landscape and mild climate
                  </div>
                </div>
              </div>
            </Link>

            {/* BANDUNG */}
            <Link
              href={`/search?city=Bandung,%20Bandung%20City,%20West%20Java,%20Indonesia&checkIn=${todayDate}&checkOut=${tomorrowDate}&page=1`}
            >
              <div className="relative w-80 h-60 overflow-hidden rounded-xl">
                <img
                  className="h-full w-full rounded-xl object-cover object-center"
                  src="https://images.unsplash.com/photo-1683471619890-fb7e51c3201c?q=80&w=3348&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Featured"
                />

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10">
                  <div className="text-lg font-medium text-white md:text-2xl">
                    Bandung
                  </div>
                  <div className="text-xs text-white md:text-sm">
                    Escape to Bandung&apos;s cooler climate and lush landscapes
                  </div>
                </div>
              </div>
            </Link>

            {/* LOMBOK */}
            <Link
              href={`/search?city=Lombok,%20Kec.%20Pringgabaya,%20Kabupaten%20Lombok%20Timur,%20Nusa%20Tenggara%20Bar.,%20Indonesia&checkIn=${todayDate}&checkOut=${tomorrowDate}&page=1`}
            >
              <div className="relative w-80 h-60 overflow-hidden rounded-xl">
                <img
                  className="h-full w-full rounded-xl object-cover object-center"
                  src="https://images.unsplash.com/photo-1610944374019-3d52a51d6e7a?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Featured"
                />

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10">
                  <div className="text-lg font-medium text-white md:text-2xl">
                    Lombok
                  </div>
                  <div className="text-xs text-white md:text-sm">
                    Explore beautiful beaches and serene countryside
                  </div>
                </div>
              </div>
            </Link>
            {/* Add other links similarly */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePopularDestination;
