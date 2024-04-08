import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useCopyFromOrderModal } from "./use-copy-from-order-modal";
import { OrderTableWidget } from "./order-table";
import { useStyle } from "./style";

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
    addOrdersToDeliveryNote
  } = useCopyFromOrderModal({ onClose, documentType, openModal, cliendDocumentType })

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={`${modalLabel()} ${quoteItemValue?.client?.name}`}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.headerContainer}>
            <div style={classes.filtersContainer}>
              <div style={classes.searchContainer}>
                <div style={classes.searchLabelStyle}>{t("sales.quote.searchBy")}</div>
                <SearchInputComponent onChange={setTerm} />
              </div>
            </div>
          </div>
          <div style={classes.bodyContainer}>
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
          </div>
          <div style={classes.footerModalContainer}>
            <div style={classes.totalStyle}>{`${t("sales.quote.total")} : ${totalPrice.toFixed(2)} ${t("sales.quote.notIncludingVAT")} `}</div>
            <GomakePrimaryButton onClick={addOrdersToDeliveryNote} style={classes.btnContainer}>{`${t("sales.quote.addTo")} ${buttonLabel().toLowerCase()}`}</GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { CopyFromOrderModal };