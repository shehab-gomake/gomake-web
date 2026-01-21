import { PrimaryButton } from "@/components/button/primary-button";
import { CircularProgress, MenuItem, Paper, FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
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
import { GoMakeDeleteModal } from "@/components/modal-deleted/modal";
import { ModalType } from "@/enums";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { moveOrderToReadyApi } from "@/services/api-service/generic-doc/documents-api";
import { GraphicsApprovalViewModal } from "@/widgets/production-floor/table-view/status-table/table-row/graphics-approval-view-modal";

const MoreActionsButton = ({ isMobile = false }) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const { callApi } = useGomakeAxios();
  const { query, push } = useRouter();
  const { alertFaultGetData, alertSuccessUpdate, alertFaultUpdate, alertSuccess, alertFault } = useSnackBar();
  const { primaryColor } = useGomakeTheme();
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
  const [openGraphicsApprovalViewModal, setOpenGraphicsApprovalViewModal] =
    useState<boolean>(false);

  // Modal state for close as delivery note/invoice
  const [openChangeProductionStatusModal, setOpenChangeProductionStatusModal] = useState<boolean>(false);
  const [isMoveToReady, setIsMoveToReady] = useState(false);
  const [moveToReadyOption, setMoveToReadyOption] = useState<"withMessage" | "withoutMessage">("withoutMessage");
  const [isSelectedCLoseAsDeliveryNote, setIsSelectedCLoseAsDeliveryNote] = useState(false);
  const [isSelectedCLoseAsInvoice, setIsSelectedCLoseAsInvoice] = useState(false);

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

  // NEW FUNCTIONALITY - Opens file upload modal or view modal based on status
  const getDocumentContacts = () => {
    handleClose(); // Close the menu
    // If graphics approval status exists, open view modal (edit mode)
    // Otherwise, open upload modal (new approval)
    if (boardMissions.showGraphicsApprovalAlert !== undefined && boardMissions.showGraphicsApprovalAlert !== null) {
      setOpenGraphicsApprovalViewModal(true);
    } else {
      setOpenGraphicsApprovalUploadModal(true);
    }
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

  const handleCheckboxChange = () => {
    const newValue = !isMoveToReady;
    setIsMoveToReady(newValue);
    if (newValue) {
      setMoveToReadyOption("withoutMessage");
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMoveToReadyOption(event.target.value as "withMessage" | "withoutMessage");
  };

  const onClickCloseChangeProductionStatusModal = () => {
    setOpenChangeProductionStatusModal(false);
    setIsMoveToReady(false);
    setIsSelectedCLoseAsDeliveryNote(false);
    setIsSelectedCLoseAsInvoice(false);
  };

  const moveOrderToReady = async (isSendMessage: boolean = false) => {
    if (!boardMissions?.orderId) return;

    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        onClickCloseChangeProductionStatusModal();
        // Refresh the page or update state as needed
        if (isSelectedCLoseAsDeliveryNote) {
          window.open(`/deliveryNote?isNewCreation=true&orderId=${boardMissions.orderId}`, '_blank');
        } else if (isSelectedCLoseAsInvoice) {
          window.open(`/invoice?isNewCreation=true&orderId=${boardMissions.orderId}`, '_blank');
        }
      } else {
        alertFaultUpdate();
      }
    };

    await moveOrderToReadyApi(callApi, callBack, {
      orderId: boardMissions.orderId,
      isSendMessage,
    });
  };

  const handleCloseAsDeliveryNote = () => {
    handleClose();
    if (!boardMissions?.orderId) return;

    // Check if order is not ready (isReady = false)
    if (boardMissions.isReady === false) {
      setIsSelectedCLoseAsDeliveryNote(true);
      setOpenChangeProductionStatusModal(true);
    } else {
      // If ready, directly open delivery note
      window.open(`/deliveryNote?isNewCreation=true&orderId=${boardMissions.orderId}`, '_blank');
    }
  };

  const handleCloseAsInvoice = () => {
    handleClose();
    if (!boardMissions?.orderId) return;

    // Check if order is not ready (isReady = false)
    if (boardMissions.isReady === false) {
      setIsSelectedCLoseAsInvoice(true);
      setOpenChangeProductionStatusModal(true);
    } else {
      // If ready, directly open invoice
      window.open(`/invoice?isNewCreation=true&orderId=${boardMissions.orderId}`, '_blank');
    }
  };

  const handleViewLikeOrder = () => {
    handleClose();
    if (!boardMissions?.orderId) return;
    push(`/orders?orderId=${boardMissions.orderId}`).then();
  };

  const handleCopyFilesPath = async () => {
    handleClose();
    // First check if filesPath is already in the state
    if (boardMissions?.filesPath) {
      try {
        debugger;
        const localFilePathMapping = companyProfile.localFilePathMapping;
        //localFilePathMapping = "c:\\gomake-graphics-approval";
        let pathToCopy = boardMissions.filesPath;
        const mapping = localFilePathMapping.replace(/[/\\]+$/, '');
        const filePathPart = pathToCopy.replace(/^[/\\]+/, '');
        // Join with appropriate separator based on the mapping (Windows uses \, Unix uses /)
        const separator = mapping.includes('\\') ? '\\' : '/';
        pathToCopy = `${mapping}${separator}${filePathPart}`;
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(pathToCopy);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = pathToCopy ;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        alertSuccess(t("productionFloor.filesPathCopiedToClipboard"));
        return;
      } catch (error) {
        alertFault(t("productionFloor.failedToCopyFilesPath") || "");
        return;
      }
    }
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
              {boardMissions.showGraphicsApprovalAlert !== undefined && boardMissions.showGraphicsApprovalAlert !== null
                ? t("productionFloor.editGraphicsApproval") || "Edit Graphics Approval"
                : t("productionFloor.sendGraphicsApprove")}
            </MenuItem>
            <MenuItem onClick={handleCopyFilesPath}>
              {t("productionFloor.copyFilesPath")}
            </MenuItem>
            {boardMissions?.orderId && (
              <>
                <MenuItem onClick={handleCloseAsDeliveryNote}>
                  {t("sales.quote.closeAsDeliveryNote")}
                </MenuItem>
                <MenuItem onClick={handleCloseAsInvoice}>
                  {t("sales.quote.closeAsInvoice")}
                </MenuItem>
              </>
            )}
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
        orderId={boardMissions.orderId}
        productType={boardMissions.productType}
        jobGraphicApprovalId={undefined}
        onSuccess={() => { }}
      />

      {/* Graphics Approval View Modal (Edit Mode) */}
      {boardMissions?.boardMissionId && (
        <GraphicsApprovalViewModal
          open={openGraphicsApprovalViewModal}
          onClose={() => setOpenGraphicsApprovalViewModal(false)}
          boardMissionId={boardMissions.boardMissionId}
          orderItemId={boardMissions.orderItemId}
          orderId={boardMissions.orderId}
          productType={boardMissions.productType}
        />
      )}

      {/* OLD: Email Composer Wrapper for Graphics Approval (KEPT FOR REFERENCE) */}
      <FrontDeskEmailComposerWrapper
        open={isEmailComposerOpen}
        onClose={closeEmailComposer}
        emailData={emailData}
        documentId={boardMissions.boardMissionId}
        documentType={16 as any}
        isLoading={isLoadingEmailData}
      />

      {/* Modal for Close as Delivery Note/Invoice */}
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={
          isSelectedCLoseAsDeliveryNote
            ? "customers.modal.closeOrderAsDeliveryNote"
            : "customers.modal.closeOrderAsInvoice"
        }
        subTitle={"customers.modal.thisOrderIsAlreadyInProcess"}
        yesBtn={
          isSelectedCLoseAsDeliveryNote
            ? t("customers.modal.closeAsDeliveryNote")
            : t("customers.modal.closeAsInvoice")
        }
        openModal={openChangeProductionStatusModal}
        onClose={onClickCloseChangeProductionStatusModal}
        onClickDelete={() => {
          if (isMoveToReady) {
            moveOrderToReady(moveToReadyOption === "withMessage");
          } else {
            if (isSelectedCLoseAsDeliveryNote) {
              window.open(`/deliveryNote?isNewCreation=true&orderId=${boardMissions.orderId}`, '_blank');
              onClickCloseChangeProductionStatusModal();
            } else if (isSelectedCLoseAsInvoice) {
              window.open(`/invoice?isNewCreation=true&orderId=${boardMissions.orderId}`, '_blank');
              onClickCloseChangeProductionStatusModal();
            }
          }
        }}
      >
        <Stack alignItems={"center"} spacing={2}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: isMoveToReady ? "black" : "#475467",
            }}
          >
            <PrimaryCheckbox
              checked={isMoveToReady}
              onChange={handleCheckboxChange}
            />
            {t("sales.moveToReadyAndCloseOrder")}
          </div>
          {isMoveToReady && (
            <RadioGroup
              row
              value={moveToReadyOption}
              onChange={handleRadioChange}
              style={{ marginTop: 8 }}
            >
              <FormControlLabel
                value="withoutMessage"
                control={
                  <Radio
                    sx={{ transform: "scale(0.8)", p: 0.5 }}
                    style={{ color: primaryColor(300) }}
                  />
                }
                label={t("sales.moveToReadyWithoutMessage")}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    ...FONT_FAMILY.Lexend(500, 13),
                  },
                }}
              />
              <FormControlLabel
                value="withMessage"
                control={
                  <Radio
                    sx={{ transform: "scale(0.8)", p: 0.5 }}
                    style={{ color: primaryColor(300) }}
                  />
                }
                label={t("sales.moveToReadyWithMessage")}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    ...FONT_FAMILY.Lexend(500, 13),
                  },
                }}
              />
            </RadioGroup>
          )}
        </Stack>
      </GoMakeDeleteModal>
    </div>
  );
};

export { MoreActionsButton };
