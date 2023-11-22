function getUserCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)user\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
}

function isStudentUserType() {
  const userType = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_type\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (userType !== "student" && userType !== "instructor") {
    fetch(process.env.REACT_APP_PROXY_HOST + "/api/users/logout", { method: "GET" }).then(() => {
      window.location.reload();
    });
  } else {
    return userType === "student";
  }
}

export { getUserCookie, isStudentUserType };
