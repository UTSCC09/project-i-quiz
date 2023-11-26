import React, { useEffect, useRef } from "react";
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

const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

export default function Modal({ modalShow, modalShowSet, onClose, content }) {
  const scrollY = useRef(window.scrollY);
  const modalRef = useRef();

  /* 
    For iOS WebKit:
    Set modal position to `absolute` to prevent input re-position bug with 
    `fixed` elements when using virtual keyboard.
  */
  useEffect(() => {
    if (modalShow && isIOS) {
      scrollY.current = window.scrollY;
      setTimeout(() => {
        modalRef.current.style.position = "absolute";
        window.scrollTo(0, 0);
        document.querySelector("html").style.overflowY = "hidden";
      }, 200);
    }
  }, [modalShow, modalRef.current])

  return (
    <>
      <AnimatePresence>{modalShow &&
        <motion.div className="fixed left-0 top-0 z-40 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center" variants={darkenedScreenVariants} animate={"show"} initial={"hide"} exit={"hide"}> </motion.div>}
      </AnimatePresence>
      <AnimatePresence>
        {modalShow &&
          <motion.div
            ref={modalRef}
            className="fixed left-0 top-0 z-50 w-full h-screen flex sm:items-center justify-center overflow-y-hidden"
            variants={modalVariants}
            animate={"show"}
            initial={"hide"}
            exit={"hide"}
          >
            <div className="relative mt-12 sm:mt-0 h-screen sm:h-fit w-full sm:w-fit bg-white sm:rounded-lg sm:shadow-lg flex flex-col items-center">
              <div className="w-full flex justify-end">
                <button className="m-4 rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all" onClick={() => {
                  if (isIOS) {
                    modalRef.current.style.position = "fixed";
                    window.scrollTo(0, scrollY.current);
                  }
                  modalShowSet(false);
                  if (onClose) onClose();
                }}>
                  {/* [Credit]: svg from https://heroicons.dev */}
                  <svg className="h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"></path>
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto px-12 sm:px-24 mb-16">
                {content}
              </div>
            </div>
          </motion.div>}
      </AnimatePresence >

    </>
  );
}
