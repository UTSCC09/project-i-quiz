import React from "react";
import SingleLineInput from "../components/SingleLineInput";
import iquizLogo from "../media/iquiz_logo.svg";

export default function SignUpPage() {
  return (
    <>
      <div className="relative h-screen w-screen flex flex-col justify-center items-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')]">
        <SignUpWindow />
      </div>
    </>
  )
}

function SignUpWindow() {
  return (
    <div className="bg-white h-fit shadow-lg flex flex-col items-center px-16 sm:px-24 py-16 sm:py-20 rounded-md">
      <form action="#" className="mt-8 grid grid-cols-6 gap-4">
        <div className="col-span-6 mb-4">
          <h1 className="mt-6 self-start text-2xl sm:text-3xl font-bold">
            Welcome to <img alt="iquiz! logo" src={iquizLogo} className="h-5 sm:h-6 mx-1 mb-0.5 inline self-baseline" fill="#FFFFFF"></img>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign up with your school email address
          </p>
        </div>

        <div className="col-span-6 sm:col-span-3">
          <SingleLineInput id="firstNameInput" name="firstName" label="First Name" />
        </div>

        <div className="col-span-6 sm:col-span-3">
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

        <div className="mt-4 col-span-full flex flex-col sm:flex sm:items-center">
          <button className="btn-primary">Create an account</button>
          <p className="mt-4 text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-gray-700 underline">Log in</a>.
          </p>
        </div>
      </form>
    </div>
  );
}
