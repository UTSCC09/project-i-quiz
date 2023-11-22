import React, { useRef, useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import "styles/components.css";
import logo from "media/iquiz_logo.svg";
import Toast from "components/elements/Toast";
import SingleLineInput from "components/elements/SingleLineInput";
import SimpleCheckBox from "components/elements/SimpleCheckBox";
import { getUserCookie } from "utils/CookieUtils";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [toastMessage, toastMessageSet] = useState("");

  const toastMessageShow = (successMessage) => {
    toastMessageSet(successMessage);
    setTimeout(() => {
      toastMessageSet("");
    }, 3000);
  };

  useEffect(() => {
    const { passInMessage } = location.state ?? "";
    if (passInMessage) {
      toastMessageShow(passInMessage);
      navigate("", {});
      setTimeout(() => {
        toastMessageSet();
      }, 3000);
    }
  });

  return !getUserCookie() ? (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <div className="h-screen w-full flex flex-col items-center justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        <SignInWindow />
      </div>
    </>
  ) : (
    <Navigate to="/" />
  );
};

const SignInWindow = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const errorMessageRef = useRef();
  const [rememberToggle, rememberToggleSet] = useState(false);

  function onAuthFormSubmitHandler(e) {
    e.preventDefault();

    // Validate email address format
    if (!emailInputRef.current.validate()) {
      errorMessageRef.current.textContent = "Invalid email address format";
      errorMessageRef.current.classList.remove("hidden");
      return;
    }

    // Login
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          navigate("/home");
        } else {
          errorMessageRef.current.textContent = result.message;
          errorMessageRef.current.classList.remove("hidden");
          emailInputRef.current.setValidationState(false);
          passwordInputRef.current.setValidationState(false);
        }
      })
      .catch((err) => {
        console.error(err);
        errorMessageRef.current.textContent =
          "Could not connect to the server";
        errorMessageRef.current.classList.remove("hidden");
      });
  }

  return (
    <>
      <div className="flex sm:items-center px-12 sm:px-20 py-28 lg:ml-[40vw] bg-white border border-gray-100 sm:rounded-md shadow-lg mt-24 sm:mt-0 h-full sm:h-fit w-full sm:w-[28rem] justify-center">
        <div className="flex flex-col justify-start w-full">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">
              <span>
                Sign in to begin <br />
                your{" "}
                <Link to="/">
                  <img
                    src={logo}
                    alt="iQuiz! Logo"
                    className="h-5 mx-1 mb-1 inline self-baseline"
                  />
                </Link>{" "}
                experience
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <span>Or create a new account with us today!</span>
            </div>
          </div>
          <form
            className="flex flex-col mt-4"
            onSubmit={(e) => onAuthFormSubmitHandler(e)}
            noValidate
          >
            <div
              ref={errorMessageRef}
              className="rounded border-l-4 text-red-700 border-red-500 bg-red-50 p-4 text-sm w-full hidden"
            >
              Incorrect login credentials
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <SingleLineInput
                id="emailInput"
                name="email"
                label="Email"
                inputType="email"
                autoComplete="username"
                onChange={() => setEmail(emailInputRef.current.getValue())}
                ref={emailInputRef}
              />
              <SingleLineInput
                id="passwordInput"
                name="password"
                inputType="password"
                label="Password"
                autoComplete="password"
                ref={passwordInputRef}
              />
              <SimpleCheckBox
                id="checkboxRemember"
                name="checkboxRemember"
                label="Remember me"
                isChecked={rememberToggle}
                isCheckedSet={rememberToggleSet}
              />
            </div>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-3">
              <button type="submit" className="btn-primary">
                Log in
              </button>
              <Link to="/signup" state={{ email }} className="btn-secondary">
                Sign up
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500 self-center">
              Forgot password?{" "}
              <Link to="/requestpasswordreset" className="text-gray-700 underline">
                Reset it
              </Link>
            </p>
            {/* <span className="text-sm text-gray-500 mt-4 self-center pr-1">Can't remember password? <Link className="underline" to="/">Reset</Link></span> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
