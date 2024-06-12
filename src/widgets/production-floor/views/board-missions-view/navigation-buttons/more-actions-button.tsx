import { PrimaryButton } from "@/components/button/primary-button";
import { MenuItem, Paper } from "@mui/material";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useUploadFiles } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-upload-files";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTranslation } from "react-i18next";
import { adaptLeft } from "@/utils/adapter";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";

const MoreActionsButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { query, replace, pathname, push } = useRouter();
    const fileInputRef = useRef(null);
    const [companyProfile] = useRecoilState(printHouseProfile);
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const {handleFileUpload} = useUploadFiles(boardMissions?.orderItemId, boardMissions?.filesPath);
    const {t} = useTranslation();
    const direction = t('direction');
    const handleClose = () => {
        setOpen(false);
    };

    const onClickUpdateFile = () => {
        replace({ pathname: pathname, query: { ...query, step: 'files' } }, undefined, { shallow: true }).then();
        if (fileInputRef) {
            fileInputRef.current?.click();
        }
        handleClose();
    }

    const handleClickEdit = () => {
        push(`/products/edit?clientTypeId=${boardMissions.clientTypeId}customerId=${boardMissions.clientId}&productId=${boardMissions.productId}&documentItemId=${boardMissions.orderItemId}&documentType=${1}&documentId=${boardMissions.orderId}`).then()
    }

    const handleFileSelect = (e) => {
        [...e.target.files]?.forEach(async (file) => {
            await handleFileUpload(file)
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <PrimaryButton onClick={() => setOpen(!open)} variant={'contained'}
                sx={{
                    minWidth: '40px',
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    borderRadius: '12px'
                }}><MoreHorizIcon /></PrimaryButton>
            {
                !!open && <ClickOutside onClick={() => setOpen(false)}>
                    <Paper sx={{ position: 'absolute', top: '110%', ...adaptLeft(direction, 0) }}>
                        {
                            !!companyProfile.filesApiAddress &&
                            <MenuItem onClick={onClickUpdateFile}>{t('productionFloor.uploadFile')}</MenuItem>
                        }
                        <MenuItem onClick={handleClickEdit}>{t('productionFloor.edit')}</MenuItem>
                    </Paper>
                </ClickOutside>
            }
            <input type={'file'} multiple value={''} onChange={handleFileSelect} hidden={true} ref={fileInputRef} />
        </div>
    );
}

export { MoreActionsButton }