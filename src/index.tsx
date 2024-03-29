import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import App from "./App";
import store from "./store";
import i18next from "./plugins/locales";
import PWA from "./plugins/pwa";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/scss/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const Component: React.FC<{}> = () => {
  return (
    <I18nextProvider i18n={i18next}>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </I18nextProvider>
  );
};

root.render(
  process.env.NODE_ENV === "production" ? (
    <React.StrictMode>
      <Component />
    </React.StrictMode>
  ) : (
    <Component />
  ),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
if (process.env.REACT_APP_MODE === "PWA") {
  serviceWorkerRegistration.register({
    onSuccess(registration) {
      const pwa = new PWA(registration);
      pwa.onSuccess(registration);
    },
    onUpdate(registration) {
      const pwa = new PWA(registration);
      pwa.onUpdate(registration);
    },
  });
} else if (process.env.REACT_APP_MODE === "WEB") {
  serviceWorkerRegistration.unregister();
} else {
  console.info("Cannot detect app mode (PWA | WEB). Default mode: WEB");
  serviceWorkerRegistration.unregister();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(process.env.NODE_ENV !== "production" ? console.table : () => {});
