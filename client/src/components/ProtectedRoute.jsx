import { Navigate } from "react-router-dom";
import getUserCookie from "utils/getUserCookie";

export default function ProtectedRoute(props) {
  if (!getUserCookie()) {
    return <Navigate to="/login" />;
  }

  return props.children;
}
