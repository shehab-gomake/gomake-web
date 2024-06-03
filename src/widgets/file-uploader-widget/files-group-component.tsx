import Stack from "@mui/material/Stack";
import {FileComponent} from "@/widgets/file-uploader-widget/file-component";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {IUploadingFileGroup} from "@/widgets/file-uploader-widget/interface";
import {useCallback, useState} from "react";
import {Backdrop} from "@mui/material";
import {useUploadFiles} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-upload-files";
import {FONT_FAMILY} from "@/utils/font-family";
const FilesGroupComponent = ({title, filesInfo, orderItemId}: IUploadingFileGroup) => {
    const {primaryColor} = useGomakeTheme();
    const [isOver, setIsOver] = useState(false);
    const {handleFileUpload} = useUploadFiles(orderItemId, '')
    const handleFileDrop = async (event) => {
        event.preventDefault();
        setIsOver(false);
        const files = event.dataTransfer.files;
        console.log(files)
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

    return (
      <Stack
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          position={'relative'}>
          <h3 style={{color: primaryColor(600), ...FONT_FAMILY.Lexend(400, 16)}}>{title}</h3>
          <Stack>
              <Backdrop style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, margin: '-5px'}} open={isOver}/>
              {
                  filesInfo?.map(file => <FileComponent {...file}/>)
              }
          </Stack>
      </Stack>
  )
}

export {FilesGroupComponent}