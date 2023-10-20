import React, { useRef } from "react";
import SingleLineInput from "components/elements/SingleLineInput";
import iquizLogo from "media/iquiz_logo.svg";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'

export default function SignUpPage() {
  const location = useLocation();
  const { email } = location.state ?? "";

  return (
    <>
      <div className="h-screen w-full flex flex-col justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        <SignUpWindow email={email} />
      </div>
    </>
  )
}

function SignUpWindow({ email }) {
  const inputRefs = useRef([]);
  const alertRef = useRef();

  function onSubmit(e) {
    e.preventDefault();

    let flag = true;
    // Check every input field
    inputRefs.current.forEach((inputElmt, idx) => {
      // Validate non-emptiness
      if (!inputElmt.validate("required")) {
        flag = false;
        alertRef.current.innerHTML = "Please fill out all fields";
      }
      // Validate email input (inputRefs[2])
      if (idx === 2 && inputElmt.validate("required") && !inputElmt.validate("email")) {
        flag = false;
        alertRef.current.innerHTML = "Invalid email address format";
      }
    })

    // If the above validation failed, show alert banner and return
    if (!flag) {
      alertRef.current.classList.remove("hidden");
      return;
    }

    // Validate password format
    // (at least 8 characters and contain at least one letter and one number)
    // [Credit]: RegEx from https://stackoverflow.com/a/21456918
    if (!inputRefs.current[3].getValue().match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
      flag = false;
      inputRefs.current[3].setValidationState(false);
      alertRef.current.innerHTML = "Passwords must be at least 8 characters and contain at least one letter and one number";
    }

    // Check passwords match
    else if (inputRefs.current[3].getValue() !== inputRefs.current[4].getValue()) {
      flag = false;
      inputRefs.current[3].setValidationState(false);
      inputRefs.current[4].setValidationState(false);
      alertRef.current.innerHTML = "Passwords doesn't match";
    }

    // If validation failed, show alert banner and return
    if (!flag) {
      alertRef.current.classList.remove("hidden");
      return;
    }

    // If validation passed, remove alert banner
    alertRef.current.classList.add("hidden");
    // TODO: Send request to server
  }

  return (
    <div className="bg-white h-full w-full sm:h-fit sm:w-fit shadow-lg flex flex-col items-center px-12 sm:px-24 mt-24 sm:mt-0 sm:place-self-center py-20 sm:rounded-md">
      <form onSubmit={onSubmit} className="sm:mt-8 grid grid-cols-6 gap-4 sm:w-96" autoComplete="off" noValidate>
        <div className="col-span-6 mb-4">
          <h1 className="self-start text-3xl font-bold">
            Welcome to <img alt="iquiz! logo" src={iquizLogo} className="h-6 sm:h-6 mx-1 mb-0.5 inline self-baseline"></img>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign up with your school email address
          </p>
        </div>
        <div ref={alertRef} className="rounded border-l-4 text-red-700 border-red-500 bg-red-50 p-4 text-sm col-span-6 hidden">
          Please fill out all fields
        </div>
        <div className="col-span-3">
          <SingleLineInput id="firstNameInput" name="firstName" label="First Name" ref={(elmt) => inputRefs.current[0] = elmt} />
        </div>

        <div className="col-span-3">
          <SingleLineInput id="lastNameInput" name="lastName" label="Last Name" ref={(elmt) => inputRefs.current[1] = elmt} />
        </div>

        <div className="col-span-6">
          <SingleLineInput id="emailInput" name="email" label="Email" inputType="email" autoComplete="username" defaultValue={email} ref={(elmt) => inputRefs.current[2] = elmt} />
        </div>

        <div className="col-span-6">
          <SingleLineInput id="passwordInput" name="password" label="Password" inputType="password" autoComplete="new-password" ref={(elmt) => inputRefs.current[3] = elmt} />
        </div>

        <div className="col-span-6">
          <SingleLineInput id="passwordConfirmInput" label="Confirm Password" inputType="password" autoComplete="new-password" ref={(elmt) => inputRefs.current[4] = elmt} />
        </div>

        <div className="mt-4 col-span-full flex flex-col items-center">
          <button className="btn-primary">Create an account</button>
          <p className="mt-4 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-700 underline">Log in</Link>.
          </p>
        </div>
      </form>
    </div>
  );
}
