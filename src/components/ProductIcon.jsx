import React from "react";
import spriteSheet from "../assets/icons/productsexpanded.png";
import iconMapping from "../data/iconMapping";

const ProductIcon = ({ name, size = 32 }) => {
  const { x, y } = iconMapping[name] || { x: 0, y: 0 };

  return (
    <div
      style={{
        backgroundColor: "lightgray",
        borderRadius: 8,
        display: "grid",
        placeItems: "center",
        width: size + 10,
        height: size + 10,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${spriteSheet})`,
          backgroundPosition: `-${x}px -${y}px`,
          backgroundSize: `${320}px ${221}px`,
        }}
      />
    </div>
  );
};

export default ProductIcon;
