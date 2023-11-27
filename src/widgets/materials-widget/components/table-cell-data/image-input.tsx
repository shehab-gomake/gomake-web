import { useState } from "react";
import { Divider, Menu, MenuItem } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";
import { FileUploadComponent } from "@/widgets/settings-profile-widget/components/upload-file/upload-file-component";
import { useTableCellData } from "./use-table-cell-data";

export interface IPrps {
    parameterKey: string;
    id?: string;
    value: string;
}

const ImageInput = ({ parameterKey, id, value }: IPrps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { classes } = useStyle();
    const { updateCellData } = useTableCellData();
    const [state, setState] = useState<boolean>(false);
    const [modalHeader, setModalHeader] = useState<string>('');
    const [openImageModal, setOpenImageModal] = useState<boolean>(false);
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");

    const onUpload = async (value) => {
        await updateCellData(id, parameterKey, value).then(() => {
            setOpenImageModal(false);
        });
    };

    const handleMoreOptionIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <a onClick={handleMoreOptionIconClick} target="_blank" rel="noopener noreferrer">
                {<img src={value} style={{ maxWidth: '70px', maxHeight: '70px' }} alt="Image" />}
            </a>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                PaperProps={classes.menuItem}
                transformOrigin={{ horizontal: dir == "ltr" ? "left" : "right", vertical: "top" }}
                anchorOrigin={{ horizontal: dir == "ltr" ? "left" : "right", vertical: "bottom" }}
                onClick={handleCloseMenu}
            >
                <MenuItem
                    onClick={() => {
                        setState(true);
                        setModalHeader(t('materials.modals.uploadImage'));
                        setOpenImageModal(true);
                    }}>
                    <div style={classes.menuBtn}>
                        <span>{t('materials.buttons.changeImage')}</span>
                    </div>
                </MenuItem>
                {
                    [
                        <Divider key="divider" />,
                        <MenuItem key="openImage" onClick={() => { window.open(value, '_blank'); handleCloseMenu(); }}>
                            <div style={classes.menuBtn}>
                                <span>{t('materials.buttons.openImage')}</span>
                            </div>
                        </MenuItem>,
                    ]
                }
            </Menu>
            <GoMakeModal
                insideStyle={{ paddingLeft: 0, paddingRight: 0, height: 'fit-content', width: 380 }}
                headerPadding={20}
                openModal={openImageModal && state}
                onClose={() => {
                    setModalHeader('');
                    setOpenImageModal(false);
                    setState(false)
                }}
                modalTitle={modalHeader}
            >
                <FileUploadComponent onUpload={onUpload} />
            </GoMakeModal>
        </>
    );
}

export { ImageInput }