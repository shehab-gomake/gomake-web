import React from "react";
import { CircularProgress } from "@mui/material";

const GomakeLoaderWidget = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 250,
      }}
    >
      <CircularProgress size="80px" />
    </div>
  );
};

export { GomakeLoaderWidget };
