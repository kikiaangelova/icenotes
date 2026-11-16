import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { listenForInstallPrompt } from './lib/pwa';
import { registerAppWorker } from './lib/registerAppWorker';

listenForInstallPrompt();
void registerAppWorker().catch(() => { /* Installation remains optional if workers are unavailable. */ });
const root = document.getElementById('root');
if (root) createRoot(root).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
