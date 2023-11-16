import { useState, useRef } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { getUserCookie } from "utils/CookieUtils";
import iquizLogo from "media/iquiz_logo.svg";
import { AnimatePresence, motion } from "framer-motion";
import SingleLineInput from "components/elements/SingleLineInput";
import AlertBanner from "components/elements/AlertBanner";

export default function RequestPasswordResetPage() {
  const navigate = useNavigate();

  const [helpMessageShow, helpMessageShowSet] = useState(false);

  const alertRef = useRef();
  const emailInputRef = useRef();

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

    const formData = new FormData(e.target);

    fetch("/api/users/requestpasswordreset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: formData.get("email")
      })
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          navigate(
            "/verifypasswordresetcode",
            { state: { passInMessage: "Code has been sent to your email" } }
          );
        } else {
          alertRef.current.setMessage(result.message);
          alertRef.current.show();
        }
      })
      .catch((err) => {
        console.error(err);
        alertRef.current.setMessage("Could not connect to the server");
        alertRef.current.show();
      });
  };

  return !getUserCookie() ? (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="h-screen w-full flex flex-col justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        <div
          id="container"
          className="bg-white h-full sm:h-fit sm:min-h-[28rem] w-full sm:w-fit shadow-lg px-12 sm:px-28 mt-24 sm:mt-0 sm:place-self-center pb-16 sm:rounded-md pt-24"
        >
          <div className="flex flex-col items-center">
            <div className="mb-7 flex flex-col gap-2 w-full">
              <h1 className="self-start text-3xl font-bold">
                Reset your password
              </h1>
              <div className="flex items-center relative ml-0.5 text-sm text-gray-500">
                Please provide an email address
                <div
                  className="ml-2 mt-1 flex items-center text-black text-opacity-30 text-center cursor-pointer hover:bg-black hover:bg-opacity-5 rounded-lg transition-all"
                  onClick={() => {
                    helpMessageShowSet(!helpMessageShow);
                  }}
                >
                  {/* [Credit]: svg from https://www.flaticon.com/uicons */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    strokeWidth="0.5"
                    stroke="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" />
                    <path d="M12.717,5.063A4,4,0,0,0,8,9a1,1,0,0,0,2,0,2,2,0,0,1,2.371-1.967,2.024,2.024,0,0,1,1.6,1.595,2,2,0,0,1-1,2.125A3.954,3.954,0,0,0,11,14.257V15a1,1,0,0,0,2,0v-.743a1.982,1.982,0,0,1,.93-1.752,4,4,0,0,0-1.213-7.442Z" />
                    <circle cx="12.005" cy="18" r="1" />
                  </svg>
                </div>
                <AnimatePresence>
                  {helpMessageShow && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: 0 }}
                      animate={{ opacity: 1, scale: 1, y: 10 }}
                      exit={{ opacity: 0, scale: 0.98, y: 0 }}
                      className="absolute z-10 text-sm text-slate-600 flex flex-col gap-4 bg-white py-6 px-8 shadow-lg w-80 rounded-lg right-[min(calc(100vw - 12rem), 12rem)] top-full"
                    >
                      <span>
                        Make sure this is the same email that you registered to iQuiz! with,
                        and that it is verified your email.
                      </span>
                      <span>
                        If you have not received a verification email, please check your junk/spam folder.
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
                <button className="btn-primary">Send code</button>
              </div>
            </form>
            <span className="mt-6 text-sm text-gray-500">
              Changed your mind?{" "}
              <Link to="/login" className="text-gray-700 underline">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  ) : (
    <Navigate to="/" />
  );
}
