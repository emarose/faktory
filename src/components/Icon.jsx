import React from "react";
import spriteSheet from "../assets/icons/resources_basic.png";
import iconMapping from "../data/iconMapping";

const Icon = ({ name, size = 24 }) => {
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
          backgroundSize: `${264}px ${264}px`,
        }}
      />
    </div>
  );
};

export default Icon;
