import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function DropdownMenu({ buttonElement, menuAlignLeft, options }) {
  const buttonRef = useRef();
  const [dropdownShow, dropdownShowSet] = useState(false);
  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (!event.composedPath().includes(buttonRef.current)) {
        dropdownShowSet(false);
      }
    });
  }, [dropdownShowSet, buttonRef]);
  return (
    options && (
      <div className="relative">
        <div
          ref={buttonRef}
          onClick={() => {
            dropdownShowSet(!dropdownShow);
          }}
        >
          {buttonElement}
        </div>
        <AnimatePresence>
          {dropdownShow && (
            <motion.div
              initial={{ opacity: 0, y: "-5%" }}
              animate={{ opacity: 1, y: "0" }}
              exit={{ opacity: 0, y: "-5%" }}
              className={`absolute right-2 mt-2 flex z-30 flex-col bg-white rounded-md shadow-lg text-slate-600 text-sm border divide-y select-none`}
              style={{
                left: menuAlignLeft ? 0 : "auto",
                right: menuAlignLeft ? "auto" : "0.5rem"
              }}
            >
              {options.map((option, idx) => {
                return (
                  <div
                    className="py-2 px-4 whitespace-nowrap hover:bg-gray-100 transition cursor-pointer"
                    onClick={(e) => {
                      option.onClick();
                      dropdownShowSet(false);
                    }}
                    key={idx}
                  >
                    {option.label}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  );
}
