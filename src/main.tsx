import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./styles/global.css";
// ✅ Подключаем наш ErrorBoundary
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./styles/overrides.css";                    // ✅ доп. UX/контраст (после базовых)
import "./styles/animations.css";                   // ✅ анимации в стиле React Bits


createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <App />
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>
);
