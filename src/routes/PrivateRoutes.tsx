import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "../lib";

export function PrivateRoute() {
  const cookie = useCookies();

  if (!cookie.get("token")) return <Navigate to="/" />;
  return <Outlet />;
}
