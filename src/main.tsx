import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { listenForInstallPrompt } from './lib/pwa';
import { registerAppWorker } from './lib/registerAppWorker';

// External font stylesheets belong in the document head, not CSS imports.
const fonts = document.createElement('link');
fonts.rel = 'stylesheet';
fonts.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
document.head.appendChild(fonts);

listenForInstallPrompt();
void registerAppWorker().catch(() => { /* Installation remains optional if workers are unavailable. */ });
const root = document.getElementById('root');
if (root) createRoot(root).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
