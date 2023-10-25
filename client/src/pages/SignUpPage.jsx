import React, { useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SingleLineInput from "components/elements/SingleLineInput";
import iquizLogo from "media/iquiz_logo.svg";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function SignUpPage() {
  const location = useLocation();
  const { email, userType } = location.state ?? "";

  return (
    <>
      <div className="h-screen w-full flex flex-col justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        <div id="container" className="bg-white h-full sm:h-fit sm:min-h-[40rem] w-full sm:w-fit shadow-lg flex items-center px-12 sm:px-28 mt-24 sm:mt-0 sm:place-self-center py-20 sm:rounded-md">
          {
            userType ?
              <SignUpWindow email={email} userType={userType} />
              :
              <ChooseUserType />
          }
        </div>
      </div>
    </>
  )
}

function ChooseUserType() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-96 flex flex-col">
        <div className="mb-12 flex flex-col gap-2">
          <h1 className="self-start text-3xl font-bold">
            Welcome to <img alt="iquiz! logo" src={iquizLogo} className="h-6 sm:h-6 mx-1 mb-0.5 inline self-baseline"></img>
          </h1>
          <span className="text-sm text-gray-500">
            Please choose your account type
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div
            className="flex flex-col gap-1 cursor-pointer rounded-lg border border-gray-100 bg-white px-8 py-6 drop-shadow-sm hover:border-gray-200 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500 peer-checked:font-medium peer-checked:bg-blue-10 transition-all"
            onClick={() => {
              navigate("", { state: { userType: "student" } })
            }}
          >
            <span className="font-bold text-lg">Student</span>
            <span className="text-xs text-gray-500">Join classes and take quizzes</span>
          </div>
          <div
            className="flex flex-col gap-1 cursor-pointer rounded-lg border border-gray-100 bg-white px-8 py-6 drop-shadow-sm hover:border-gray-200 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500 peer-checked:font-medium peer-checked:bg-blue-10 transition-all"
            onClick={() => {
              navigate("", { state: { userType: "instructor" } })
            }}
          >
            <span className="font-bold text-lg">Instructor</span>
            <span className="text-xs text-gray-500">Create, distribute, and grade quizzes</span>
          </div>
        </div>
      </div>
    </>
  )
}

function SignUpWindow({ email, userType }) {
  const navigate = useNavigate();
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
        alertRef.current.textContent = "Please fill out all fields";
      }
      // Validate email input (inputRefs[2])
      if (idx === 2 && inputElmt.validate("required") && !inputElmt.validate("email")) {
        flag = false;
        alertRef.current.textContent = "Invalid email address format";
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
      alertRef.current.textContent = "Passwords must be at least 8 characters and contain at least one letter and one number";
    }

    // Check passwords match
    else if (inputRefs.current[3].getValue() !== inputRefs.current[4].getValue()) {
      flag = false;
      inputRefs.current[3].setValidationState(false);
      inputRefs.current[4].setValidationState(false);
      alertRef.current.textContent = "Passwords doesn't match";
    }

    // If validation failed, show alert banner and return
    if (!flag) {
      alertRef.current.classList.remove("hidden");
      return;
    }

    // If validation passed, remove alert banner
    alertRef.current.classList.add("hidden");

    // Call Sign Up API
    const formData = new FormData(e.target);

    fetch(new URL("/api/users", baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
        type: userType
      })
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          navigate("/dashboard");
        }
        else {
          alertRef.current.textContent = result.message;
          alertRef.current.classList.remove("hidden");
        }
      })
      .catch((err) => {
        console.error(err);
        alertRef.current.textContent = "Could not connect to the server";
        alertRef.current.classList.remove("hidden");
      })
  }

  return (
    <form onSubmit={onSubmit} className="sm:mt-8 grid grid-cols-6 gap-4 sm:w-96" autoComplete="off" noValidate>
      <div className="col-span-6 mb-4 flex flex-col gap-2">
        <h1 className="self-start text-3xl font-bold">
          Welcome to <img alt="iquiz! logo" src={iquizLogo} className="h-6 sm:h-6 mx-1 mb-0.5 inline self-baseline"></img>
        </h1>
        <span className="text-sm text-gray-500">
          Signing up a{userType === "instructor" && "n"} <span className="font-bold">{userType}</span> account.
          <span className="underline cursor-pointer text-gray-700 ml-2"
            onClick={() => {
              navigate("", { state: { userType: getTheOtherUserType(userType) } })
            }}>I'm a{userType === "student" && "n"} {getTheOtherUserType(userType)}</span>
        </span>
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
  );
}

function getTheOtherUserType(userType) {
  if (userType === "student") return "instructor";
  return "student";
}
