import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeModal, GomakePrimaryButton, SecondSwitch } from "@/components";
import { useCopyFromOrderModal } from "./use-copy-from-order-modal";
import { OrderTableWidget } from "./order-table";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";

const CopyFromOrderModal = ({ openModal, onClose, documentType, cliendDocumentType }) => {
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
    setDocumentItems
  } = useCopyFromOrderModal({ onClose, documentType, openModal, cliendDocumentType })
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={`${modalLabel()} ${quoteItemValue?.client?.name}`}
        onClose={() => {
          setDocumentItems([])
          onClose()
        }}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.headerContainer}>
            {documentItems?.length > 0 ? (
              <div style={classes.filtersContainer}>
                <div style={classes.searchContainer}>
                  <div style={classes.searchLabelStyle}>{t("sales.quote.searchBy")}</div>
                  <SearchInputComponent onChange={setTerm} />
                </div>
                <div style={classes.switchContainer}>
                  <SecondSwitch
                    checked={showReadyOnly}
                    onChange={(e) => setShowReadyOnly(e.target.checked)}
                  />
                  <span style={classes.switchLabel}>{t("sales.cart.showReadyItems")}</span>
                </div>
              </div>
            ) : (
              <div style={classes.filtersContainer}>
                <div style={classes.searchContainer}>
                  <Skeleton variant="text" width={100} height={30} />
                  <Skeleton variant="rectangular" width={200} height={40} style={{ marginTop: '10px' }} />
                </div>
                <div style={classes.switchContainer}>
                  <Skeleton variant="text" width={150} height={30} style={{ marginLeft: '10px' }} />
                </div>
              </div>
            )}
          </div>

          <div style={classes.bodyContainer}>
            {documentItems?.length > 0 ? (
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
              />
            ) : (
              <>
                <div style={classes.skeletonheaderTable}>
                  <Skeleton variant="text" height={34} width={140} />
                  <Skeleton variant="text" height={34} width={140} />
                </div>
                <Skeleton variant="rectangular" height={280} width={"100%"} />
                {/* You can add more skeletons for rows or specific sections if needed */}
              </>
            )}
          </div>
          <div style={classes.footerModalContainer}>
            {documentItems?.length > 0 ? (
              <>
                <div style={classes.totalStyle}>
                  {`${t("sales.quote.total")} : ${totalPrice.toFixed(2)} ${t("sales.quote.notIncludingVAT")} `}
                </div>
                <GomakePrimaryButton onClick={addOrdersToDeliveryNote} style={classes.btnContainer}>
                  {`${t("sales.quote.addTo")} ${buttonLabel().toLowerCase()}`}
                </GomakePrimaryButton>
              </>
            ) : (
              <>
                {/* Skeleton for total price */}
                <Skeleton variant="text" width={200} height={30} />
                {/* Skeleton for the button */}
                <Skeleton variant="rectangular" width={150} height={40} style={{ marginTop: '10px' }} />
              </>
            )}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { CopyFromOrderModal };