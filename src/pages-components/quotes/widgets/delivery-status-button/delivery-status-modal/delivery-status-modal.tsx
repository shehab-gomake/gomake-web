import { Button, Stack } from "@mui/material";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeSelect } from "@/components/auto-complete/go-make-select";
import { GoMakeTextInput } from "@/components/text-input/go-make-text-input";
import { IUpdateDeliveryStatusModalProps } from "../interfaces";
import { useDeliveryStatusModal } from "./use-delivery-status-modal";
import { useStyle } from "../style";
import GoMakePagination from "./test-pagination";

const UpdateDeliveryStatusModal = ({
  delStatusColor,
  documentItem,
  openModal,
  onCloseModal,
}: IUpdateDeliveryStatusModalProps) => {
  const { classes } = useStyle({ color: delStatusColor });
  const {
    t,
    tableHeaders,
    handleChangeDeliveryInputs,
    deliveryState,
    setDeliveryState,
    initialDeliveryState,
    mockRows,
    options,
    client,
    setClient,
    page,
    totalPages,
    handlePageClick,
    handleNextPage,
    handlePrevPage,
    visiblePages,
  } = useDeliveryStatusModal();

  const handleCloseModal = () => {
    onCloseModal();
    setDeliveryState(initialDeliveryState);
  };

  const handleSelectionChange = (selectedRows: Set<number>) => {
    const selectedIds = Array.from(selectedRows).map(
      (index) => mockRows[index][0]
    );
    console.log("Selected IDs:", selectedIds);
  };

  return (
    <GoMakeModal
      modalTitle={`Order #${documentItem?.number}`}
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
            <span style={classes.labelStyle}>Recipient</span>
            <GoMakeSelect
              key={`select-client-${documentItem?.id}`}
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
            <span style={classes.labelStyle}>Recipient name</span>
            <GoMakeTextInput
              key={`receipt-name-${documentItem?.id}`}
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
            <span style={classes.labelStyle}>Recipient number</span>
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
            <span style={classes.labelStyle}>Recipient mail</span>
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
            <span style={classes.labelStyle}>Delivery date</span>
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
          rows={mockRows}
          headers={tableHeaders}
          variant={"RoundTable"}
          enableCheckboxes={true}
          onSelectionChange={handleSelectionChange}
          rowCheckboxCondition={(row) => row[5] !== "Delivered"}
        />

        {/* Pagination */}

        <GoMakePagination
          page={page}
          totalPages={totalPages}
          visiblePages={visiblePages}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handlePageClick={handlePageClick}
        />

        <GomakePrimaryButton
          style={classes.nextBtn}
          onClick={() => console.log("the state is ", deliveryState)}
        >
          {t("Next")}
        </GomakePrimaryButton>
      </Stack>
    </GoMakeModal>
  );
};

export { UpdateDeliveryStatusModal };
