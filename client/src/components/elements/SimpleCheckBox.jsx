import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const checkIconVariants = {
  unchecked: { pathLength: 0, opacity: 0, transition: { duration: 0.1 } },
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.2, delay: 0.05 },
  },
};

export default function SimpleCheckBox({
  id,
  name,
  label,
  isChecked,
  isCheckedSet,
}) {
  function toggleIsChecked() {
    isCheckedSet(!isChecked);
  }
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer text-sm text-gray-500"
    >
      <div className="relative flex items-center w-fit">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={isChecked}
          onChange={toggleIsChecked}
          className="border-blue-gray-200 relative h-4 w-4 cursor-pointer appearance-none rounded-md border transition-all duration-100 checked:border-blue-500 checked:bg-blue-500"
        />
        <div className="absolute pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
          <AnimatePresence initial={false}>
            {/* [Credit]: svg from https://codesandbox.io/p/sandbox/framer-motion-checkbox-animation-2cf2jn */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="5"
              stroke="currentColor"
              className="h-2.5 w-2.5"
              initial={"unchecked"}
              animate={isChecked ? "checked" : "unchecked"}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
                variants={checkIconVariants}
              />
            </motion.svg>
          </AnimatePresence>
        </div>
      </div>
      {label}
    </label>
  );
}
