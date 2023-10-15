import React from "react";
import SingleLineInput from "../components/SingleLineInput";
import iquizLogo from "../media/iquiz_logo.svg";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        <SignUpWindow />
      </div>
    </>
  )
}

function SignUpWindow() {
  return (
    <div className="bg-white h-full w-full sm:h-fit sm:w-fit shadow-lg flex flex-col items-center px-12 sm:px-24 mt-24 sm:mt-0 sm:place-self-center py-20 sm:rounded-md">
      <form action="#" className="sm:mt-8 grid grid-cols-6 gap-4">
        <div className="col-span-6 mb-4">
          <h1 className="self-start text-3xl font-bold">
            Welcome to <img alt="iquiz! logo" src={iquizLogo} className="h-6 sm:h-6 mx-1 mb-0.5 inline self-baseline"></img>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign up with your school email address
          </p>
        </div>

        <div className="col-span-3 sm:col-span-3">
          <SingleLineInput id="firstNameInput" name="firstName" label="First Name" />
        </div>

        <div className="col-span-3 sm:col-span-3">
          <SingleLineInput id="lastNameInput" name="lastName" label="Last Name" />
        </div>

        <div className="col-span-6">
          <SingleLineInput id="emailInput" name="email" label="Email" />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <SingleLineInput id="passwordInput" name="password" label="Password" inputType="password" />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <SingleLineInput id="passwordConfirmInput" label="Confirm Password" inputType="password" />
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
