// https://create-react-app.dev/docs/adding-a-router/
// https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md#add-some-routes

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { store } from "./app/store";
import App from "./Components/App/App";

import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/foo" element={<span>FOO</span>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
