import { PrimaryButton } from "@/components/button/primary-button";
import { CircularProgress, MenuItem, Paper } from "@mui/material";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useTranslation } from "react-i18next";
import { adaptLeft } from "@/utils/adapter";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import {
  IContact,
  SelectContactComponent,
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/select-contact-component";
import { getDocumentContactsApi } from "@/services/api-service/documents/documents-service-api";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { createBoardMissionsChatRoomApi } from "@/services/api-service/chat/quick-blox-chat-endpoints";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
} from "@/store/file-uploader-state";
import { addBoardMissionsToFileUploaderApi } from "@/services/api-service/board-missions/board-missions-table";
import { ungroupJobsApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useFrontDeskEmailIntegration } from "@/pages-components/quotes/hooks/use-frontdesk-email-integration";
import { FrontDeskEmailComposerWrapper } from "@/pages-components/quotes/components/frontdesk-email-composer-wrapper";
import { GraphicsApprovalUploadModal } from "./graphics-approval-upload-modal";

const MoreActionsButton = ({ isMobile = false }) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const { callApi } = useGomakeAxios();
  const { query, push } = useRouter();
  const { alertFaultGetData, alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [loading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [companyProfile] = useRecoilState(printHouseProfile);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const [openSendGraphicFileModal, setOpenSendGraphicFileModal] =
    useState<boolean>(false);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [, setOpenFileUploader] = useRecoilState(openFileUploaderList);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const [openGraphicsApprovalUploadModal, setOpenGraphicsApprovalUploadModal] =
    useState<boolean>(false);

  // Email composer integration with document type 16 (OLD FUNCTIONALITY - KEPT FOR REFERENCE)
  const {
    isEmailComposerOpen,
    emailData,
    isLoadingEmailData,
    openEmailComposer,
    closeEmailComposer,
  } = useFrontDeskEmailIntegration({ documentType: 16 as any });

  const getBoardMissionChatRoomId = async (selectedContact, setLoading) => {
    setLoading(true);
    setOpen(false);
    const callBack = (res) => {
      setLoading(false);
      if (res.success) {
        push(`/messenger?dialogId=${res.data?._id}`);
      } else {
        alertFaultGetData();
      }
    };
    await createBoardMissionsChatRoomApi(callApi, callBack, {
      boardMissionId: boardMissions.boardMissionId,
      ...selectedContact,
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onClickUploadFile = async () => {
    const callBack = (res) => {
      if (res?.success) {
        handleClose();
        setOpenFileUploader(true);
        setShowFileUploader(true);
      } else {
      }
    };
    await addBoardMissionsToFileUploaderApi(callApi, callBack, {
      boardMissionsId: query.boardMissionsId,
      connectionId: connectionId,
    });
  };

  const handleClickEdit = () => {
    push(
      `/products/edit?clientTypeId=${boardMissions.clientTypeId}&customerId=${boardMissions.clientId
      }&customerName=${boardMissions.clientName}&productId=${boardMissions.productId
      }&documentItemId=${boardMissions.orderItemId
      }&documentType=${1}&documentNumber=${boardMissions?.orderNumber
      }&documentId=${boardMissions.orderId}`
    ).then();
  };

  // OLD FUNCTIONALITY - Opens email composer (KEPT FOR REFERENCE)
  const getDocumentContactsOld = async () => {
    handleClose(); // Close the menu
    // Open email composer with document type 16
    await openEmailComposer(
      boardMissions.boardMissionId,
      boardMissions.clientEmail,
      boardMissions.clientPhone,
      undefined, // messageType
      true, // sendMailIfNotVerifiedAgent
      false, // sendWithInvoices
      boardMissions.clientId,
      boardMissions.clientName,
      boardMissions.contactName
    );
  };

  // NEW FUNCTIONALITY - Opens file upload modal
  const getDocumentContacts = () => {
    handleClose(); // Close the menu
    setOpenGraphicsApprovalUploadModal(true);
  };

  const handleClickUnGroupJob = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        handleClose();

      }
      else {
        alertFaultUpdate();
      }
    };
    await ungroupJobsApi(callApi, callBack, boardMissions.boardMissionId);
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ position: "relative", zIndex: 9999999999 }}>
      <PrimaryButton
        ref={buttonRef}
        disabled={loading}
        onClick={(e) => {
          e.stopPropagation(); // Prevent ClickOutside from closing the menu
          setOpen((prevState) => !prevState); // Toggle state with a callback
        }}
        variant={"contained"}
        sx={{
          minWidth: isMobile ? "30px" : "40px",
          width: isMobile ? "30px" : "40px",
          height: isMobile ? "30px" : "40px",
          padding: 0,
          borderRadius: isMobile ? "8px" : "12px",
        }}
      >
        {loading ? <CircularProgress size={"20px"} /> : <MoreHorizIcon />}
      </PrimaryButton>
      {!!open && (
        <ClickOutside exceptionRef={buttonRef} onClick={() => setOpen(false)}>
          <Paper
            sx={{
              position: "absolute",
              top: "110%",
              ...adaptLeft(direction, 0),
            }}
          >
            {!!companyProfile.filesApiAddress && (
              <MenuItem onClick={onClickUploadFile}>
                {t("productionFloor.uploadFile")}
              </MenuItem>
            )}
            <MenuItem onClick={handleClickEdit}>
              {t("productionFloor.edit")}
            </MenuItem>
            <MenuItem onClick={handleClickUnGroupJob}>
              {t("productionFloor.unGroupJob")}
            </MenuItem>
            <MenuItem onClick={getDocumentContacts}>
              {t("productionFloor.sendGraphicsApprove")}
            </MenuItem>
          </Paper>
        </ClickOutside>
      )}

      <SelectContactComponent
        onSend={getBoardMissionChatRoomId}
        contacts={contacts}
        openModal={openSendGraphicFileModal}
        onClose={() => setOpenSendGraphicFileModal(false)}
      />

      {/* NEW: Graphics Approval Upload Modal */}
      <GraphicsApprovalUploadModal
        openModal={openGraphicsApprovalUploadModal}
        onClose={() => setOpenGraphicsApprovalUploadModal(false)}
        boardMissionId={boardMissions.boardMissionId}
        orderItemId={boardMissions.orderItemId}
        productType={boardMissions.productType}
      />

      {/* OLD: Email Composer Wrapper for Graphics Approval (KEPT FOR REFERENCE) */}
      <FrontDeskEmailComposerWrapper
        open={isEmailComposerOpen}
        onClose={closeEmailComposer}
        emailData={emailData}
        documentId={boardMissions.boardMissionId}
        documentType={16 as any}
        isLoading={isLoadingEmailData}
      />
    </div>
  );
};

export { MoreActionsButton };
