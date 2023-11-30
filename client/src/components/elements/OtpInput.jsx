import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

function OtpInput({ numOfCharacters = 6, baseName = "otp" }, ref) {
  const [characters, setCharacters] = useState(
    Array.from({ length: numOfCharacters }, () => "")
  );

  const inputRefs = useRef([]);

  const handleChange = (index, event) => {
    const inputCharacter = event.target.value;

    // Allow only alphanumeric input
    if (/^[a-zA-Z0-9]*$/.test(inputCharacter)) {
      const newCharacters = [...characters];
      newCharacters[index] = inputCharacter;
      setCharacters(newCharacters);

      // Move to the next input if a single character is entered
      if (inputCharacter.length === 1) {
        const next = index + 1;
        if (next < numOfCharacters) {
          event.target.form.elements[next].focus();
        }
      }
    }
  };

  const handlePaste = (event) => {
    const clipboardCharacters = event.clipboardData
      .getData("Text")
      .split("")
      .slice(0, 6);
    const newCharacters = Array.from({ length: numOfCharacters }, () => "");
    clipboardCharacters.forEach((char, idx) => {
      newCharacters[idx] = char;
    });
    setCharacters(newCharacters);
  };

  const handleKeyDown = (index, event) => {
    event.target.select(); // select current text for replacement
    if (
      (event.key === "Delete" || event.key === "Backspace") &&
      event.target.value === ""
    ) {
      const prev = index - 1;
      if (prev >= 0) {
        event.target.form.elements[prev].focus();
      }
    } else if (
      (event.key === "Tab" && event.shiftKey) ||
      event.key === "ArrowLeft"
    ) {
      const prev = index - 1;
      if (prev >= 0) {
        event.preventDefault();
        event.target.form.elements[prev].focus();
      }
    } else if (event.key === "Tab" || event.key === "ArrowRight") {
      const next = index + 1;
      if (next < numOfCharacters) {
        event.preventDefault(); // Prevents the default tab behavior
        event.target.form.elements[next].focus();
      }
    }
  };

  const validate = () => {
    let flag = true;

    // Assume that otp is required
    for (let i = 0; i < numOfCharacters; i++) {
      if (inputRefs.current[i].value === "") {
        inputRefs.current[i].classList.add("input-invalid-state");
        flag = false;
      } else {
        inputRefs.current[i].classList.remove("input-invalid-state");
      }
    }

    return flag;
  };

  useImperativeHandle(ref, () => ({
    validate,
    getValue: () => characters.join("").toUpperCase(),
    setValue: (otp) => {
      const newCharacters = otp.split("").slice(0, numOfCharacters);
      setCharacters(newCharacters);
    },
  }));

  return (
    <div id="otp-container" className="flex flex-row gap-x-3">
      {characters.map((character, index) => (
        <input
          ref={(elmt) => (inputRefs.current[index] = elmt)}
          key={index}
          name={`${baseName}${index}`}
          type="text"
          autoComplete="off"
          className="flex-1 text-center w-0 h-12 text-xl border border-gray-300 rounded hover:border-blue-600 transition group focus:outline-none focus:ring focus:ring-blue-200 uppercase hover:bg-gray-50 cursor-pointer font-semibold"
          value={character}
          onInput={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          // Add time out to prevent deselect on mouse up
          onFocus={(e) => setTimeout(() => e.target.select(), 0)}
          onPaste={handlePaste}
          tabIndex={index}
          maxLength={1}
        />
      ))}
    </div>
  );
}

export default forwardRef(OtpInput);
