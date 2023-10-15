import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import React from "react";
import QuestionsDemoPage from "./pages/QuestionsDemoPage";
import SignUpPage from "./pages/SignUpPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/login" element={ <LandingPage /> } />
        <Route path="/signup" element={ <SignUpPage /> } />
        <Route path="/demo" element={ <QuestionsDemoPage />} />
        <Route path="*" element={ <>404 Not Found</> } />
      </Routes>
    </>
  );
}
export default App;
