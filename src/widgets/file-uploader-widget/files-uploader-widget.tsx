import {useRecoilState} from "recoil";
import {openFileUploaderList, pinFileUploaderState, uploadingFilesState} from "@/store/file-uploader-state";
import Stack from "@mui/material/Stack";
import {Collapse, IconButton, Paper} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FilesGroupComponent} from "@/widgets/file-uploader-widget/files-group-component";
import {useState} from "react";
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import Divider from "@mui/material/Divider";

const FilesUploaderWidget = () => {
    const [files] = useRecoilState(uploadingFilesState);
    const [open, setOpen] = useRecoilState(openFileUploaderList);
    const [pin, setPin] = useRecoilState(pinFileUploaderState);
    const [isHover, setIsHover] = useState<boolean>(false)
    const {grayColor} = useGomakeTheme();
    return (
        <Paper style={{
                   position: 'fixed',
                   right: '300px',
                   bottom: 0
               }}
        >
            <Collapse in={pin || isHover || open} orientation={"vertical"} collapsedSize={10}>
                <Stack justifyContent={'space-between'}
                       direction={'row'}
                       alignItems={'center'}
                       width={'300px'}
                       style={{
                           backgroundColor: grayColor(200),
                           color: grayColor(700),
                           borderRadius: '10px 10px 0 0 ',
                       }}
                       onMouseEnter={() => setIsHover(true)}
                       onMouseLeave={() => setIsHover(false)}
                       padding={'7px'}>
                    <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                        <CloudUploadRoundedIcon/>
                        <span>Uploads</span>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'}>
                        <IconButton onClick={() => setOpen(!open)}>
                            {
                                open ? <ExpandMoreIcon/> : <ExpandLessIcon/>
                            }
                        </IconButton>
                        <IconButton onClick={() => setPin(!pin)}>
                            {pin ? <CloseIcon/> : <PushPinRoundedIcon/>}
                        </IconButton>
                    </Stack>

                </Stack>
            </Collapse>
            <Collapse in={open}
                      style={{backgroundColor: '#FFF', maxHeight: '600px', overflow: 'auto'}}>
                {

                    files?.length > 0 && <div style={{padding: '7px'}}>
                        {
                            files.map(fileGroup => <Stack gap={'5px'}>
                                <FilesGroupComponent {...fileGroup}/>
                                <Divider/>
                            </Stack>)
                        }
                    </div>
                }
            </Collapse>
        </Paper>
    );
}

export {FilesUploaderWidget}