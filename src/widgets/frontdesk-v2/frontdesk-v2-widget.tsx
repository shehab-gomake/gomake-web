import React from "react";
import { Box, Typography } from "@mui/material";

const FrontdeskV2Widget = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h4" color="textSecondary">
        FrontDesk V2 - Ready to Build
      </Typography>
    </Box>
  );
};

export default FrontdeskV2Widget;

