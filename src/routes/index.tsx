import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  CheckNumberCode,
  ForgotPassword,
  Hello,
  Login,
  NewPassword,
} from "../pages";
import { PrivateRoute } from "./PrivateRoutes";

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/forgot-password/check-number"
          element={<CheckNumberCode />}
        />
        <Route path="/forgot-password/new-password" element={<NewPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/hello" element={<Hello />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
