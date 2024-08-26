import {ChangeEvent, useRef, useState, MouseEvent} from "react";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {useTranslation} from "react-i18next";
interface IProps {
    onSendFile: (file) => void;
    onSendApprovalFile: (file) => void;
    isBoardMissionsRoom: boolean;
}
enum EFileType {
    Approval = 1,
    normal
}
const SendFileMessageButtonComponent = ({onSendFile, isBoardMissionsRoom, onSendApprovalFile}: IProps) => {
    const [, setFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState(EFileType.normal);
    const {primaryColor} = useGomakeTheme();
    const ref = useRef(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {t} = useTranslation();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>, callBack: (file)=>void) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            callBack(event.target.files[0]);
        }
    };
    const onClick = () => {
        if (ref && ref.current) {
            ref.current.click();
        }
    }

    return (
        <>
            <IconButton onClick={isBoardMissionsRoom ? handleClick : onClick}>
               <AttachFileIcon fontSize={'medium'} style={{color: primaryColor(500)}} />
            </IconButton>
            <input ref={ref} type="file" onChange={(e) => handleFileChange(e, fileType === EFileType.Approval ? onSendApprovalFile : onSendFile)} hidden={true}/>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{top: '-60px'}}
            >
                <MenuItem onClick={() => {
                    setFileType(EFileType.Approval);
                    onClick();
                    handleClose();
                }}>{t('messenger.sendGraphicFile')}</MenuItem>
                <MenuItem onClick={()=>{
                    setFileType(EFileType.normal);
                    onClick();
                    handleClose();
                }}>{t('messenger.sendFile')}</MenuItem>
            </Menu>
        </>
    );
}

export {SendFileMessageButtonComponent};