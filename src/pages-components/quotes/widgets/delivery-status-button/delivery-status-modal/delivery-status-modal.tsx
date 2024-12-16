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

const UpdateDeliveryStatusModal = ({
  document,
  openModal,
  onCloseModal,
  documentItems,
  editableQuantities,
  setEditableQuantities,
  setDocumentItems,
  clientContacts,
}: IUpdateDeliveryStatusModalProps) => {
  const { classes } = useStyle();
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

  //!not sure about the condition
  const areAllItemsNotDelivered = () => {
    return documentItems?.some(
      (item) =>
        extractDeliveryStatus(item[4]) === DocumentDeliveryStatuses.NotDelivered
    );
  };

  return (
    <GoMakeModal
      modalTitle={`${t(
        `sales.quote.${DOCUMENT_TYPE[document?.documentType]}`
      )} #${document?.number}`}
      insideStyle={{ width: "70%", height: "fit-content" }}
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
          gap={"10px"}
        >
          <Stack marginBottom={"10px"} direction={"column"} gap={"4px"}>
            <span style={classes.labelStyle}>
              {t("sales.documentDeliveries.recipient")}
            </span>
            <GoMakeSelect
              key={`select-client-${document?.id}`}
              style={{
                width: 170,
                height: "40px",
              }}
              options={clientContacts}
              placeholder={"Select recipient"}
              value={clientContact}
              onChange={handleClientContactChange}
            />
          </Stack>

          <Stack marginBottom={"10px"} direction={"column"} gap={"4px"}>
            <span style={classes.labelStyle}>
              {t("sales.documentDeliveries.recipientName")}
            </span>
            <GoMakeTextInput
              key={`receipt-name-${document?.id}`}
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
            <GoMakeTextInput
              style={{
                width: 170,
                height: "40px",
              }}
              value={deliveryState?.contactPhone}
              onChange={(e) =>
                handleChangeDeliveryInputs("contactPhone", e.target.value)
              }
              placeholder={t("sales.documentDeliveries.recipientNumber")}
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
          {/* <Stack marginBottom={"10px"} direction={"column"} gap={"4px"}>
            <span style={classes.labelStyle}>
              {t("sales.documentDeliveries.deliveryDate")}
            </span>
            <GoMakeTextInput
              style={{
                width: 170,
                height: "40px",
              }}
              type={"date"}
              value={deliveryState?.deliveryDate}
              onChange={(e) =>
                handleChangeDeliveryInputs("deliveryDate", e.target.value)
              }
            />
          </Stack> */}
        </Stack>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={true}
          maxHeight={"calc(100vh - 300px)"}
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
        documentId={document?.id}
        documentType={document?.documentType}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        editableQuantities={editableQuantities}
        setEditableQuantities={setEditableQuantities}
        setDocumentItems={setDocumentItems}
        deliveryState={deliveryState}
      />
    </GoMakeModal>
  );
};

export { UpdateDeliveryStatusModal };
