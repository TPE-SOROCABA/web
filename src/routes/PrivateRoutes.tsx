import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute() {
  const isEven = new Date().getSeconds() % 2 === 0;
  if (isEven) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
}
