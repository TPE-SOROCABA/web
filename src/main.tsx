import React from "react";
import ReactDOM from "react-dom/client";
import { RoutesApp } from "./routes";
import "./index.css";
import { Toaster as ToasterMobile } from "react-hot-toast";
import { ToastContainer as ToasterDesktop } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToasterMobile />
    <ToasterDesktop />
    <RoutesApp />
  </React.StrictMode>
);
