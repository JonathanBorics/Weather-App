// src/components/common/ErrorBoundary.js

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Frissíti az állapotot, hogy a következő renderelés a hiba UI-t mutassa.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Ide jöhetne egy hiba-logoló szolgáltatás, pl. Sentry
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Egyedi hibaoldalt is renderelhetsz
      return (
        <div
          className="container"
          style={{ textAlign: "center", marginTop: "50px" }}
        >
          <div className="card">
            <h1>Hoppá! Hiba történt.</h1>
            <p>
              Valami elromlott az alkalmazásban. Próbálja meg frissíteni az
              oldalt.
            </p>
            <details
              style={{
                whiteSpace: "pre-wrap",
                textAlign: "left",
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              {this.state.error && this.state.error.toString()}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
