import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const checkIconVariants = {
  unchecked: { opacity: 0, pathLength: 0, transition: { duration: 0.1 } },
  checked: { opacity: 1, pathLength: 1, transition: { duration: 0.1 } }
};

function SingleLineInput({ id, name, label, onChange, inputType = "text", autoComplete, acceptSpace = false, defaultValue = "", maxLength = 256 }, ref) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const innerInputRef = useRef();
  const innerLabelRef = useRef();

  useEffect(() => {
    innerInputRef.current.addEventListener("keydown", (e) => {
      if (!acceptSpace && e.which === 32) {
        e.preventDefault();
      }
    });
  }, [innerInputRef, acceptSpace])

  function validateEmailFormat(stringVal) {
    return stringVal.match(/^[^ ]+@[^ ]+\.[a-z]{2,63}$/);
  }

  function validate(checks = inputType) {
    const innerInput = innerInputRef.current;
    const innerLabel = innerLabelRef.current;

    if (checks.includes("required") && !innerInput.value) {
      innerLabel.classList.add("input-invalid-state");
      return false;
    }

    if (checks.includes("email") && !validateEmailFormat(innerInput.value)) {
      innerLabel.classList.add("input-invalid-state");
      return false;
    }

    innerLabel.classList.remove("input-invalid-state");
    return true;
  };

  function setValidationState(isValidated) {
    if (isValidated) {
      innerLabelRef.current.classList.remove("input-invalid-state");
    }
    else {
      innerLabelRef.current.classList.add("input-invalid-state");
    }
  }

  function getValue() {
    return innerInputRef.current.value;
  }

  useImperativeHandle(ref, () => ({
    validate, setValidationState, getValue
  }));

  return (
    <label
      id={id + "Label"}
      htmlFor={id}
      ref={innerLabelRef}
      className="relative flex overflow-hidden rounded-md border px-4 pt-3 focus-within:ring focus-within:ring-blue-200 transition-all"
    >
      <input
        type={isPasswordVisible ? "text" : inputType}
        id={id}
        name={name}
        placeholder={label}
        onChange={(e) => {
          validate(inputType);
          if (onChange) onChange(e);
        }}
        maxLength={maxLength}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        ref={innerInputRef}
        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
      />
      <span
        className="absolute start-4 top-3 -translate-y-1/2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"
      >
        {label}
      </span>
      {inputType === "password" &&
        <div className="w-5">
          <VisibilityToggle id={id + "VisibilityToggle"} isPasswordVisible={isPasswordVisible} setIsPasswordVisible={setIsPasswordVisible} />
        </div>
      }
    </label>
  );
}

function VisibilityToggle({ id, isPasswordVisible, setIsPasswordVisible }) {
  return (
    <label htmlFor={id} className="absolute text-gray-400 hover:bg-gray-100 -translate-y-1/2 -translate-x-1/2 top-1/2 -end-2 h-[32px] w-[32px] flex items-center justify-center cursor-pointer rounded-md transition-all">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={isPasswordVisible}
        onChange={() => setIsPasswordVisible(!isPasswordVisible)}
        className="invisible"
      />
      <div className="pointer-events-none absolute w-4 h-4">
        <motion.svg
          initial="checked"
          animate={!isPasswordVisible ? "checked" : "unchecked"}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="absolute h-full">
          <motion.path
            variants={checkIconVariants}
            strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></motion.path>
        </motion.svg>
        <motion.svg
          initial="unchecked"
          animate={isPasswordVisible ? "checked" : "unchecked"}
          fill="none" stroke="#757575" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="absolute h-full">
          <motion.path
            variants={checkIconVariants}
            strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></motion.path>
          <motion.path
            variants={checkIconVariants}
            strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></motion.path>
        </motion.svg>
      </div>
    </label>
  )
}

export default forwardRef(SingleLineInput)
