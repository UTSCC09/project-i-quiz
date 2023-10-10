import "./styles/components.css";

function App() {
  return (
    <>
      <SignInWindow />
    </>
  );
}

function SignInWindow() {
  return (
    <>
      <div
        className="flex items-center justify-center px-12 mx-auto mt-32 border border-gray-100 rounded-md shadow-2xl h-96 max-w-fit shadow-gray-300"
      >
        <div className="flex flex-col justify-start w-64">
          <div className="flex flex-col gap-1 mb-8">
            <div className="text-xl font-bold">
              <a>
                Sign up to begin your unique
                <a className="text-blue-600"> iQuiz! </a>
                experience
              </a>
            </div>
            <div className="text-xs text-gray-500">
              <a>Or sign in with an existing account</a>
            </div>
          </div>
          <input
            className="single-line-input"
            placeholder="Email address"
          ></input>
          <input
            className="mt-2 single-line-input"
            placeholder="Password"
            type="password"
          ></input>
          <div className="flex gap-5 mt-6">
            <div className="btn-primary">Log in</div>
            <div className="btn-secondary">Sign up</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
