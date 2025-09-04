import React from "react";

const Loading = ({ message = "Betöltés..." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-2xl)",
        textAlign: "center",
      }}
    >
      <div
        className="loading-spinner"
        style={{
          width: "40px",
          height: "40px",
          marginBottom: "var(--spacing-lg)",
        }}
      ></div>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "var(--text-lg)",
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default Loading;
