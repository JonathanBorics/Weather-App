// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // <-- 1. LÉPÉS: IMPORTÁLÁS

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* 2. LÉPÉS: CSOMAGOLÁS */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);