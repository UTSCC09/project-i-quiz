import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

function DropdownSelection(
  {
    label,
    selections,
    selection,
    onSelectionChange,
    width = "8.5rem",
    height = "100%",
  },
  ref
) {
  const [dropdownShow, dropdownShowSet] = useState(false);
  const selectionRef = useRef();
  const selectionListRef = useRef();

  function validate() {
    if (selection) {
      selectionRef.current.classList.remove("input-invalid-state");
      return true;
    }
    selectionRef.current.classList.add("input-invalid-state");
    return false;
  }

  useImperativeHandle(ref, () => ({
    dropdownShow,
    dropdownShowSet,
    validate,
  }));

  return (
    selections && (
      <div className="relative w-fit select-none">
        <div
          ref={selectionRef}
          onClick={() => {
            dropdownShowSet(!dropdownShow);
          }}
          className="text-slate-500 border bg-white cursor-pointer hover:bg-gray-100 rounded-md text-sm flex items-center focus:ring focus:ring-blue-300 transition-all z-30"
          style={{ width: width, height: height }}
        >
          <input
            type="checkbox"
            className="peer hidden"
            checked={dropdownShow}
            readOnly
          />
          {label ? (
            <div>
              <input
                type="checkbox"
                className="peer hidden"
                checked={selection || dropdownShow}
                readOnly
              />
              <div className="text-left text-black absolute bottom-[6.3px] pl-4 w-full border-none">
                {selection}
              </div>
              <span className="absolute start-4 top-1/2 text-sm -translate-y-1/2 text-gray-500 transition-all peer-checked:top-3 peer-checked:text-xs peer-focus:top-3 peer-focus:text-xs">
                {label}
              </span>
            </div>
          ) : (
            <div className="w-full text-center mr-4 py-3">{selection}</div>
          )}
          {/* [Credit]: svg from https://heroicons.dev */}
          <svg
            className="absolute right-0.5 h-3.5 transition-all ease-in-out duration-200 peer-checked:rotate-180 mr-2.5 shrink-0"
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
              opacity="0.8"
            ></path>
          </svg>
        </div>
        <input
          type="checkbox"
          className="peer hidden"
          checked={dropdownShow}
          readOnly
        />
        <div className="absolute z-30 left-1/2 -translate-x-1/2">
          <AnimatePresence>
            {dropdownShow && (
              <motion.div
                initial={{ opacity: 0, y: "-5%" }}
                animate={{ opacity: 1, y: "0" }}
                exit={{ opacity: 0, y: "-5%" }}
                className="mt-2.5 bg-white rounded-lg shadow-lg border"
              >
                <div
                  ref={selectionListRef}
                  className="py-2 text-sm text-gray-600 flex flex-col"
                >
                  {selections.map((selection, idx) => {
                    return (
                      <div
                        onMouseDown={() => {
                          selectionListRef.current.classList.add(
                            "pointer-events-none"
                          );
                          selectionRef.current.classList.remove(
                            "input-invalid-state"
                          );
                          onSelectionChange(selection);
                          dropdownShowSet(false);
                        }}
                        className="px-6 py-2 hover:bg-gray-150 transition cursor-pointer whitespace-nowrap"
                        key={idx}
                      >
                        {selection}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  );
}

export default forwardRef(DropdownSelection);
