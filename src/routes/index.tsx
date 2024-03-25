import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  CheckNumberCode,
  Designar,
  ForgotPassword,
  Hello,
  ListaDesignacao,
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
          <Route path="/dashboard" element={<Hello />} />
          <Route path="/lista-designacao" element={<ListaDesignacao />} />
          <Route path="/designar" element={<Designar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
