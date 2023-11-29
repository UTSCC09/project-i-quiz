import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronIcon } from "./SVGIcons";

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
          <ChevronIcon className="text-slate-600 peer-checked:opacity-50 h-3.5 transition-all ease-in-out duration-200 peer-checked:rotate-90" />
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
