import { Routes, Route } from "react-router";
import LoginPage from "pages/LoginPage";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import QuizPage from "pages/QuizPage";
import SignUpPage from "pages/SignUpPage";
import NotFoundPage from "pages/NotFoundPage";
import DashboardPage from "pages/DashboardPage";
import CoursePage from "pages/CoursePage";
import ProtectedRoute from "components/ProtectedRoute";

const App = () => {  
  const { pathname } = useLocation();

  /* Scroll to top on redirects */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={ <LoginPage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route path="/signup" element={ <SignUpPage /> } />

        <Route path="/quiz/:quizId" element={ 
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={ 
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseId" element={ 
          <ProtectedRoute>
            <CoursePage />
          </ProtectedRoute>
        } />

        <Route path="*" element={ <NotFoundPage />} />
      </Routes>
    </>
  );
}
export default App;
