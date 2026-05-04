import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@/index.css"; // Reuse global tailwind styles

const container = document.getElementById("admin-root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <BrowserRouter basename="/admin">
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}
