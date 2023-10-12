import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="*" element={ <>404 Not Found</> } />
      </Routes>
    </>
  );
}
export default App;
