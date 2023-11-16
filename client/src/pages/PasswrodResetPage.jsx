import { useState, Navigate } from "react";
import { getUserCookie } from "utils/CookieUtils";
import VerifyPasswordResetCodePage from "./VerifyPasswordResetCodePage";
import RequestPasswordResetPage from "./RequestPasswordResetPage";
import ResetPasswordPage from "./ResetPasswordPage";
import Toast from "components/elements/Toast";

export default function PasswordResetPage() {
  const [step, stepSet] = useState(1);
  const [toastMessage, toastMessageSet] = useState();

  return !getUserCookie() ? (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <div className="h-screen w-full flex flex-col justify-center bg-center bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')] bg-gray-50">
        {step === 1 && <RequestPasswordResetPage stepSet={stepSet} toastMessageSet={toastMessageSet} />}
        {step == 2 && <VerifyPasswordResetCodePage stepSet={stepSet} />}
        {step == 3 && <ResetPasswordPage />}
      </div>
    </>
  ) : (
    <Navigate to="/" />
  );
}
