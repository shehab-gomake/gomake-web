import * as React from "react";

const ColoredCycle = ({ backgroundColor , width , height }: any) => {
  return (
    <div
      style={{
        width: width || 30,
        height: height || 30,
        borderRadius: "50%",
        backgroundColor: `${backgroundColor}`,
        fill: "Background",
      }}
    ></div>
  );
};

export { ColoredCycle };
