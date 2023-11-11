import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  show: {
    opacity: 1,
    scale: 1,
    height: "auto",
    transition: {
      ease: "easeOut",
      duration: 0.4,
      opacity: { delay: 0.15 },
    },
  },
  hide: {
    opacity: 0,
    scale: 0.95,
    height: 0,
  },
};

export default function Accordion({
  sectionName,
  content,
  collapsed = false,
}) {
  const [show, setShow] = useState(!collapsed);

  return (
    <>
      <div className="flex flex-col">
        <div
          className="flex w-fit items-center gap-2.5 mb-4 cursor-pointer hover:opacity-60 transition-all"
          onClick={() => setShow(!show)}
        >
          <input
            name="showToggle"
            type="checkbox"
            className="peer hidden"
            checked={!show}
            readOnly
          />
          <div className="font-medium text-slate-600 peer-checked:opacity-50 text-sm md:text-bas1e">
            {sectionName}
          </div>
          {/* [Credit]: svg from https://heroicons.dev */}
          <svg
            className="text-slate-600 peer-checked:opacity-50 h-3.5 transition-all ease-in-out duration-200 peer-checked:rotate-90"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
              stroke="currentColor"
              strokeWidth="1"
            ></path>
          </svg>
        </div>
        <AnimatePresence initial={false}>
          {" "}
          {show && (
            <motion.div
              variants={variants}
              initial={"hide"}
              animate={"show"}
              exit={"hide"}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
