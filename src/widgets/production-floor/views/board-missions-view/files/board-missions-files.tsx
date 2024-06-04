import {Stack} from "@mui/material";
import {useGomakeAxios} from "@/hooks";
import {useEffect} from "react";
import {getAllBoardMissionsUploadedFiles} from "@/services/api-service/production-floor/production-floor-endpoints";

import {FileCardComponent} from "@/widgets/production-floor/views/board-missions-view/files/file-card-component";
import {useRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {boardMissionsFilesState} from "@/widgets/production-floor/views/board-missions-view/files/state";

const BoardMissionsFiles = () => {
    const {callApi} = useGomakeAxios();
    const [files, setFiles] = useRecoilState(boardMissionsFilesState);
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    useEffect(() => {
        const callBack = res => {
            if (res.success) {
                setFiles(res.data);
            }
        }
        if (boardMissions.orderItemId) {
            getAllBoardMissionsUploadedFiles(callApi, callBack, boardMissions?.orderItemId).then()
        }
    }, [boardMissions.orderItemId])
    return (
        <Stack direction={'row'} gap={'20px'} flexWrap={'wrap'} padding={'0 0 30px 0'}>
            {
                files?.filter(file => !!file.screenShotURL)?.map(file => <FileCardComponent key={file.name} file={file}/>)
            }
        </Stack>
    )
}

export {BoardMissionsFiles}