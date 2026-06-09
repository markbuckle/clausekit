import { createRoot } from "react-dom/client";
import App from "./components/App";

/* global document, Office, module, require, HTMLElement */

const title = "ClauseKit";

const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

Office.onReady(() => {
  root?.render(<App title={title} />);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root?.render(NextApp);
  });
}
