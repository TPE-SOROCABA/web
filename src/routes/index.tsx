import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  CheckNumberCode,
  Designar,
  ForgotPassword,
  ListaDesignacao,
  Login,
  NewPassword,
  Dashboard,
} from "../pages";
import { PrivateRoute } from "./PrivateRoutes";
import { WeekDesignation } from "../pages/WeekDesignation";
import { Menu } from "../components";

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
        <Route element={<Menu />}>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lista-designacao" element={<ListaDesignacao />} />
            <Route path="/designar" element={<Designar />} />
          </Route>
        </Route>
        <Route path="/week-designation/:id" element={<WeekDesignation />} />
      </Routes>
    </BrowserRouter>
  );
}
