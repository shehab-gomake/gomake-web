import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";

interface IUseJobModalSocketIOProps {
  boardMissionId: string;
  getBoardMissions: (id: string, productType: string) => Promise<void>;
  getStations: () => void;
  getAllActivities: () => void;
  getAllBoardMissionsFiles: () => void;
}

const useJobModalSocketIO = ({
  boardMissionId,
  getBoardMissions,
  getStations,
  getAllActivities,
  getAllBoardMissionsFiles,
}: IUseJobModalSocketIOProps) => {
  const { query } = useRouter();
  const { productType } = query;
  const [connectionId, setConnectionId] = useState<any>();
  const [boardMissionsDetails] = useRecoilState(boardMissionsDetailsState);

  useEffect(() => {
    const socket = io(config.api_server);
    socket.on(`UpdateBoardMissionModal-${boardMissionId}`, () => {
      getAllActivities();
      getBoardMissions(
        boardMissionId,
        !!productType ? productType.toString() : ""
      );
      getStations();
      boardMissionsDetails?.orderItemId && getAllBoardMissionsFiles();
    });
    socket.on("connect", () => {
      setConnectionId(socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    connectionId,
  };
};

export { useJobModalSocketIO };
