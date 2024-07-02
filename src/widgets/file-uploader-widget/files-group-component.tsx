import Stack from "@mui/material/Stack";
import {FileComponent} from "@/widgets/file-uploader-widget/file-component";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {IUploadingFileGroup} from "@/widgets/file-uploader-widget/interface";
import {useCallback, useRef, useState} from "react";
import {Backdrop, IconButton} from "@mui/material";
import {useUploadFiles} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-upload-files";
import {FONT_FAMILY} from "@/utils/font-family";
import FolderIcon from '@mui/icons-material/Folder';
import {useRouter} from "next/router";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";

const FilesGroupComponent = ({title, filesInfo, orderItemId, filePath, boardMissionId}: IUploadingFileGroup) => {
    const {primaryColor} = useGomakeTheme();
    const [isOver, setIsOver] = useState(false);
    const {handleFileUpload} = useUploadFiles(orderItemId, filePath);
    const {push} = useRouter();
    const fileInputRef = useRef(null);
    const {t} = useTranslation();

    const handelChooseFileClick = () => {
        if (fileInputRef) {
            fileInputRef.current?.click();
        }
    }
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



    const handleFileSelect = (e) => {
        [...e.target.files]?.forEach(async (file) => {
            // setTempFiles(prevState => [...prevState, file?.name]);
            console.log(file);
            await handleFileUpload(file)
        });
    };

    return (
        <Stack
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            minHeight={'50px'}
            position={'relative'}>
            <Stack direction={'row'} gap={'10px'} justifyContent={'space-between'} alignItems={'center'}>
                <h3 style={{color: primaryColor(400), ...FONT_FAMILY.Inter(700, 14)}}>{title}</h3>
                <Stack direction={'row'} alignItems={'center'}>
                    {
                    filesInfo?.length > 0 &&
                    <IconButton style={{
                        width: '25px',
                        height: '25px',
                        padding: '2px',
                    }}
                                onClick={handelChooseFileClick}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <g id="tabler:drag-drop">
                                <g id="Group">
                                    <path id="Vector"
                                          d="M13.459 7.79159V6.37492C13.459 5.9992 13.3097 5.63886 13.0441 5.37318C12.7784 5.10751 12.418 4.95825 12.0423 4.95825H6.37565C5.99993 4.95825 5.63959 5.10751 5.37392 5.37318C5.10824 5.63886 4.95898 5.9992 4.95898 6.37492V12.0416C4.95898 12.4173 5.10824 12.7776 5.37392 13.0433C5.63959 13.309 5.99993 13.4583 6.37565 13.4583H7.79232"
                                          stroke="#2E3092" stroke-width="1.5" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                    <path id="Vector_2"
                                          d="M2.125 2.125V2.13208M4.95833 2.125V2.13208M7.79167 2.125V2.13208M10.625 2.125V2.13208M2.125 4.95833V4.96542M2.125 7.79167V7.79875M2.125 10.625V10.6321M9.20833 9.20833L15.5833 11.3333L12.75 12.75L11.3333 15.5833L9.20833 9.20833Z"
                                          stroke="#2E3092" stroke-width="1.5" stroke-linecap="round"
                                          stroke-linejoin="round"/>
                                </g>
                            </g>
                        </svg>
                    </IconButton>
                    }
                    <IconButton style={{
                        width: '25px',
                        height: '25px',
                        padding: '2px',
                    }}
                                onClick={() => push(`/production-floor?boardMissionsId=${boardMissionId}&step=files`).then()}>
                        <FolderIcon/>
                    </IconButton>
                </Stack>
            </Stack>
            <Stack>
                <Backdrop style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, margin: '-5px'}}
                          open={isOver}/>
                {
                    filesInfo?.map(file => <FileComponent {...file}/>)
                }
            </Stack>
            {
                filesInfo?.length === 0 &&
                <Stack direction={'row'} alignItems={'center'}>
                    <Button onClick={handelChooseFileClick} style={{
                        color: primaryColor(700),
                        ...FONT_FAMILY.Lexend(700, 15),
                        textTransform: 'none'
                    }}
                            startIcon={<svg width="17" height="17" viewBox="0 0 17 17" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                <g id="tabler:drag-drop">
                                    <g id="Group">
                                        <path id="Vector"
                                              d="M13.459 7.79159V6.37492C13.459 5.9992 13.3097 5.63886 13.0441 5.37318C12.7784 5.10751 12.418 4.95825 12.0423 4.95825H6.37565C5.99993 4.95825 5.63959 5.10751 5.37392 5.37318C5.10824 5.63886 4.95898 5.9992 4.95898 6.37492V12.0416C4.95898 12.4173 5.10824 12.7776 5.37392 13.0433C5.63959 13.309 5.99993 13.4583 6.37565 13.4583H7.79232"
                                              stroke="#2E3092" stroke-width="1.5" stroke-linecap="round"
                                              stroke-linejoin="round"/>
                                        <path id="Vector_2"
                                              d="M2.125 2.125V2.13208M4.95833 2.125V2.13208M7.79167 2.125V2.13208M10.625 2.125V2.13208M2.125 4.95833V4.96542M2.125 7.79167V7.79875M2.125 10.625V10.6321M9.20833 9.20833L15.5833 11.3333L12.75 12.75L11.3333 15.5833L9.20833 9.20833Z"
                                              stroke="#2E3092" stroke-width="1.5" stroke-linecap="round"
                                              stroke-linejoin="round"/>
                                    </g>
                                </g>
                            </svg>}>{t('fileUploader.chooseFile')}</Button>
                    <span style={{
                        color: primaryColor(700),
                        ...FONT_FAMILY.Inter(500, 15),
                    }}>{t('fileUploader.dropFile')}</span>
                </Stack>
            }
            <input type={'file'} multiple value={''} onChange={handleFileSelect} hidden={true} ref={fileInputRef}/>
        </Stack>
    )
}

export {FilesGroupComponent}