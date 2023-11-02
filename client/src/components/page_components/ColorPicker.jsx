import React from "react";
import colors from "tailwindcss/colors";
import { motion } from "framer-motion";

const checkIconVariants = {
  unchecked: { pathLength: 0, opacity: 0, transition: { duration: 0.1 } },
  checked: { pathLength: 1, opacity: 1, transition: { duration: 0.2 } }
};

const colorList = [colors.pink[500], colors.rose[500], colors.red[500], colors.orange[500], colors.amber[500], colors.yellow[500], colors.lime[500], colors.green[500], colors.emerald[500], colors.teal[500], colors.cyan[500], colors.blue[500], colors.blue[600], colors.indigo[500], colors.violet[500], colors.purple[500]]

export default function ColorPicker({ colorPicked, colorPickedSet }) {
  return (
    <div className="flex flex-wrap gap-[13.7px] w-full my-4">
      {colorList.map((color, idx) => {
        return <div onClick={() => colorPickedSet(color)} key={idx}>
          <div className="h-9 w-9 rounded-full cursor-pointer hover:border-4 border-black border-opacity-10 transition-all flex justify-center items-center" style={{ backgroundColor: color }}>
            {/* [Credit]: svg from https://codesandbox.io/p/sandbox/framer-motion-checkbox-animation-2cf2jn */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="4"
              stroke="currentColor"
              className="h-4 opacity-30"
              animate={colorPicked == color ? "checked" : "unchecked"}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
                variants={checkIconVariants}
              />
            </motion.svg>
          </div>
        </div>
      })}
    </div>
  )
}
