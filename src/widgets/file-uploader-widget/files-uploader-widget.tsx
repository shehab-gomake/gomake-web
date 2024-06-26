import {useRecoilState} from "recoil";
import {openFileUploaderList, pinFileUploaderState, uploadingFilesState} from "@/store/file-uploader-state";
import Stack from "@mui/material/Stack";
import {Collapse, IconButton, Paper} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FilesGroupComponent} from "@/widgets/file-uploader-widget/files-group-component";
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import {printHouseProfile} from "@/store/print-house-profile";

const FilesUploaderWidget = () => {
    const [files] = useRecoilState(uploadingFilesState);
    const [open, setOpen] = useRecoilState(openFileUploaderList);
    const [show, setShow] = useRecoilState(pinFileUploaderState);
    const {grayColor} = useGomakeTheme();
    const [companyProfile] = useRecoilState(printHouseProfile);
    const {t} = useTranslation();
    return (
        companyProfile?.filesApiAddress && <Paper style={{
            position: 'fixed',
            right: '300px',
            bottom: 0,
            zIndex: 9
        }}
        >
            {

            }
            <Collapse in={show} orientation={"vertical"} collapsedSize={0}>
                <Stack justifyContent={'space-between'}
                       direction={'row'}
                       alignItems={'center'}
                       width={'400px'}
                       style={{
                           backgroundColor: grayColor(200),
                           color: grayColor(700),
                           borderRadius: '10px 10px 0 0 ',
                       }}
                       padding={'7px'}>
                    <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                        <CloudUploadRoundedIcon/>
                        <span>{t('fileUploader.uploads')}</span>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'}>
                        <IconButton onClick={() => setOpen(!open)}>
                            {
                                open ? <ExpandMoreIcon/> : <ExpandLessIcon/>
                            }
                        </IconButton>
                        <IconButton onClick={() => {
                            setShow(false);
                            setOpen(false)
                        }}>
                          <CloseIcon/>
                        </IconButton>
                    </Stack>

                </Stack>
            </Collapse>
            <Collapse in={open && show}
                      style={{backgroundColor: '#FFF', maxHeight: '600px', overflow: 'auto'}}>
                {

                    files?.length > 0 && <Stack padding={'7px'} gap={'16px'}>
                        {
                            files.map(fileGroup => <Stack gap={'5px'}>
                                <FilesGroupComponent {...fileGroup}/>
                                <Divider/>
                            </Stack>)
                        }
                    </Stack>
                }
            </Collapse>
        </Paper>
    );
}

export {FilesUploaderWidget}