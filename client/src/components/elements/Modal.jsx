import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon } from "./SVGIcons";


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

export default function Modal({ modalShow, modalShowSet, onClose, content }) {
  return (
    <>
      <AnimatePresence>{modalShow &&
        <motion.div className="fixed left-0 top-0 z-40 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center" variants={darkenedScreenVariants} animate={"show"} initial={"hide"} exit={"hide"}> </motion.div>}
      </AnimatePresence>
      <AnimatePresence>
        {modalShow &&
          <motion.div className="fixed left-0 top-0 z-50 w-screen h-screen flex items-center justify-center" variants={modalVariants} animate={"show"} initial={"hide"} exit={"hide"}>
            <div className="relative max-h-screen h-full sm:h-fit w-full sm:w-fit bg-white sm:rounded-lg mt-24 sm:mt-0 shadow-lg flex flex-col items-center">
              <div className="w-full flex justify-end">
                <button
                  className="m-4 rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
                  onClick={() => {
                    modalShowSet(false);
                    if (onClose) onClose();
                  }}
                >
                  <XMarkIcon className="h-6" />
                </button>
              </div>
              <div className="overflow-y-auto px-12 sm:px-24 pb-16">{content}</div>
            </div>
          </motion.div>}
      </AnimatePresence >

    </>
  );
}
