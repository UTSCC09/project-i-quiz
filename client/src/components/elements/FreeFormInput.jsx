import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const checkIconVariants = {
  unchecked: { opacity: 0, pathLength: 0, transition: { duration: 0.1 } },
  checked: { opacity: 1, pathLength: 1, transition: { duration: 0.1 } },
};

function FreeFormInput(
  {
    id,
    name,
    label,
    onChange,
    defaultValue = "",
    //maxLength = 256,
  },
  ref
) {
  const innerTextAreaRef = useRef();
  const innerLabelRef = useRef();

  useEffect(() => {
    innerTextAreaRef.current.addEventListener("keydown", (e) => {
      /* Ignore minus key when input type is number */
      if (e.which === 189) {
        e.preventDefault();
      }
    });
  }, [innerTextAreaRef]);

  function validate() {
    const innerTextArea = innerTextAreaRef.current;
    const innerLabel = innerLabelRef.current;

    if (!innerTextArea.value) {
      innerLabel.classList.add("input-invalid-state");
      return false;
    }

    innerLabel.classList.remove("input-invalid-state");
    return true;
  }

  function setValidationState(isValidated) {
    if (isValidated) {
      innerLabelRef.current.classList.remove("input-invalid-state");
    } else {
      innerLabelRef.current.classList.add("input-invalid-state");
    }
  }

  function getValue() {
    return innerTextAreaRef.current.value;
  }

  function setValue(newVal) {
    innerTextAreaRef.current.value = newVal;
  }

  useImperativeHandle(ref, () => ({
    validate,
    setValidationState,
    getValue,
    setValue,
  }));

  const handleChange = (e) => {
    e.preventDefault();
    const newValue = e.target.value;
    if (ref.current) {
      ref.current.setValue(newValue);
    }
    if (onChange) { // Additonal onChange handlers
      onChange(e);
    }
  };

  return (
    <label
      id={id + "Label"}
      htmlFor={id}
      ref={innerLabelRef}
      className="relative flex overflow-hidden rounded-md border px-4 pt-3 focus-within:ring focus-within:ring-blue-200 transition-all"
    >
      <textarea
        id={id}
        name={name}
        placeholder={label}
        onChange={handleChange} // Update the ref value when input changes
        /* maxLength={maxLength} */
        defaultValue={defaultValue}
        className="peer w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
        ref={innerTextAreaRef}
      />
      <span className="absolute start-4 top-3 -translate-y-1/2 text-xs text-gray-500 transition-all peer-autofill:top-3 peer-autofill:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
        {label}
      </span>
    </label>
  );
}

export default forwardRef(FreeFormInput);
