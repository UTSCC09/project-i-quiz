import { Routes, Route } from "react-router";
import LoginPage from "pages/LoginPage";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import QuizPage from "pages/QuizPage";
import SignUpPage from "pages/SignUpPage";
import RequestPasswordResetForm from "components/page_components/password_reset/RequestPasswordResetForm";
import VerifyPasswordResetCodeForm from "components/page_components/password_reset/VerifyPasswordResetCodeForm";
import CreateNewPasswordForm from "components/page_components/password_reset/CreateNewPasswordForm";
import NotFoundPage from "pages/NotFoundPage";
import DashboardPage from "pages/DashboardPage";
import CoursePage from "pages/CoursePage";
import ProtectedRoute from "components/ProtectedRoute";
import QuizEditorPage from "pages/QuizEditorPage";
import PasswordResetPage from "pages/PasswrodResetPage";

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
      <Route
        path="/create-quiz"
        element={
          <ProtectedRoute>
            <QuizEditorPage />
          </ProtectedRoute>
        }
      />

      {/* -- Public Routes -- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/reset-password" element={<PasswordResetPage />} />
      <Route path="/verifypasswordresetcode" element={<VerifyPasswordResetCodeForm />} />
      <Route path="/resetpassword" element={<CreateNewPasswordForm />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
export default App;
