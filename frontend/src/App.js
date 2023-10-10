import "./styles/components.css";
import logo from "./media/iquiz_logo.svg";

function App() {
  return (
    <>
    <img src={logo} alt="iQuiz! Logo" className="absolute h-8 mt-16 ml-12 sm:ml-20"></img>
    <div className="h-screen flex bg-center justify-center items-center  bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')]" >
      <SignInWindow/>
    </div>
    </>
  );
}

function SignInWindow() {
  return (
    <>
      <div
        className="z-10 flex items-center px-10 py-12 lg:ml-[40vw] bg-white border border-gray-100 rounded-md shadow-2xl h-fit w-fit justify-center"
      >
        <div className="flex flex-col justify-start w-56 sm:w-64">
          <div className="flex flex-col gap-1 mb-8">
            <div className="text-xl font-bold">
              <p>
                Sign up to begin your unique
                <img src={logo} alt="iQuiz! Logo" className="w-14 mx-2 mb-0.5 inline self-baseline"></img>
                experience
              </p>
            </div>
            <div className="text-xs text-gray-500">
              <span>Or log in with an existing account</span>
            </div>
          </div>
          <form className="flex flex-col">
            <input
              className="single-line-input"
              placeholder="Email address"
            ></input>
            <input
              className="mt-2 single-line-input"
              placeholder="Password"
              type="password"
            ></input>
          </form>
          <div className="flex justify-between gap-5 mt-6">
            <div className="btn-primary">Log in</div>
            <div className="btn-secondary">Sign up</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
