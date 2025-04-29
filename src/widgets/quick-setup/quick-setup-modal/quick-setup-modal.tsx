import { useRecoilValue } from "recoil";
import { setupGuideOpenState } from "@/store/setup-guide-state";
import { GoMakeModal } from "@/components";
import { SetupSteps } from "./components/setup-steps";
import { Dialog, DialogContent } from "@mui/material";

import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

const SetupModal = () => {
  const isOpen = useRecoilValue(setupGuideOpenState);

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  if (!isOpen) return null;

  return (
    //   <GoMakeModal openModal={isOpen} modalTitle=" ">
    //   <SetupSteps />
    // </GoMakeModal>

    <Dialog open={isOpen} TransitionComponent={Transition} fullWidth>
      <DialogContent sx={{ padding: 0 }}>
        <SetupSteps />
      </DialogContent>
    </Dialog>
  );
};

export { SetupModal };
