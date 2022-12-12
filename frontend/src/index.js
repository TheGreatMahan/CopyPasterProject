import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { registerLicense } from "@syncfusion/ej2-base";
import { AuthProvider } from "./Components/Auth";

// Registering Syncfusion license key
registerLicense(
  "ORg4AjUWIQA/Gnt2VVhjQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0VhW31fc3BWQ2dbWUM="
);

render(
  <AuthProvider>
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  </AuthProvider>,
  document.querySelector("#root")
);
