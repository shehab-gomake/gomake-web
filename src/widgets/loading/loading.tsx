import React from "react";
import { useRecoilValue } from "recoil";
import { Backdrop } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../waiting-auth/loading.json";
import { loadgingState } from "@/store/loading";

const GomakeLoading = () => {
  const loading = useRecoilValue(loadgingState);
  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Backdrop open={loading}>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
          {/*<Lottie options={options} height={100} width={100} />*/}
      </div>
    </Backdrop>
  );
};

export { GomakeLoading };
