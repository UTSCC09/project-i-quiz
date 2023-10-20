import { Routes, Route } from "react-router";
import LandingPage from "pages/LandingPage";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import QuizPage from "pages/QuizPage";
import SignUpPage from "pages/SignUpPage";
import NotFoundPage from "pages/NotFoundPage";
import DashboardPage from "pages/DashboardPage";
import CoursePage from "pages/CoursePage";

const App = () => {  
  const { pathname } = useLocation();

  /* Scroll to top on redirects */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/login" element={ <LandingPage /> } />
        <Route path="/signup" element={ <SignUpPage /> } />
        <Route path="/quiz/:quizId" element={ <QuizPage />} />
        <Route path="/dashboard" element={ <DashboardPage />} />
        <Route path="/courses/:courseId" element={ <CoursePage />} />
        <Route path="*" element={ <NotFoundPage />} />
      </Routes>
    </>
  );
}
export default App;
