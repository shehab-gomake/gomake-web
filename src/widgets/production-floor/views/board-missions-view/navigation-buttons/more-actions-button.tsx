import { PrimaryButton } from "@/components/button/primary-button";
import { CircularProgress, MenuItem, Paper } from "@mui/material";
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
import {
    IContact,
    SelectContactComponent
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/select-contact-component";
import {getDocumentContactsApi} from "@/services/api-service/documents/documents-service-api";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {createBoardMissionsChatRoomApi} from "@/services/api-service/chat/quick-blox-chat-endpoints";

const MoreActionsButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { query, replace, pathname, push } = useRouter();
    const fileInputRef = useRef(null);
    const [companyProfile] = useRecoilState(printHouseProfile);
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const { handleFileUpload } = useUploadFiles(boardMissions?.orderItemId, boardMissions?.filesPath);
    const { t } = useTranslation();
    const direction = t('direction');
    const [loading] = useState<boolean>(false);
    const [openSendGraphicFileModal, setOpenSendGraphicFileModal] = useState<boolean>(false);
    const [contacts, setContacts] = useState<IContact[]>([]);
    const {callApi} = useGomakeAxios();
    const { alertFaultGetData } = useSnackBar();


    const getBoardMissionChatRoomId = async (selectedContact, setLoading) => {
        setLoading(true)
        setOpen(false);
        const callBack = res => {
            setLoading(false);
            if (res.success) {
                push(`/messenger?dialogId=${res.data?._id}`)
            } else {
                alertFaultGetData();
            }
        }
        await createBoardMissionsChatRoomApi(callApi, callBack, { boardMissionId: boardMissions.boardMissionId, ...selectedContact })
    }
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
        push(`/products/edit?clientTypeId=${boardMissions.clientTypeId}&customerId=${boardMissions.clientId}&customerName=${boardMissions.clientName}&productId=${boardMissions.productId}&documentItemId=${boardMissions.orderItemId}&documentType=${1}&documentNumber=${boardMissions?.orderNumber}&documentId=${boardMissions.orderId}`).then()
    }

    const handleFileSelect = (e) => {
        [...e.target.files]?.forEach(async (file) => {
            await handleFileUpload(file)
        });
    };
    const getDocumentContacts = async () => {
        const callBack = (res) => {
            if (res.success) {
                setContacts(res.data);
                setOpenSendGraphicFileModal(true)
            }
        }
        await getDocumentContactsApi(callApi, callBack, boardMissions.orderId);
    }

    return (
        <div style={{ position: 'relative', zIndex: 9999999999 }}>
            <PrimaryButton disabled={loading} onClick={() => setOpen(!open)} variant={'contained'}
                sx={{
                    minWidth: '40px',
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    borderRadius: '12px'
                }}>{loading ? <CircularProgress size={'20px'} /> : <MoreHorizIcon />}</PrimaryButton>
            {
                !!open && <ClickOutside onClick={() => setOpen(false)}>
                    <Paper sx={{ position: 'absolute', top: '110%', ...adaptLeft(direction, 0) }}>
                        {
                            !!companyProfile.filesApiAddress &&
                            <MenuItem onClick={onClickUpdateFile}>{t('productionFloor.uploadFile')}</MenuItem>
                        }
                        <MenuItem onClick={handleClickEdit}>{t('productionFloor.edit')}</MenuItem>
                        <MenuItem
                            onClick={getDocumentContacts}>{t('productionFloor.sendGraphicsApprove')}</MenuItem>
                    </Paper>
                </ClickOutside>
            }
            <input type={'file'} multiple value={''} onChange={handleFileSelect} hidden={true} ref={fileInputRef} />
            <SelectContactComponent onSend={getBoardMissionChatRoomId} contacts={contacts} openModal={openSendGraphicFileModal}
                onClose={() => setOpenSendGraphicFileModal(false)} />
        </div>
    );
}

export { MoreActionsButton }