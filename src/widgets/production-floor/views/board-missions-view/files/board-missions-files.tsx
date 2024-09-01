import {Stack} from "@mui/material";
import {useGomakeAxios} from "@/hooks";
import {useCallback, useEffect, useState} from "react";
import {getAllBoardMissionsUploadedFiles} from "@/services/api-service/production-floor/production-floor-endpoints";

import {FileCardComponent} from "@/widgets/production-floor/views/board-missions-view/files/file-card-component";
import {useRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {boardMissionsFilesState} from "@/widgets/production-floor/views/board-missions-view/files/state";
import {useUploadFiles} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-upload-files";

const BoardMissionsFiles = () => {
    const {callApi} = useGomakeAxios();
    const [files, setFiles] = useRecoilState(boardMissionsFilesState);
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const {handleFileUpload} = useUploadFiles(boardMissions.orderItemId, boardMissions.filesPath);
    const [isOver, setIsOver] = useState(false);
    const handleFileDrop = async (event) => {
        event.preventDefault();
        setIsOver(false);
        const files = event.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            handleFileUpload(files[i]).then();
        }

    }

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        setIsOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsOver(false);
    }, []);

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
        <Stack className={`drop-zone ${isOver ? 'dragging' : ''}`}
               onDrop={handleFileDrop}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               direction={'row'} gap={'20px'} flex={1} flexWrap={'wrap'} padding={'0 0 30px 0'}>
            {
                files?.filter(file => !!file.screenShotURL)?.map(file => <FileCardComponent key={file.name}
                                                                                            file={file}/>)
            }
        </Stack>
    )
}

export {BoardMissionsFiles}