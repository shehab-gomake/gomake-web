import {useRecoilValue} from "recoil";
import {Stack} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {isReadyBoardMissionsState} from "@/widgets/production-floor/views/board-missions-view/stations/state";

const CompletedBoardMissionsComponent = () => {
  const isReady = useRecoilValue(isReadyBoardMissionsState);
  const {primaryColor} = useGomakeTheme();
  return isReady && <Stack borderRadius={'16px'} style={{backgroundColor: primaryColor(500), color: 'white',}} justifyContent={'center'} alignItems={'center'} width={'100%'} minHeight={'60px'}>
      <span>All Tasks Completed</span>
  </Stack>
}

export {CompletedBoardMissionsComponent}