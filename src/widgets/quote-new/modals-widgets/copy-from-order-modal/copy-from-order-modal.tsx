import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useCopyFromOrderModal } from "./use-copy-from-order-modal";
import { OrderTableWidget } from "./order-table";
import { useStyle } from "./style";

const CopyFromOrderModal = ({ openModal, onClose }) => {
  const { classes } = useStyle();

  const {
    setTerm,
    PrimaryTableCell,
    columnWidths,
    tableHeaders,
    documentItems,
    handleItemSelect,
    handleSelectAll,
    areAllItemsSelected,
    selectedItems,
    totalPrice,
    filterItems
  } = useCopyFromOrderModal()


  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle="Delivery certification test client"
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.headerContainer}>
            <div style={classes.filtersContainer}>
              <div style={classes.searchContainer}>
                <div style={classes.searchLabelStyle}> Search By </div>
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
            <div style={classes.totalStyle}>Total: NIS {totalPrice.toFixed(2)} not including VAT</div>
            <GomakePrimaryButton style={classes.btnContainer}>Add to delivery note</GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { CopyFromOrderModal };