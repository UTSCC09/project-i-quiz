import { useState, Navigate } from "react";
import { getUserCookie } from "utils/CookieUtils";
import VerifyPasswordResetCodePage from "./VerifyPasswordResetCodePage";
import RequestPasswordResetPage from "./RequestPasswordResetPage";
import ResetPasswordPage from "./ResetPasswordPage";

export default function PasswordResetPage() {
  const [step, stepSet] = useState(1);

  return !getUserCookie() ? (
    <>
      {step === 1 && <RequestPasswordResetPage stepSet={stepSet} />}
      {step == 2 && <VerifyPasswordResetCodePage stepSet={stepSet} />}
      {step == 3 && <ResetPasswordPage />}
    </>
  ) : (
    <Navigate to="/" />
  );
}
