import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "../lib";

export function PrivateRoute() {
  const cookie = useCookies();

  if (!cookie.getCookie("token")) return <Navigate to="/" />;
  return <Outlet />;
}
