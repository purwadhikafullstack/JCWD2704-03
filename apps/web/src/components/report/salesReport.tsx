import { useState } from 'react';

const SalesReport = () => {
  const [open, setOpen] = useState(true);

  return (
    <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600 min-h-screen">
      <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
        <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-gray-200">
          <header className="px-5 py-4 border-b border-gray-100 flex items-center">
            <h2 className="font-semibold text-gray-800">Analytics</h2>
          </header>
          <div className="px-5 py-1">
            <div className="flex flex-wrap">
              <div className="flex items-center py-2">
                <div className="mr-5">
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-gray-800 mr-2">
                      24.7K
                    </div>
                    <div className="text-sm font-medium text-green-500">
                      +49%
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Unique Visitors</div>
                </div>
                <div
                  className="hidden md:block w-px h-8 bg-gray-200 mr-5"
                  aria-hidden="true"
                ></div>
              </div>
              <div className="flex items-center py-2">
                <div className="mr-5">
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-gray-800 mr-2">
                      56.9K
                    </div>
                    <div className="text-sm font-medium text-green-500">
                      +7%
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Total Pageviews</div>
                </div>
                <div
                  className="hidden md:block w-px h-8 bg-gray-200 mr-5"
                  aria-hidden="true"
                ></div>
              </div>
              <div className="flex items-center py-2">
                <div className="mr-5">
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-gray-800 mr-2">
                      54%
                    </div>
                    <div className="text-sm font-medium text-yellow-500">
                      -7%
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Bounce Rate</div>
                </div>
                <div
                  className="hidden md:block w-px h-8 bg-gray-200 mr-5"
                  aria-hidden="true"
                ></div>
              </div>
              <div className="flex items-center">
                <div>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-gray-800 mr-2">
                      2m 56s
                    </div>
                    <div className="text-sm font-medium text-yellow-500">
                      +7%
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">Visit Duration</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <canvas id="analytics-card-01" width="800" height="300"></canvas>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-60">
          <div className="bg-gray-800 text-gray-50 text-sm p-3 md:rounded shadow-lg flex justify-between">
            <div>
              👉{' '}
              <a
                className="hover:underline ml-1"
                href="https://cruip.com/mosaic/?ref=codepen-cruip-analytics"
                target="_blank"
                rel="noopener noreferrer"
              >
                More components on Cruip.com
              </a>
            </div>
            <div
              className="text-gray-500 hover:text-gray-400 ml-5"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-4 h-4 flex-shrink-0 fill-current"
                viewBox="0 0 16 16"
              >
                <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SalesReport;
