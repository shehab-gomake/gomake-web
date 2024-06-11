import Stack from "@mui/material/Stack";
import {EUploadingFileStatus, IUploadingFile} from "@/widgets/file-uploader-widget/interface";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {CircularProgress} from "@mui/material";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";

const FileComponent = ({fileName, fileStatus}: IUploadingFile) => {
    const {successColor, errorColor, primaryColor, grayColor} = useGomakeTheme();
    return (
        <Stack direction={'row'} justifyContent={'space-between'} height={'40px'} alignItems={'center'}>
            <Stack direction={'row'} alignItems={'center'} gap={'3px'} style={{color: primaryColor(400)}}>
                <TextSnippetIcon/>
                <span style={{...FONT_FAMILY.Inter(500, 14), color: grayColor(700)}}>{fileName}</span>
            </Stack>
            <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
                {
                    fileStatus === EUploadingFileStatus.UPLOADING ?
                        <CircularProgress size={'25px'}/> :
                        (fileStatus === EUploadingFileStatus.DONE || fileStatus === EUploadingFileStatus.Uploaded) ?
                            <TaskAltIcon style={{
                                color: successColor(500),
                                backgroundColor: successColor(100),
                                width: '25px',
                                height: '25px',
                                padding: '2px',
                                borderRadius: '50%'
                            }}/> :
                            <ErrorOutlineIcon style={{
                                color: errorColor(500),
                                backgroundColor: errorColor(100),
                                width: '25px',
                                height: '25px',
                                padding: '2px',
                                borderRadius: '50%'
                            }}/>
                }
            </Stack>
        </Stack>
    );
}

export {FileComponent}