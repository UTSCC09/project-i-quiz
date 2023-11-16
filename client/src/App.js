import { Routes, Route } from "react-router";
import LoginPage from "pages/LoginPage";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import QuizPage from "pages/QuizPage";
import SignUpPage from "pages/SignUpPage";
import RequestPasswordResetPage from "pages/RequestPasswordResetPage";
import VerifyPasswordResetCodePage from "pages/VerifyPasswordResetCodePage";
import ResetPasswordPage from "pages/ResetPasswordPage";
import NotFoundPage from "pages/NotFoundPage";
import DashboardPage from "pages/DashboardPage";
import CoursePage from "pages/CoursePage";
import ProtectedRoute from "components/ProtectedRoute";
import QuizEditorPage from "pages/QuizEditorPage";

const App = () => {
  const { pathname } = useLocation();

  /* Scroll to top on redirects */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      {/* -- Protected Routes -- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz/:quizId"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:courseId"
        element={
          <ProtectedRoute>
            <CoursePage />
          </ProtectedRoute>
        }
      />

      {/* -- Public Routes -- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/requestpasswordreset" element={<RequestPasswordResetPage />} />
      <Route path="/verifypasswordresetcode" element={<VerifyPasswordResetCodePage />} />
      <Route path="/resetpassword" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/create-quiz" element={<QuizEditorPage />} />
    </Routes>
  );
};
export default App;
