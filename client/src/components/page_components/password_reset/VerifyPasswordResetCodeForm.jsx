import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import OtpInput from "components/elements/OtpInput";
import AlertBanner from "components/elements/AlertBanner";
import { QuestionMarkCircleIcon } from "components/elements/SVGIcons";

export default function VerifyPasswordResetCodePage({ stepSet }) {
  const [helpMessageShow, helpMessageShowSet] = useState(false);

  const alertRef = useRef();
  const otpInputRef = useRef();
  const buttonRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!otpInputRef.current.validate()) {
      alertRef.current.setMessage(
        "Please enter all characters of the verification code"
      );
      alertRef.current.show();
      return;
    }

    buttonRef.current.classList.add("button-loading");
    alertRef.current.hide();

    fetch("/api/users/verifypasswordresetcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        code: otpInputRef.current.getValue(),
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          stepSet(3);
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

  return (
    <motion.div
      initial={{ opacity: 0.5, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="w-full h-full flex flex-col items-center"
    >
      <div className="mb-7 flex flex-col gap-4 w-full">
        <h1 className="self-start text-3xl font-bold">Reset your password</h1>
        <div className="flex items-center relative ml-0.5 text-sm text-gray-500">
          Please enter the verification code you received
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
                className="absolute z-10 text-sm text-slate-600 flex flex-col gap-4 bg-white py-6 px-8 shadow-lg max-w-full sm:w-80 rounded-lg right-0 top-full"
              >
                <span>
                  If you do not see the password reset email, please check your
                  spam / junk folder.
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
        className="flex flex-col gap-6 w-full sm:w-96"
        autoComplete="off"
        noValidate
      >
        <AlertBanner ref={alertRef} />
        <OtpInput ref={otpInputRef} />
        <button ref={buttonRef} className="btn-primary">
          Verify code
        </button>
      </form>

      <span className="mt-6 text-sm text-gray-500">
        Changed your mind?{" "}
        <Link to="/login" className="text-gray-700 underline">
          Sign in
        </Link>
      </span>
    </motion.div>
  );
}
