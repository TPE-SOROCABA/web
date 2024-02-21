import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Hello, Login } from "../pages";
import { PrivateRoute } from "./PrivateRoutes";

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/hello" element={<Hello />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
