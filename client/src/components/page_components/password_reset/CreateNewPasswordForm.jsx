import { useState, useRef } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { getUserCookie } from "utils/CookieUtils";
import { AnimatePresence, motion } from "framer-motion";
import SingleLineInput from "components/elements/SingleLineInput";
import AlertBanner from "components/elements/AlertBanner";
import { QuestionMarkCircleIcon } from "components/elements/SVGIcons";

export default function ResetPasswordWindow() {
  const navigate = useNavigate();

  const [helpMessageShow, helpMessageShowSet] = useState(false);
  const alertRef = useRef();
  const newPasswordInputRef = useRef();
  const confirmNewPasswordInputRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!newPasswordInputRef.current.validate("required")) {
      alertRef.current.setMessage("Please enter a new password");
      alertRef.current.show();
      return;
    } else if (!newPasswordInputRef.current.validate("password")) {
      alertRef.current.setMessage(
        "Passwords must be at least 8 characters and contain at least one letter and one number"
      );
      alertRef.current.show();
      return;
    }

    if (!confirmNewPasswordInputRef.current.validate("required")) {
      alertRef.current.setMessage("Please confirm your new password");
      alertRef.current.show();
      return;
    } else if (!confirmNewPasswordInputRef.current.validate("password")) {
      alertRef.current.setMessage(
        "Passwords must be at least 8 characters and contain at least one letter and one number"
      );
      alertRef.current.show();
      return;
    }

    if (
      confirmNewPasswordInputRef.current.getValue() !==
      newPasswordInputRef.current.getValue()
    ) {
      alertRef.current.setMessage("Passwords doesn't match");
      alertRef.current.show();
      return;
    }

    const formData = new FormData(e.target);

    fetch("/api/users/resetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        newPassword: formData.get("password"),
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          navigate("/login", {
            state: { passInMessage: "Your password has been updated" },
          });
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
      initial={{ opacity: 0.5, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="w-full h-full flex flex-col items-center"
    >
      <div className="mb-7 flex flex-col gap-2 w-full">
        <h1 className="self-start text-3xl font-bold">Reset your password</h1>
        <div className="flex items-center relative text-sm text-gray-500">
          <span className="pl-0.5">Please create a new password</span>
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
                className="absolute z-10 text-sm text-slate-600 flex flex-col gap-4 bg-white py-6 px-8 shadow-lg max-w-full sm:w-80 rounded-lg right-12 bottom-0"
              >
                <span>Make sure your password is strong.</span>
                <span>
                  It should be at least 8 characters and contain at least one
                  letter and one number.
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
            id="newPassword"
            inputType="password"
            name="password"
            label="New password"
            autoComplete="new-password"
            ref={newPasswordInputRef}
          />
        </div>
        <div className="col-span-6">
          <SingleLineInput
            id="confirmNewPassword"
            inputType="password"
            label="Confirm new password"
            autoComplete="new-password"
            ref={confirmNewPasswordInputRef}
          />
        </div>
        <div className="mt-4 col-span-6 flex flex-col items-center">
          <button className="btn-primary">Save password</button>
        </div>
      </form>

      <span className="mt-6 text-sm text-gray-500">
        Changed your mind?{" "}
        <Link to="/login" className="text-gray-700 underline">
          Sign in
        </Link>
      </span>
    </motion.div>
  ) : (
    <Navigate to="/" />
  );
}
