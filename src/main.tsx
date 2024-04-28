import React from "react";
import ReactDOM from "react-dom/client";
import { RoutesApp } from "./routes";
import "./index.css";
import { Toaster as ToasterMobile } from "react-hot-toast";
import { ToastContainer as ToasterDesktop } from "react-toastify";
import { IntlProvider } from 'react-intl';
import { CustomProvider } from 'rsuite';

import pt_BR from 'rsuite/locales/pt_BR';
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite-no-reset.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToasterMobile />
    <ToasterDesktop />
    <IntlProvider locale="pt">
      <CustomProvider locale={pt_BR}>
        <RoutesApp />
      </CustomProvider>
    </IntlProvider>
  </React.StrictMode>
);
