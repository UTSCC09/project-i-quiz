import { Routes, Route } from "react-router";
import LandingPage from "pages/LandingPage";
import React from "react";
import QuizPage from "pages/QuizPage";
import SignUpPage from "pages/SignUpPage";
import NotFoundPage from "pages/NotFoundPage";
import CourseDashboard from "pages/CourseDashboard";
import CoursePage from "pages/CoursePage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/login" element={ <LandingPage /> } />
        <Route path="/signup" element={ <SignUpPage /> } />
        <Route path="/quiz/:quizId" element={ <QuizPage />} />
        <Route path="/courses" element={ <CourseDashboard />} />
        <Route path="/courses/:courseId" element={ <CoursePage />} />
        <Route path="*" element={ <NotFoundPage />} />
      </Routes>
    </>
  );
}
export default App;
