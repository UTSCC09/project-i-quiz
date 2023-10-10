import "./styles/components.css";
import logo from "./media/iquiz_logo.svg";

function App() {
  return (
    <>
    <div className="absolute w-screen h-screen bg-black bg-opacity-20"></div>
      <div className="h-screen bg-[length:120vw] md:bg-[length:120vh] flex flex-row bg-center bg-logo-tile justify-center md:justify-end  items-center">
      <SignInWindow />
      </div>
    </>
  );
}

function SignInWindow() {
  return (
    <>
      <div
        className="z-10 flex items-center px-12 bg-white border border-gray-100 rounded-md shadow-2xl h-96 w-fit justify-center md:mr-[20vw]"
      >
        <div className="flex flex-col justify-start w-[50vw] sm:w-64">
          <div className="flex flex-col gap-1 mb-8">
            <div className="text-xl font-bold">
              <p>
                Sign up to begin your unique
                <img src={logo} className="w-14 mx-2 mb-0.5 inline self-baseline"></img>
                experience
              </p>
            </div>
            <div className="text-xs text-gray-500">
              <a>Or log in with an existing account</a>
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
