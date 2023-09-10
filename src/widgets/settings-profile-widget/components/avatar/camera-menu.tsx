import {Divider, IconButton, Menu, MenuItem} from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {useState} from "react";
import {useStyle} from "@/widgets/settings-profile-widget/components/avatar/style";
import {useTranslation} from "react-i18next";
import {GoMakeModal} from "@/components";
import {FileUploadComponent} from "@/widgets/settings-profile-widget/components/upload-file/upload-file-component";
import {
    EditInitialsComponent
} from "@/widgets/settings-profile-widget/components/edit-initials/edit-initials-component";

const CameraMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalComponent, setModalComponent] = useState<JSX.Element>(<div/>);
    const [modalHeader, setModalHeader] = useState<string>('');
    const {classes} = useStyle();
    const {t} = useTranslation();
    const handleMoreOptionIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
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
                        setOpenModal(true);
                        setModalComponent(<FileUploadComponent/>);
                        setModalHeader('Upload file');
                    }}>
                        <div style={classes.menuBtn}>
                            <span>{t('Add profile image')}</span>
                        </div>
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={() => {
                        setOpenModal(true);
                        setModalComponent(<EditInitialsComponent/>);
                        setModalHeader('Edit initials');
                    }}>
                        <div style={classes.menuBtn}>
                            <span>{t('Edit initials')}</span>
                        </div>
                    </MenuItem>
            </Menu>
            <GoMakeModal
                insideStyle={{paddingLeft: 0, paddingRight: 0, height: 'fit-content', width: 380}}
                headerPadding={20}
                openModal={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setModalComponent(<div/>);
                    setModalHeader('');
                }}
                modalTitle={modalHeader}
            >
                {modalComponent}
            </GoMakeModal>
        </>
    )
}

export {CameraMenu}