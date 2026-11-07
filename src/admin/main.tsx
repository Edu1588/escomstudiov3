import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./authFetch"; // precisa vir antes do App: faz as chamadas /api/* levarem o token do administrador
import App from "./App";
import "@/index.css"; // Reuse global tailwind styles

const container = document.getElementById("admin-root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <BrowserRouter basename="/admin">
        <App />
      </BrowserRouter>
      <Analytics />
    </StrictMode>
  );
}
