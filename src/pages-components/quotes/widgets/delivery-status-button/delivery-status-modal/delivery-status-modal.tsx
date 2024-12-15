import { Stack } from "@mui/material";
import { GoMakeModal } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeSelect } from "@/components/auto-complete/go-make-select";
import { GoMakeTextInput } from "@/components/text-input/go-make-text-input";
import { IUpdateDeliveryStatusModalProps } from "../interfaces";
import { useDeliveryStatusModal } from "./use-delivery-status-modal";
import { useStyle } from "./style";
import { SignatureModal } from "./components/signature-modal";
import { PrimaryButton } from "@/components/button/primary-button";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const UpdateDeliveryStatusModal = ({
  document,
  openModal,
  onCloseModal,
  documentItems,
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
    client,
    setClient,
    isSignatureModalOpen,
    openSignatureModal,
    closeSignatureModal,
    extractDeliveryStatus,
    handleSelectionChange,
    selectedItems,
  } = useDeliveryStatusModal(documentItems);

  const handleCloseModal = () => {
    onCloseModal();
    setDeliveryState(initialDeliveryState);
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
              options={options}
              placeholder={"Select recipient"}
              value={client}
              onChange={(event, value) => setClient(value)}
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
              value={deliveryState?.recipientName}
              onChange={(e) =>
                handleChangeDeliveryInputs("recipientName", e.target.value)
              }
              placeholder="Recipient name"
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
              value={deliveryState?.recipientNumber}
              onChange={(e) =>
                handleChangeDeliveryInputs("recipientNumber", e.target.value)
              }
              placeholder="Recipient number"
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
              value={deliveryState?.recipientMail}
              onChange={(e) =>
                handleChangeDeliveryInputs("recipientMail", e.target.value)
              }
              placeholder="Recipient mail"
            />
          </Stack>
          <Stack marginBottom={"10px"} direction={"column"} gap={"4px"}>
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
          </Stack>
        </Stack>

        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={true}
          maxHeight={"calc(100vh - 300px)"}
          // rows={mockRows}
          rows={documentItems}
          headers={tableHeaders}
          variant={"RoundTable"}
          enableCheckboxes={true}
          onSelectionChange={handleSelectionChange}
          rowCheckboxCondition={(row) => {
            const status = extractDeliveryStatus(row[5]);
            return status !== "FullyDelivered";
          }}
        />

        {/* Pagination */}
        {/* <GoMakePagination
          page={page}
          totalPages={totalPages}
          visiblePages={visiblePages}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handlePageClick={handlePageClick}
        /> */}

        <PrimaryButton
          variant="contained"
          style={classes.nextBtn}
          onClick={openSignatureModal}
        >
          {t("sales.documentDeliveries.next")}
        </PrimaryButton>
      </Stack>
      <SignatureModal
        openModal={isSignatureModalOpen}
        onCloseModal={closeSignatureModal}
        onCloseUpdateModal={handleCloseModal}
        documentId={document?.id}
        documentType={document?.documentType}
        selectedItems={selectedItems}
      />
    </GoMakeModal>
  );
};

export { UpdateDeliveryStatusModal };
