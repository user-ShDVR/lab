import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import "./styles/globals.css";
import { ConfigProvider, theme } from "antd";
import React from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#880000',
            borderRadius: 16,

            colorBgContainer: '#fffefc',
          }
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </Provider>
  </React.StrictMode>
);
