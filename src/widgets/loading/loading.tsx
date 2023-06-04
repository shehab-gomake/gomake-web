import React from "react";
import { useRecoilValue } from "recoil";
import { Backdrop, CircularProgress } from "@mui/material";
import animationData from "../waiting-auth/loading.json";
import { loadgingState } from "@/store/loading";

const GomakeLoading = () => {
  const loading = useRecoilValue(loadgingState);

  return (
    <Backdrop open={loading}>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
        }}
      >
        <CircularProgress style={{ color: "#FFF" }} />
      </div>
    </Backdrop>
  );
};

export { GomakeLoading };
