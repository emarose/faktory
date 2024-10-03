import React, { useEffect, useState } from "react";

const AmountBadge = ({ amount }) => {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    // Trigger bounce animation when the amount changes
    setBounce(true);
    const timeout = setTimeout(() => {
      setBounce(false); // Reset bounce after animation ends
    }, 300); // Duration of the bounce animation

    return () => clearTimeout(timeout); // Cleanup on unmount or amount change
  }, [amount]);

  return (
    <div
      className={`badge ${bounce ? "bounce" : ""}`}
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        backgroundColor: "slateblue",
        color: "#ffffff",
        borderRadius: "50%",
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.8rem",
        fontWeight: "bold",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {amount}
    </div>
  );
};

export default AmountBadge;
