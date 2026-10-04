import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./ui/styles/index.css";
const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
const path = window.location.pathname.replace(/\/$/, "") || "/";
if (root.dataset.renderedPath === path && !window.location.search)
  hydrateRoot(root, app);
else {
  document.head
    .querySelectorAll(
      'title, meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]',
    )
    .forEach((node) => node.remove());
  createRoot(root).render(app);
}
