import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { loadContentOverrides, subscribeContentOverrides } from "./lib/contentOverrides";

const render = () => createRoot(document.getElementById("root")!).render(<App />);

// Apply admin edits to projects/blog before first paint (max 1.5s wait).
Promise.race([loadContentOverrides(), new Promise((r) => setTimeout(r, 1500))]).finally(() => {
  render();
  subscribeContentOverrides();
});
