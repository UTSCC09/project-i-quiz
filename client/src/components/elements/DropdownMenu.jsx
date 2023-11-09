import { AnimatePresence, motion } from "framer-motion";

export default function DropdownMenu({
  options,
  dropdownShow,
  dropdownShowSet,
}) {
  return (
    options && (
      <>
        <AnimatePresence>
          {dropdownShow && (
            <motion.div
              initial={{ opacity: 0, y: "-5%" }}
              animate={{ opacity: 1, y: "0" }}
              exit={{ opacity: 0, y: "-5%" }}
              className="absolute right-2 sm:-right-1/4 flex z-30 flex-col bg-white rounded-md shadow-lg text-slate-600 text-sm border divide-y select-none"
            >
              {options.map((option, idx) => {
                return (
                  <div
                    className="py-2 px-4 whitespace-nowrap hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => {
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
        {dropdownShow && (
          <div
            className="fixed z-10 left-0 top-0 w-screen h-screen cursor-default"
            onClick={() => dropdownShowSet(false)}
          ></div>
        )}
      </>
    )
  );
}
