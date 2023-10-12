import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import React from "react";
import QuestionsDemoPage from "./pages/QuestionsDemoPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/demo" element={ <QuestionsDemoPage />} />
        <Route path="*" element={ <>404 Not Found</> } />
      </Routes>
    </>
  );
}
export default App;
