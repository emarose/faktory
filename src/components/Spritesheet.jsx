import React, { useEffect, useState } from "react";
import spriteSheet from "../assets/animations/impactEffect.png";

const SpriteSheet = ({
  row,
  spriteWidth,
  spriteHeight,
  isAnimating,
  onAnimationEnd,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 8;

  useEffect(() => {
    let interval;

    if (isAnimating) {
      interval = setInterval(() => {
        setCurrentFrame((prevFrame) => {
          if (prevFrame + 1 >= totalFrames) {
            clearInterval(interval);
            onAnimationEnd();
            return 0;
          }
          return prevFrame + 1;
        });
      }, 80);
    } else {
      setCurrentFrame(0);
    }

    return () => clearInterval(interval);
  }, [isAnimating, totalFrames, onAnimationEnd]);

  if (!isAnimating) {
    return null;
  }

  return (
    <div
      style={{
        width: `${spriteWidth}px`,
        height: `${spriteHeight}px`,
        backgroundImage: `url(${spriteSheet})`,
        backgroundPosition: `-${currentFrame * spriteWidth}px -${
          row * spriteHeight
        }px`,
        backgroundSize: `${spriteWidth * totalFrames}px ${spriteHeight * 24}px`,
      }}
    />
  );
};

export default SpriteSheet;
