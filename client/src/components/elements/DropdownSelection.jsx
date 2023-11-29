import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronIcon } from "./SVGIcons";

function DropdownSelection(
  {
    label,
    selections,
    selection,
    onSelectionChange,
    width = "8.5rem",
    height = "100%",
    showShadow,
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

  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (!event.composedPath().includes(selectionRef.current)) {
        dropdownShowSet(false);
      }
    });
  }, [selectionRef, dropdownShowSet]);

  return (
    selections && (
      <div className="relative w-fit select-none">
        <div
          ref={selectionRef}
          onClick={() => {
            dropdownShowSet(!dropdownShow);
          }}
          className="border bg-white cursor-pointer hover:bg-gray-100 rounded-md text-sm flex items-center focus:ring focus:ring-blue-300 transition-all z-30"
          style={{
            width: width,
            height: height,
            boxShadow: showShadow ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : "",
          }}
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
              <div className="text-left whitespace-nowrap overflow-hidden text-ellipsis text-black absolute bottom-[6.3px] pl-4 pr-8 w-full border-none">
                {selection}
              </div>
              <span className="absolute start-4 top-1/2 text-sm -translate-y-1/2 text-gray-500 transition-all peer-checked:top-3 peer-checked:text-xs peer-focus:top-3 peer-focus:text-xs">
                {label}
              </span>
            </div>
          ) : (
            <div className="w-full text-gray-700 justify-center mr-4 flex items-center">
              <div>{selection}</div>
            </div>
          )}
          <ChevronIcon className="absolute right-0.5 h-3.5 transition-all ease-in-out duration-200 peer-checked:rotate-180 mr-2.5 shrink-0 text-gray-600" />
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
                        onClick={() => {
                          selectionListRef.current.classList.add(
                            "pointer-events-none"
                          );
                          selectionRef.current.classList.remove(
                            "input-invalid-state"
                          );
                          onSelectionChange(selection);
                          dropdownShowSet(false);
                        }}
                        className="px-6 py-1.5 hover:bg-gray-150 transition cursor-pointer whitespace-nowrap"
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
