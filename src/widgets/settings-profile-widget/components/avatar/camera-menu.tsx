import {Divider, IconButton, Menu, MenuItem} from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {useEffect, useState} from "react";
import {useStyle} from "@/widgets/settings-profile-widget/components/avatar/style";
import {useTranslation} from "react-i18next";
import {GoMakeModal} from "@/components";
import {FileUploadComponent} from "@/widgets/settings-profile-widget/components/upload-file/upload-file-component";
import {
    EditInitialsComponent
} from "@/widgets/settings-profile-widget/components/edit-initials/edit-initials-component";
import {useRecoilState} from "recoil";
import {
    changeProfileImageState,
    changeProfileInitialsState
} from "@/widgets/settings-profile-widget/state/change-profile-image";
import {ICameraMenuProps} from "@/widgets/settings-profile-widget/components/avatar/interface";

const CameraMenu = ({onUploadImage, changeInitials}: ICameraMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [state, setState] = useState<boolean>(false);
    const [openImageModal, setOpenImageModal] = useRecoilState<boolean>(changeProfileImageState);
    const [openInitialsModal, setOpenInitialsModal] = useRecoilState<boolean>(changeProfileInitialsState);
    const [modalHeader, setModalHeader] = useState<string>('');
    const {classes} = useStyle();
    const {t} = useTranslation();
    const handleMoreOptionIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        if (!openImageModal) {
            setState(openImageModal)
        }
    }, [openImageModal])
    return (
        <>
            <IconButton
                onClick={handleMoreOptionIconClick}
                sx={classes.button}
                size={"small"}
            >
                <CameraAltIcon sx={{width: 13, height: 18}}>M</CameraAltIcon>
            </IconButton>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                PaperProps={classes.menuItem}
                transformOrigin={{horizontal: "right", vertical: "top"}}
                anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                onClick={handleCloseMenu}
            >
                <MenuItem onClick={() => {
                    setState(true);
                    setModalHeader(t('usersSettings.uploadFile'));
                    setOpenImageModal(true);
                }}>
                    <div style={classes.menuBtn}>
                        <span>{t('usersSettings.addProfileImage')}</span>
                    </div>
                </MenuItem>
                {
                    changeInitials && <>
                        <Divider/>
                        <MenuItem onClick={() => {
                            setModalHeader(t('usersSettings.editInitials'));
                            setOpenInitialsModal(true);
                        }}>
                            <div style={classes.menuBtn}>
                                <span>{t('usersSettings.editInitials')}</span>
                            </div>
                        </MenuItem>
                    </>
                }
            </Menu>
            <GoMakeModal
                insideStyle={{paddingLeft: 0, paddingRight: 0, height: 'fit-content', width: 380}}
                headerPadding={20}
                openModal={openImageModal && state}
                onClose={() => {
                    setModalHeader('');
                    setOpenImageModal(false);
                    setState(false)
                }}
                modalTitle={modalHeader}
            >
                <FileUploadComponent onUpload={onUploadImage}/>
            </GoMakeModal>

            <GoMakeModal
                insideStyle={{paddingLeft: 0, paddingRight: 0, height: 'fit-content', width: 380}}
                headerPadding={20}
                openModal={openInitialsModal}
                onClose={() => {
                    setModalHeader('');
                    setOpenInitialsModal(false)
                }}
                modalTitle={modalHeader}
            >
                <EditInitialsComponent/>
            </GoMakeModal>
        </>
    )
}

export {CameraMenu}