import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
      </Routes>
    </>
  );
}
export default App;
