import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// React mount is gated on the user clicking the entry button in index.html.
// The inline <script> there sets `window.__entryClicked = true` and dispatches
// an `entry-enter` event. If the bundle loads after the click (unlikely but
// possible), the flag is already set and we proceed immediately.

const FADE_MS = 360;

declare global {
  interface Window {
    __entryClicked?: boolean;
  }
}

const mountApp = () => {
  createRoot(document.getElementById("root")!).render(<App />);
};

const handOff = () => {
  const entry = document.querySelector<HTMLElement>(".site-entry");
  if (entry) {
    entry.style.transition = `opacity ${FADE_MS}ms ease-out`;
    entry.style.opacity = "0";
    window.setTimeout(mountApp, FADE_MS);
  } else {
    mountApp();
  }
};

if (window.__entryClicked) {
  handOff();
} else {
  window.addEventListener("entry-enter", handOff, { once: true });
}
