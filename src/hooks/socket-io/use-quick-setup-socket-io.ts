import { useEffect } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRecoilState, useSetRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import {
  printHouseSetupStepsState,
  SetupStepItem,
} from "@/store/print-house-setup-state-state";

const useQuickSetupSocketIo = () => {
  const [printHouse] = useRecoilState(printHouseProfile);
  const setPrintHouseSetupSteps = useSetRecoilState<SetupStepItem[]>(
    printHouseSetupStepsState
  );

  useEffect(() => {
    if (!printHouse?.id) return;

    const socket = io(config.api_server);
    const eventName = `updatePrintHouseSetupSteps-${printHouse.id}`;

    socket.on(eventName, (data: SetupStepItem[]) => {
      setPrintHouseSetupSteps(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [printHouse?.id]);

  return {};
};

export { useQuickSetupSocketIo };
