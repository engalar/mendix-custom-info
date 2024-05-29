import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// get element with id 'custom-info' if not exists, create it
if (!document.getElementById("custom-info")) {
  const customInfo = document.createElement("div");
  customInfo.id = "custom-info";
  document.body.appendChild(customInfo);
}

const rootElement = document.getElementById("custom-info");
ReactDOM.createRoot(rootElement).render(<App />);
