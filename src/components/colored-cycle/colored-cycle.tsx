import * as React from "react";

const ColoredCycle = ({ backgroundColor , size }: any) => {
  return (
    <div
      style={{
        width: size || 30,
        height: size || 30,
        borderRadius: "50%",
        backgroundColor: `${backgroundColor}`,
        fill: "Background",
      }}
    ></div>
  );
};

export { ColoredCycle };
