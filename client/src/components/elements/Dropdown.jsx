import React, { forwardRef, useImperativeHandle, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function Dropdown({ selection, onSelectionChange }, ref) {
  const [showDropdown, setShowDropdown] = useState(false);

  useImperativeHandle(ref, () => ({
    showDropdown, setShowDropdown
  }));

  return (
    <div>
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
        className="text-slate-600 border shadow-sm bg-white hover:bg-gray-100 rounded-lg text-sm w-36 h-10 flex items-center justify-between px-4 focus:ring focus:ring-blue-300 transition"
      >
        {selection}
        <input type="checkbox" className="peer hidden" checked={showDropdown} readOnly />
        <svg className="h-3.5 transition ease-in-out duration-200 peer-checked:rotate-180" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clipRule="evenodd" fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" stroke="currentColor" strokeWidth="1"></path>
        </svg>
      </button>
      <input type="checkbox" className="peer hidden" checked={showDropdown} readOnly />
      <AnimatePresence>{showDropdown &&
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onBlur={() => setShowDropdown(false)}
          className="z-10 absolute mt-2 hidden peer-checked:block bg-white rounded-lg shadow-lg w-36">
          <div className="py-2 text-sm text-gray-700">
            <button onMouseDown={() => { onSelectionChange("New Quizzes") }} className="px-4 py-2 w-full hover:bg-gray-150">New Quizzes</button>
            <button onMouseDown={() => { onSelectionChange("All Quizzes") }} className="px-4 py-2 w-full hover:bg-gray-150">All Quizzes</button>
            <button onMouseDown={() => { onSelectionChange("Past Quizzes") }} className="px-4 py-2 w-full hover:bg-gray-150">Past Quizzes</button>
          </div>
        </motion.div>
      }
      </AnimatePresence>
    </div>
  )
}

export default forwardRef(Dropdown)
