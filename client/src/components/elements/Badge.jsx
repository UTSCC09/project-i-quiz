import React from "react";

export default function Badge({ accentColor, label }) {
  return (
    <>
      <div className="flex mb-1 relative items-center h-fit w-fit px-1.5 font-medium py-0.5 rounded text-xs" style={{ color: accentColor }}>
        {label}
        <div className="absolute w-full h-5 rounded opacity-10 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2" style={{ backgroundColor: accentColor }}></div>
      </div>
    </>
  );
}