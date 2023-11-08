import React from "react";
import { AnimatePresence, motion } from "framer-motion";
const variants = {
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeInOut",
      duration: 0.1,
    },
  },
  hide: {
    opacity: 0,
    scale: 0.95,
  },
};
export default function Toast({
  toastMessage,
  toastMessageSet,
  timeout = 5000,
}) {
  setTimeout(() => {
    toastMessageSet(null);
  }, timeout);
  return (
    <>
      <div className="fixed left-0 top-0 z-20 h-screen w-screen pointer-events-none flex items-end justify-center">
        <AnimatePresence>
          {" "}
          {toastMessage && (
            <motion.div
              variants={variants}
              animate={"show"}
              initial={"hide"}
              exit={"hide"}
            >
              <div className="relative flex justify-between py-4 bg-white rounded-lg h-fit shadow-lg shadow-gray-200 border text-sm text-slate-600 items-center pointer-events-auto mb-12">
                <div className="pl-10 pr-16">{toastMessage}</div>
                <button
                  className="absolute right-0 mx-3 p-1 cursor-pointer hover:opacity-50 rounded-full transition-all"
                  onClick={() => toastMessageSet("")}
                >
                  {/* [Credit]: svg from https://heroicons.dev */}
                  <svg
                    className="h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    ></path>
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
