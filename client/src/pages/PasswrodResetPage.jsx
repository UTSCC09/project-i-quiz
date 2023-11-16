import { useState, Navigate } from "react";
import { getUserCookie } from "utils/CookieUtils";
import VerifyPasswordResetCodeForm from "../components/page_components/password_reset/VerifyPasswordResetCodeForm";
import RequestPasswordResetForm from "../components/page_components/password_reset/RequestPasswordResetForm";
import CreateNewPasswordForm from "../components/page_components/password_reset/CreateNewPasswordForm";
import Toast from "components/elements/Toast";
import { useNavigate } from "react-router-dom";

export default function PasswordResetPage() {
  const navigate = useNavigate();
  if (getUserCookie()) {
    navigate("/");
  }
  const [step, stepSet] = useState(1);
  const [toastMessage, toastMessageSet] = useState();

  return (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <div className="h-screen w-full flex flex-col justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        <div
          id="container"
          className="bg-white h-full mt-24 sm:mt-0 sm:h-fit sm:min-h-[28rem] w-full sm:w-fit shadow-lg flex flex-col items-center px-12 sm:px-28 sm:place-self-center py-16 sm:rounded-md pt-24 transition-all"
        >
          {step === 1 && <RequestPasswordResetForm stepSet={stepSet} toastMessageSet={toastMessageSet} />}
          {step == 2 && <VerifyPasswordResetCodeForm stepSet={stepSet} />}
          {step == 3 && <CreateNewPasswordForm />}
        </div>
      </div>
    </>
  )
}
