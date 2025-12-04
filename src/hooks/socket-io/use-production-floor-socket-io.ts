import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { printHouseProfile } from "@/store/print-house-profile";
import { useRecoilValue } from "recoil";
import { EProductionFloorView } from "@/widgets/production-floor/state/production-floor-view";

const useProductionFloorSocketIO = (view: EProductionFloorView) => {
  const [connectionId, setConnectionId] = useState<any>();
  const profile = useRecoilValue(printHouseProfile);
  const {
    getData,
    getDataByGroups,
    getStationFilterGroups,
    getAllBoardMissions,
  } = useProductionFloorData();

  useEffect(() => {
    const socket = io(config.api_server);
    socket.on(`UpdateBoardMissionsStation-${profile.id}`, () => {
      getStationFilterGroups().then();
      if (view === EProductionFloorView.FILTER_GROUPS) {
        getDataByGroups(connectionId, null).then();
        return;
      }
      if (view === EProductionFloorView.DONE_JOBS) {
        getAllBoardMissions().then();
        return;
      }
      getData(socket.id).then();
    });
    socket.on("connect", () => {
      setConnectionId(socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [view]);
  return {
    connectionId,
  };
};

export { useProductionFloorSocketIO };
