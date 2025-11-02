"use client"

import Select from "@/components/form/Select";
import { useModuls } from "@/hooks/useModuls";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function ModulsPagination() {

  const setModulsPage = useModuls((state) => state.setModulsPage);
  const modulsPage = useModuls((state) => state.modulsPage);
  const modulsTotal = useModuls((state) => state.modulsTotal);
  const modulsTake = useModuls((state) => state.modulsTake);
  const setModulsTake = useModuls((state) => state.setModulsTake)

  const options = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
    { value: "40", label: "40" },
    { value: "50", label: "50" },
    { value: "semua", label: "Semua" },
  ]; 

  // Calculate the range being shown based on current page and total
  // If there are no results, show 0 to 0
  const showingStart = modulsTotal === 0 ? 0 : ((modulsPage - 1) * modulsTake) + 1;
  const showingEnd = Math.min(modulsPage * modulsTake, modulsTotal);

  // Build page numbers from total and take. Ensure at least 1 page to avoid empty UI.
  const totalPages = Math.max(1, Math.ceil(modulsTotal / Math.max(1, modulsTake)));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          
          className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/10"
        >
          Previous
        </button>
        <button          
          className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/10"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Tampil <span className="font-medium">{showingStart}</span> - <span className="font-medium">{showingEnd}</span> dari{' '}
            <span className="font-medium">{modulsTotal}</span> data
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md text-gray-400">
            <button
              onClick={() => {
                setModulsPage(modulsPage === 1 ? modulsPage : modulsPage - 1)
              }}
              className="relative inline-flex items-center rounded-l-md px-2 py-2  inset-ring inset-ring-gray-400 hover:bg-white/5 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </button>
            {/* Current: "z-10 text-white focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-500 focus-visible:outline-indigo-500", Default: "inset-ring focus:outline-offset-0 text-gray-200 inset-ring-gray-400 hover:bg-white/5" */}
            {
              pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => {
                    setModulsPage(number);
                  }}

                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${number === modulsPage
                      ? 'z-10 bg-brand-500 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500'
                      : 'text-gray-400 inset-ring inset-ring-gray-400 hover:bg-white/5 focus:z-20 focus:outline-offset-0'
                    }`}
                >
                  {number}
                </button>
              ))
            }

            <button
              onClick={() => {
                setModulsPage(modulsPage === totalPages ? modulsPage : modulsPage + 1)
              }}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-400 hover:bg-white/5 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </button>
          </nav>
        </div>
        <div className="flex flex-row items-center">
          <p className="text-sm text-gray-400 mr-2">
            Data per halaman 
          </p>
          <div className="relative">
              <Select
                options={options}
                
                onChange={(val) => { 

                  setModulsTake(val === "semua"? modulsTotal : Number(val))
                }}
                defaultValue="10"
                className="dark:bg-dark-900 px-2! py-2! pr-10!  field-sizing-content text-sm "
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon size={16} />
              </span>
            </div>
        </div>
      </div>
    </div>
  );
}

