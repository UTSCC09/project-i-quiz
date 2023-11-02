import React from "react";
import { AnimatePresence, motion } from "framer-motion";


const modalVariants = {
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeInOut",
      duration: 0.2
    }
  },
  hide: {
    opacity: 0,
    scale: 0.98,
  }
};

const darkenedScreenVariants = {
  show: {
    opacity: 1,
    transition: { duration: 0.1 }
  },
  hide: {
    opacity: 0,
  }
};

export default function Modal({ modalShow, modalShowSet, content }) {
  return (
    <>
      <AnimatePresence>{modalShow &&
        <motion.div className="fixed z-50 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center" variants={darkenedScreenVariants} animate={"show"} initial={"hide"} exit={"hide"}> </motion.div>}
      </AnimatePresence>
      <AnimatePresence>
        {modalShow &&
          <motion.div className="fixed z-50 w-screen h-screen flex items-center justify-center" variants={modalVariants} animate={"show"} initial={"hide"} exit={"hide"}>
            <div className="relative w-fit h-fit bg-white rounded-lg shadow-lg flex flex-col">
              <button className="m-4 absolute right-0 rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all" onClick={() => modalShowSet(false)}>
                {/* [Credit]: svg from https://heroicons.dev */}
                <svg className="h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"></path>
                </svg>
              </button>
              {content}
            </div>
          </motion.div>}
      </AnimatePresence >

    </>
  );
}
