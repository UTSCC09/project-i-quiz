import { useState, Navigate } from "react";
import { getUserCookie } from "utils/CookieUtils";
import VerifyPasswordResetCodeWindow from "../components/page_components/VerifyPasswordResetCodeWindow";
import RequestPasswordResetWindow from "../components/page_components/RequestPasswordResetWindow";
import ResetPasswordWindow from "../components/page_components/ResetPasswordWindow";
import Toast from "components/elements/Toast";

export default function PasswordResetPage() {
  const [step, stepSet] = useState(1);
  const [toastMessage, toastMessageSet] = useState();

  return !getUserCookie() ? (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <div className="h-screen w-full flex flex-col justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        {step === 1 && <RequestPasswordResetWindow stepSet={stepSet} toastMessageSet={toastMessageSet} />}
        {step == 2 && <VerifyPasswordResetCodeWindow stepSet={stepSet} />}
        {step == 3 && <ResetPasswordWindow />}
      </div>
    </>
  ) : (
    <Navigate to="/" />
  );
}
