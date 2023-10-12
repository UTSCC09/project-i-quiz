import "../styles/components.css";
import logo from "../media/iquiz_logo.svg";

const LandingPage = () => {
  /* Disable auto-zooming in Safari */
  if (isIOS()) {
    document.head.querySelector('meta[name="viewport"]').content = "width=device-width, initial-scale=1, maximum-scale=1";
  }

  return (
    <>
    <img src={logo} alt="iQuiz! Logo" className="absolute h-8 mt-16 ml-12 sm:ml-20"></img>
    <div className="h-screen flex bg-center justify-center items-center  bg-cover bg-[url('/src/media/iquiz_logo_tiles.svg')]" >
      <SignInWindow/>
    </div>
    </>
  );
}

const SignInWindow = () => {
  function mockLogin(email, password) {
    if (email === "a@a.aa" && password === "a") {
      return true;
    }
    return false;
  }

  function signInOnSubmitHandler(e) {
    e.preventDefault();
    const email = e.target.emailInput.value;
    const password = e.target.passwordInput.value;

    if (!validateEmailFormat(email)) {
      document.querySelector("#login_error_msg").textContent = "Invalid email address format";
      document.querySelector("#login_error_msg").classList.remove("invisible");
      document.querySelector("#email_input").classList.add("input-invalid-state");
      return;
    }
    else if (!mockLogin(email, password)) {
      document.querySelector("#login_error_msg").textContent = "Incorrect login credentials";
      document.querySelector("#login_error_msg").classList.remove("invisible");
      document.querySelector("#email_input").classList.add("input-invalid-state");
      document.querySelector("#password_input").classList.add("input-invalid-state");

    }
    else {
      alert(`email: ${email}\npassword: ${password}`);
    }
  }

  function emailInputOnChangeHandler(e) {
    if (validateEmailFormat(e.target.value)) {
      document.querySelector("#login_error_msg").classList.add("invisible");
      document.querySelector("#email_input").classList.remove("input-invalid-state");
    }
  }

  function validateEmailFormat(stringVal) {
    return stringVal.match(/^[^ ]+@[^ ]+\.[a-z]{2,63}$/);
  }

  return (
    <>
      <div
        className="z-10 flex items-center sm:px-14 sm:py-20 px-10 py-12 lg:ml-[40vw] bg-white border border-gray-100 rounded-md shadow-2xl h-fit w-fit justify-center"
      >
        <div className="flex flex-col justify-start w-56 sm:w-64">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-bold">
              <p>
                Sign up to begin your unique
                <img src={logo} alt="iQuiz! Logo" className="w-14 mx-2 mb-0.5 inline self-baseline"></img>
                experience
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <span>Or log in with an existing account</span>
            </div>
          </div>
          <form className="flex flex-col mt-3 " onSubmit={signInOnSubmitHandler}>
            <span id="login_error_msg" className="text-red-500 text-sm mb-1 pl-1 invisible">placeholder</span>
            <input
              className="single-line-input"
              name="emailInput"
              id="email_input"
              placeholder="Email address"
              autoComplete="off"
              onChange={emailInputOnChangeHandler}
            ></input>
            <input
              className="mt-3 single-line-input"
              name="passwordInput"
              id="password_input"
              placeholder="Password"
              type="password"
              autoComplete="off"
            ></input>
            <div className="flex justify-between gap-5 mt-6">
              <button type="submit" className="btn-primary">Log in</button>
              <button className="btn-secondary">Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function isIOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform);
}

export default LandingPage;
