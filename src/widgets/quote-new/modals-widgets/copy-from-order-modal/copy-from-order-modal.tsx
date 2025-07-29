import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeModal, GomakePrimaryButton, SecondSwitch } from "@/components";
import { useCopyFromOrderModal } from "./use-copy-from-order-modal";
import { OrderTableWidget } from "./order-table";
import { useStyle } from "./style";
import {Checkbox, Skeleton} from "@mui/material";
import { NoDataComponent } from "../../receipts-table/Payment-methods-details/no-data-component";
import {CheckboxCheckedIcon, CheckboxIcon} from "@/icons";

const CopyFromOrderModal = ({
  openModal,
  onClose,
  documentType,
  copyFromDocumentType,
}) => {
  const { classes } = useStyle();
  const {
    t,
    setTerm,
    modalLabel,
    buttonLabel,
    quoteItemValue,
    PrimaryTableCell,
    columnWidths,
    tableHeaders,
    documentItems,
    handleItemSelect,
    handleSelectAll,
    areAllItemsSelected,
    selectedItems,
    totalPrice,
    filterItems,
    addOrdersToDeliveryNote,
    setShowReadyOnly,
    showReadyOnly,
    isCopyFromOrder,
    setDocumentItems,
    showReadyJobs,
    setShowReadyJobs,
    isLoadingPayments,
    hasFetchedOnce,
    noDocumentData,
    handleSelectAllDocuments
  } = useCopyFromOrderModal({
    onClose,
    documentType,
    openModal,
    copyFromDocumentType,
  });

  const isEmpty =
    !isLoadingPayments && hasFetchedOnce && documentItems?.length === 0;

  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle={`${modalLabel()} ${quoteItemValue?.client?.name}`}
      onClose={() => {
        setDocumentItems([]);
        onClose();
      }}
      insideStyle={classes.insideStyle}
    >
      <div style={classes.mainContainer}>
        <div style={classes.headerContainer}>
          {isLoadingPayments ? (
            <div style={classes.filtersContainer}>
              <div style={classes.searchContainer}>
                <Skeleton variant="text" width={100} height={30} />
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={40}
                  style={{ marginTop: "10px" }}
                />
              </div>
              <div style={classes.switchContainer}>
                <Skeleton
                  variant="text"
                  width={150}
                  height={30}
                  style={{ marginLeft: "10px" }}
                />
              </div>
            </div>
          ) : documentItems?.length > 0 ? (
              <div style={classes.filtersContainer}>
                <div style={classes.searchContainer}>
                  <div style={classes.searchLabelStyle}>
                    {t("sales.quote.searchBy")}
                  </div>
                  <SearchInputComponent onChange={setTerm}/>
                </div>
                <div style={classes.switchContainer}>
                  <SecondSwitch
                      checked={showReadyOnly}
                      onChange={(e) => setShowReadyOnly(e.target.checked)}
                  />
                  <span style={classes.switchLabel}>
                  {t("sales.cart.showReadyItems")}
                </span>
                </div>

                <div style={classes.switchContainer}>
                  <SecondSwitch
                      checked={showReadyJobs}
                      onChange={(e) => setShowReadyJobs(e.target.checked)}
                  />
                  <span style={classes.switchLabel}>
                  {t("sales.cart.showReadyJobs")}
                </span>
                </div>
                
              </div>
          ) : null}
        </div>

        <div style={classes.bodyContainer}>
          {isLoadingPayments ? (
              <>
                <div style={classes.skeletonheaderTable}>
                  <Skeleton variant="text" height={34} width={140}/>
                  <Skeleton variant="text" height={34} width={140}/>
                </div>
                <Skeleton variant="rectangular" height={280} width={"100%"}/>
              </>
          ) : isEmpty ? (
            <NoDataComponent subNoDataText={noDocumentData()} />
          ) : (
            <OrderTableWidget
              PrimaryTableCell={PrimaryTableCell}
              columnWidths={columnWidths}
              tableHeaders={tableHeaders}
              documentItems={documentItems}
              handleItemSelect={handleItemSelect}
              handleSelectAll={handleSelectAll}
              areAllItemsSelected={areAllItemsSelected}
              selectedItems={selectedItems}
              filterItems={filterItems}
              handleSelectAllDocuments={handleSelectAllDocuments}
            />
          )}
        </div>

        <div style={classes.footerModalContainer}>
          {isLoadingPayments ? (
            <>
              <Skeleton variant="text" width={200} height={30} />
              <Skeleton
                variant="rectangular"
                width={150}
                height={40}
                style={{ marginTop: "10px" }}
              />
            </>
          ) : documentItems?.length > 0 ? (
            <>
              <div style={classes.totalStyle}>
                {`${t("sales.quote.total")} : ${totalPrice.toFixed(2)} ${t(
                  "sales.quote.notIncludingVAT"
                )} `}
              </div>
              <GomakePrimaryButton
                onClick={addOrdersToDeliveryNote}
                style={classes.btnContainer}
              >
                {`${t("sales.quote.addTo")} ${buttonLabel().toLowerCase()}`}
              </GomakePrimaryButton>
            </>
          ) : null}
        </div>
      </div>
    </GoMakeModal>
  );
};

export { CopyFromOrderModal };
