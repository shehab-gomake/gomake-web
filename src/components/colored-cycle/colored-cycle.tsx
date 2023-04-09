import * as React from "react";

const ColoredCycle = ({ backgroundColor }: any) => {
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        backgroundColor: `${backgroundColor}`,
        fill: "Background",
      }}
    ></div>
  );
};

export { ColoredCycle };
