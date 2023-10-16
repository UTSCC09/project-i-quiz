import React, { useRef } from "react";
import SingleLineInput from "../components/SingleLineInput";
import iquizLogo from "../media/iquiz_logo.svg";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'

export default function SignUpPage() {
  const location = useLocation();
  const { email } = location.state;

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        <SignUpWindow email={email} />
      </div>
    </>
  )
}

function SignUpWindow({ email }) {
  const inputRefs = useRef([]);
  const alertRef = useRef();

  function onSubmit(event) {
    event.preventDefault();
    let flag = true;
    inputRefs.current.forEach((inputElmt, idx) => {
      if (!inputElmt.validate("required")) {
        flag = false;
        alertRef.current.innerHTML = "Please fill out all fields";
      }
      if (idx === 2 && inputElmt.validate("nonempty") && !inputElmt.validate("email")) {
        flag = false;
        alertRef.current.innerHTML = "Invalid email address format";
      }
    })
    if (!flag) {
      alertRef.current.classList.remove("hidden");
      return;
    }
    alertRef.current.classList.add("hidden");
    // TODO: Send request to server
  }

  return (
    <div className="bg-white h-full w-full sm:h-fit sm:w-fit shadow-lg flex flex-col items-center px-12 sm:px-24 mt-24 sm:mt-0 sm:place-self-center py-20 sm:rounded-md">
      <form onSubmit={onSubmit} className="sm:mt-8 grid grid-cols-6 gap-4" autoComplete="off" noValidate>
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
