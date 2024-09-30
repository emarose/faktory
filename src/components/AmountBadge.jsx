import React from "react";

const AmountBadge = ({ amount }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        backgroundColor: "#ff4757", // Customize background color
        color: "#ffffff", // Customize text color
        borderRadius: "50%",
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.8rem",
        fontWeight: "bold",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)", // Optional shadow for depth
      }}
    >
      {amount}
    </div>
  );
};

export default AmountBadge;
