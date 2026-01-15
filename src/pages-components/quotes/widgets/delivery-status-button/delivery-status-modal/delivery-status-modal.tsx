import { Stack } from "@mui/material";
import { GoMakeModal } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeSelect } from "@/components/auto-complete/go-make-select";
import { GoMakeTextInput } from "@/components/text-input/go-make-text-input";
import { IUpdateDeliveryStatusModalProps } from "../utils/interfaces";
import {
  DocumentDeliveryStatuses,
  useDeliveryStatusModal,
} from "./use-delivery-status-modal";
import { useStyle } from "./style";
import { SignatureModal } from "./components/signature-modal";
import { PrimaryButton } from "@/components/button/primary-button";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { PhoneInputComponent } from "@/components/form-inputs/phone-input";
import { useIsMobile } from "@/hooks/use-responsive";
import { useRouter } from "next/router";

const UpdateDeliveryStatusModal = ({
  document,
  openModal,
  onCloseModal,
  documentItems,
  editableQuantities,
  setEditableQuantities,
  setDocumentItems,
  clientContacts,
  documentType,
  documentId,
  documentNumber,
  onClickOpenMoveOrderToReadyModal,
  getAllQuotes,
}: IUpdateDeliveryStatusModalProps) => {
  const { classes } = useStyle();
  const isMobile = useIsMobile();
  const {
    t,
    tableHeaders,
    handleChangeDeliveryInputs,
    deliveryState,
    setDeliveryState,
    initialDeliveryState,
    options,
    clientContact,
    setClientContact,
    isSignatureModalOpen,
    openSignatureModal,
    closeSignatureModal,
    extractDeliveryStatus,
    handleSelectionChange,
    selectedItems,
    setSelectedItems,
    handleClientContactChange,
  } = useDeliveryStatusModal(documentItems);

  const handleCloseModal = () => {
    onCloseModal();
    setDeliveryState(initialDeliveryState);
    setClientContact(null);
  };

  const handleCloseSignModal = () => {
    closeSignatureModal();
    handleCloseModal();
  };

  const areAllItemsNotDelivered = () => {
    return documentItems?.some(
      (item) =>
        extractDeliveryStatus(item[4]) === DocumentDeliveryStatuses.NotDelivered
    );
  };
  const router = useRouter();
  return (
    <GoMakeModal
      modalTitle={router.query.isComeFromQR ? `${t(`sales.quote.${DOCUMENT_TYPE[documentType]}`)} #${router.query.orderNumber}` : `${t(`sales.quote.${DOCUMENT_TYPE[documentType]}`)} #${documentNumber ?? document?.number
        }`}
      insideStyle={{
        width: isMobile ? "95vw" : "70%",
        height: isMobile ? "unset" : "fit-content",
        ...(isMobile && { padding: "10px 10px 0px 10px", maxHeight: "70vh" }),
      }}
      openModal={openModal}
      onClose={handleCloseModal}
      modalTitleStyle={classes.modalTitle}
      withRoundedCloseIcon={false}
    >
      <Stack marginBottom={"10px"} direction={"column"} gap={"10px"}>
        <Stack
          display={"flex"}
          flexWrap={"wrap"}
          direction={"row"}
          gap={isMobile ? "5px" : "10px"}
        >
          <Stack marginBottom={"10px"} direction={"column"} gap={"4px"}>
            <span style={classes.labelStyle}>
              {t("sales.documentDeliveries.recipient")}
            </span>
            <GoMakeSelect
              key={`select-client-${documentId}`}
              style={{
                width: 170,
                height: "40px",
              }}
              options={clientContacts}
              placeholder={t("sales.documentDeliveries.selectRecipient")}
              value={clientContact}
              onChange={handleClientContactChange}
            />
          </Stack>
          <Stack marginBottom={"10px"} direction={"column"} gap={"4px"}>
            <span style={classes.labelStyle}>
              {t("sales.documentDeliveries.recipientName")}
            </span>
            <GoMakeTextInput
              key={`receipt-name-${documentId}`}
              style={{
                width: 170,
                height: "40px",
              }}
              value={deliveryState?.contactName}
              onChange={(e) =>
                handleChangeDeliveryInputs("contactName", e.target.value)
              }
              placeholder={t("sales.documentDeliveries.recipientName")}
            />
          </Stack>
          <Stack marginBottom={"10px"} direction={"column"} gap={"4px"}>
            <span style={classes.labelStyle}>
              {t("sales.documentDeliveries.recipientNumber")}
            </span>
            <PhoneInputComponent
              customStyle={{
                width: 170,
                height: "40px",
              }}
              value={deliveryState?.contactPhone}
              onChange={(e) => handleChangeDeliveryInputs("contactPhone", e)}
              variant="circular"
            />
          </Stack>
          <Stack marginBottom={"10px"} direction={"column"} gap={"4px"}>
            <span style={classes.labelStyle}>
              {t("sales.documentDeliveries.recipientMail")}
            </span>
            <GoMakeTextInput
              style={{
                width: 170,
                height: "40px",
              }}
              value={deliveryState?.contactEmail}
              onChange={(e) =>
                handleChangeDeliveryInputs("contactEmail", e.target.value)
              }
              placeholder={t("sales.documentDeliveries.recipientMail")}
            />
          </Stack>
        </Stack>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={true}
          maxHeight={isMobile ? "30vh" : "calc(100vh - 300px)"}
          rows={documentItems}
          headers={tableHeaders}
          variant={"RoundTable"}
          enableCheckboxes={true}
          onSelectionChange={handleSelectionChange}
          rowCheckboxCondition={(row) => {
            const status = extractDeliveryStatus(row[4]);
            return (
              status !== DocumentDeliveryStatuses.FullyDelivered &&
              status !== DocumentDeliveryStatuses.PartiallyDelivered
            );
          }}
        />
        <PrimaryButton
          variant="contained"
          style={classes.nextBtn}
          onClick={openSignatureModal}
          disabled={!areAllItemsNotDelivered()}
        >
          {t("sales.documentDeliveries.next")}
        </PrimaryButton>
      </Stack>
      <SignatureModal
        openModal={isSignatureModalOpen}
        onCloseModal={closeSignatureModal}
        onCloseAllModals={handleCloseSignModal}
        document={document}
        documentId={documentId}
        documentType={documentType}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        editableQuantities={editableQuantities}
        setEditableQuantities={setEditableQuantities}
        setDocumentItems={setDocumentItems}
        deliveryState={deliveryState}
        isMobile={isMobile}
        onClickOpenMoveOrderToReadyModal={onClickOpenMoveOrderToReadyModal}
        getAllQuotes={getAllQuotes}
      />
    </GoMakeModal>
  );
};

export { UpdateDeliveryStatusModal };
