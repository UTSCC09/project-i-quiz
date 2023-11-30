import { useState, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { getUserCookie } from "utils/CookieUtils";
import { AnimatePresence, motion } from "framer-motion";
import SingleLineInput from "components/elements/SingleLineInput";
import AlertBanner from "components/elements/AlertBanner";
import { QuestionMarkCircleIcon } from "components/elements/SVGIcons";

export default function RequestPasswordResetPage({
  stepSet,
  toastMessageSet,
}) {
  const [helpMessageShow, helpMessageShowSet] = useState(false);

  const alertRef = useRef();
  const emailInputRef = useRef();
  const buttonRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!emailInputRef.current.validate("required")) {
      alertRef.current.setMessage("Please enter your email address");
      alertRef.current.show();
      return;
    } else if (!emailInputRef.current.validate("email")) {
      alertRef.current.setMessage("Invalid email address format");
      alertRef.current.show();
      return;
    }

    buttonRef.current.classList.add("button-loading");

    const formData = new FormData(e.target);

    fetch("/api/users/requestpasswordreset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: formData.get("email"),
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toastMessageSet("The verification code has been sent to your email");
          setTimeout(() => {
            toastMessageSet();
          }, 3000);
          stepSet(2);
        } else {
          alertRef.current.setMessage(result.message);
          alertRef.current.show();
          buttonRef.current.classList.remove("button-loading");
        }
      })
      .catch((err) => {
        console.error(err);
        alertRef.current.setMessage("Could not connect to the server");
        alertRef.current.show();
        buttonRef.current.classList.remove("button-loading");
      });
  };

  return !getUserCookie() ? (
    <motion.div
      initial={{ opacity: 0.5, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="w-full h-full flex flex-col items-center"
    >
      <div className="flex flex-col items-center w-full">
        <div className="mb-7 flex flex-col gap-2 w-full">
          <h1 className="self-start text-3xl font-bold">
            Reset your password
          </h1>
          <div className="flex items-center relative text-sm text-gray-500">
            <span className="pl-0.5">Please provide an email address</span>
            <div
              className="ml-2 flex items-center text-black text-opacity-30 text-center cursor-pointer hover:text-opacity-20 rounded-lg transition-all"
              onClick={() => {
                helpMessageShowSet(!helpMessageShow);
              }}
            >
              <QuestionMarkCircleIcon className="h-3.5" />
            </div>
            <AnimatePresence>
              {helpMessageShow && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 10 }}
                  exit={{ opacity: 0, scale: 0.98, y: 0 }}
                  className="absolute z-10 text-sm text-slate-600 flex flex-col gap-4 bg-white py-6 px-8 shadow-lg max-w-full sm:w-80 rounded-lg right-[min(calc(100vw - 12rem), 12rem)] top-full"
                >
                  <span>
                    Make sure this is the same email that you registered to
                    iQuiz! with, and that it is verified your email.
                  </span>
                  <span>
                    If you have not received a verification email, please check
                    your junk/spam folder.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {helpMessageShow && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.1 },
                  }}
                  exit={{ opacity: 0 }}
                  className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-10"
                  onClick={() => {
                    helpMessageShowSet(false);
                  }}
                ></motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-6 gap-4 w-full sm:w-96"
          autoComplete="off"
          noValidate
        >
          {/* AlertBanner is always col-span-6 */}
          <AlertBanner ref={alertRef} />
          <div className="col-span-6">
            <SingleLineInput
              inputType="email"
              name="email"
              label="Email address"
              autoComplete={"email"}
              ref={emailInputRef}
            />
          </div>
          <div className="mt-4 col-span-6 flex flex-col items-center">
            <button ref={buttonRef} className="btn-primary">
              Send code
            </button>
          </div>
        </form>
        <span className="mt-6 text-sm text-gray-500">
          Changed your mind?{" "}
          <Link to="/login" className="text-gray-700 underline">
            Sign in
          </Link>
        </span>
      </div>
    </motion.div>
  ) : (
    <Navigate to="/" />
  );
}
