import React from "react";

const NotFound = () => {
  return (
    <div
      style={{
        backgroundColor: "white",
        minHeight: "94vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2>404 - Page Not Found</h2>
      <hr />
      <p style={{ color: "black", textAlign: "center" }}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;