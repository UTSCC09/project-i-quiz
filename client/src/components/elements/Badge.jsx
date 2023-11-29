import React from "react";
import { CheckIcon } from "./SVGIcons";

export default function Badge({ accentColor = "#0366FF", label }) {
  return (
    <>
      <div
        className="flex relative items-center h-fit w-fit px-1.5 font-medium py-0.5 rounded text-xs shrink-0"
        style={{ color: accentColor }}
      >
        {label === "submitted" ? (
          <CheckIcon className="h-3 stroke-[5]" />
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
