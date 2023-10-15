import { EyeIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function SingleLineInput({ id, name, label, onChange, inputType = "text" }) {
  return (
    <label
      id={id + "Label"}
      htmlFor={id}
      className={"relative block overflow-hidden rounded-md border px-4 pt-3  focus-within:ring focus-within:ring-blue-200 transition"}
    >
      {(inputType === "password") &&
        <EyeIcon className="h-5 absolute stroke-gray-400 end-4" />
      }
      <input
        type={inputType}
        id={id}
        name={name}
        placeholder={label}
        onChange={onChange}
        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
      />
      <span
        className="absolute start-4 top-3 -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
      >
        {label}
      </span>
    </label>
  );
}