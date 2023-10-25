import { Navigate } from "react-router-dom";

export default function ProtectedRoute(props) {
  // TODO: Token-based authentication?
  const authenticated = true;

  if (!authenticated) {
    return <Navigate to="/login" />
  }

  return props.children;
}
