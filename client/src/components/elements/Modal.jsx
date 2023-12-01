import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon } from "./SVGIcons";

const modalVariants = {
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeInOut",
      duration: 0.2,
    },
  },
  hide: {
    opacity: 0,
    scale: 0.98,
  },
};

const darkenedScreenVariants = {
  show: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
  hide: {
    opacity: 0,
  },
};

const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

export default function Modal({ modalShow, modalShowSet, onClose, content }) {
  const scrollY = useRef(window.scrollY);
  const modalRef = useRef();

  useEffect(() => {
    if (modalShow) {
      /* 
        For iOS WebKit:
        Set modal position to `absolute` to prevent input re-position bug with 
        `fixed` elements when using virtual keyboard.
      */
      if (isIOS) {
        scrollY.current = window.scrollY;
        setTimeout(() => {
          modalRef.current.style.position = "absolute";
          window.scrollTo(0, 0);
          document.querySelector("html").style.overflowY = "hidden";
        }, 200);
      }

      /* For mobile: Set theme color to match darkened background */
      document
        .getElementsByTagName("meta")
        .namedItem("theme-color")
        .setAttribute("content", "#e5e5e5");
    } else {
      if (isIOS) {
        window.scrollTo(0, scrollY.current);
      }

      document
        .getElementsByTagName("meta")
        .namedItem("theme-color")
        .setAttribute("content", "#ffffff");
    }
  }, [modalShow]);

  return (
    <>
      <AnimatePresence>
        {modalShow && (
          <motion.div
            className="fixed left-0 top-0 z-40 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center"
            variants={darkenedScreenVariants}
            animate={"show"}
            initial={"hide"}
            exit={"hide"}
          ></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modalShow && (
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
                <button
                  className="m-4 rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
                  onClick={() => {
                    modalRef.current.style.position = "fixed";
                    modalShowSet(false);
                    if (onClose) onClose();
                  }}
                >
                  <XMarkIcon className="h-6" />
                </button>
              </div>
              <div className="overflow-y-auto w-full sm:w-auto px-12 sm:px-24 mb-16">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
