import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  CheckNumberCode,
  Designar,
  ForgotPassword,
  ListaDesignacao,
  Login,
  NewPassword,
  Dashboard,
  ConsultarHistorico,
  Peticao,
  FormularioPeticao,
  UploadPeticao,
} from "../pages";
import { PrivateRoute } from "./PrivateRoutes";
import { WeekDesignation } from "../pages/week-designation/WeekDesignation";
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

            <Route path="/peticao">
              <Route path="" element={<Peticao />} />
              <Route path="upload" element={<UploadPeticao />} />
              <Route path="form" element={<FormularioPeticao />} />
            </Route>

            <Route path="/consultar">
              <Route path="historico" element={<ConsultarHistorico />} />
            </Route>

            <Route path="/lista-designacao">
              <Route path="" element={<ListaDesignacao />} />
              <Route path="designar" element={<Designar />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="/week-designation/:designationId"
          element={<WeekDesignation />}
        />
        <Route
          path="/week-designation/:designationId/:participantId"
          element={<WeekDesignation />}
        />
      </Routes>
    </BrowserRouter>
  );
}
