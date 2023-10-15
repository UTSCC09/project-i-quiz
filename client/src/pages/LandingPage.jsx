import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components.css";
import logo from "../media/iquiz_logo.svg";
import SingleLineInput from "../components/SingleLineInput";
import SimpleCheckBox from "../components/SimpleCheckBox";

const LandingPage = () => {
  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        <SignInWindow />
      </div>
    </>
  );
}

const SignInWindow = () => {
  const navigate = useNavigate();

  function mockLogin(email, password) {
    if (email === "a@a.aa" && password === "a") {
      return true;
    }
    return false;
  }

  function signInOnSubmitHandler(e) {
    e.preventDefault();
    const email = e.target.emailInput.value;
    const password = e.target.passwordInput.value;

    if (!validateEmailFormat(email)) {
      document.querySelector("#login_error_msg").textContent = "Invalid email address format";
      document.querySelector("#login_error_msg").classList.remove("invisible");
      document.querySelector("#emailInputLabel").classList.add("input-invalid-state");
      return;
    }
    else if (!mockLogin(email, password)) {
      document.querySelector("#login_error_msg").textContent = "Incorrect login credentials";
      document.querySelector("#login_error_msg").classList.remove("invisible");
      document.querySelector("#emailInputLabel").classList.add("input-invalid-state");
      document.querySelector("#passwordInputLabel").classList.add("input-invalid-state");

    }
    else {
      // alert(`email: ${email}\npassword: ${password}`);
      return navigate("/demo")
    }
  }

  function onEmailInputChange(e) {
    if (validateEmailFormat(e.target.value)) {
      document.querySelector("#login_error_msg").classList.add("invisible");
      document.querySelector("#emailInputLabel").classList.remove("input-invalid-state");
    }
  }

  function onPasswordInputChange(e) {
    document.querySelector("#passwordInputLabel").classList.remove("input-invalid-state");
    if (validateEmailFormat(document.querySelector("#emailInput").value)) {
      document.querySelector("#login_error_msg").classList.add("invisible");
      document.querySelector("#emailInputLabel").classList.remove("input-invalid-state");
    }
  }

  function validateEmailFormat(stringVal) {
    return stringVal.match(/^[^ ]+@[^ ]+\.[a-z]{2,63}$/);
  }

  return (
    <>
      <div
        className="flex sm:items-center px-12 sm:px-14 py-20 lg:ml-[40vw] bg-white border border-gray-100 rounded-md shadow-lg mt-24 sm:mt-0 h-full sm:h-fit w-full sm:w-[26rem] justify-center"
      >
        <div className="flex flex-col justify-start w-full">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">
              <span>
                Sign in to begin <br />your{" "}
                <img src={logo} alt="iQuiz! Logo" className="h-5 mx-1 mb-1 inline self-baseline"></img>
                {" "}experience
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <span>Or create a new account with us today!</span>
            </div>
          </div>
          <form className="flex flex-col mt-3 " onSubmit={(e) => signInOnSubmitHandler(e)}>
            <span id="login_error_msg" className="text-red-500 text-sm mb-1 pl-1 invisible">placeholder</span>
            <div className="flex flex-col gap-3">
              <SingleLineInput
                id="emailInput" name="email" label="Email" onChange={onEmailInputChange} />
              <SingleLineInput
                id="passwordInput" name="password" inputType="password" onChange={onPasswordInputChange} label="Password" />
              <SimpleCheckBox id="checkboxRemember" name="checkboxRemember" label="Remember me" />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
              <button type="submit" className="btn-primary">Log in</button>
              <a className="btn-secondary" href="/signup">Sign up</a>
            </div>
            <span className="text-sm text-gray-500 mt-4 self-center pr-1">Can't remember password? <a className="underline" href="/">Reset</a></span>
          </form>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
