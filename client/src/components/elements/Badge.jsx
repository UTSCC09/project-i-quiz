import React from "react";

export default function Badge({ accentColor = "#0366FF", label }) {
  return (
    <>
      <div
        className="flex relative items-center h-fit w-fit px-1.5 font-medium py-0.5 rounded text-xs shrink-0"
        style={{ color: accentColor }}
      >
        {/* [Credit]: svg from https://codesandbox.io/p/sandbox/framer-motion-checkbox-animation-2cf2jn */}
        {label === "submitted" ? (
          <svg
            className="h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        ) : (
          label
        )}
        <div
          className="absolute w-full h-5 rounded opacity-10 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2"
          style={{ backgroundColor: accentColor }}
        ></div>
      </div>
    </>
  );
}
