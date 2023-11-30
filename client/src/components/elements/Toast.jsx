import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon } from "./SVGIcons";
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
export default function Toast({ toastMessage, toastMessageSet }) {
  return (
    <>
      <div className="fixed left-0 top-0 z-20 h-full w-full pointer-events-none flex items-end justify-center">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              variants={variants}
              animate={"show"}
              initial={"hide"}
              exit={"hide"}
            >
              <div className="relative flex justify-between py-4 bg-white rounded-lg h-fit shadow-xl border text-sm text-slate-600 items-center pointer-events-auto mb-12 mx-16">
                <div className="pl-10 pr-16">{toastMessage}</div>
                <button
                  className="absolute right-0 mx-3 p-1 cursor-pointer hover:opacity-50 rounded-full transition-all"
                  onClick={() => toastMessageSet("")}
                >
                  <XMarkIcon className="h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
