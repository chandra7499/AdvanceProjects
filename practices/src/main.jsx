import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GlobalData } from "./components/GlobalStates/ContextApi.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import App from "./App.jsx";

export const queryClient = new QueryClient();


const rootElement = document.getElementById("root");


if (!window.__reactRoot) {
  window.__reactRoot = ReactDOM.createRoot(rootElement);
}

window.__reactRoot.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <GlobalData>
        <App />
      </GlobalData>
    </BrowserRouter>
  </QueryClientProvider>
);
