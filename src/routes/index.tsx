import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  CheckNumberCode,
  ForgotPassword,
  ListaDesignacao,
  Login,
  NewPassword,
  Dashboard
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lista-designacao" element={<ListaDesignacao />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
