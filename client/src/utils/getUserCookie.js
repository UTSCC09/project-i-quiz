export default function getUserCookie() {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
}
