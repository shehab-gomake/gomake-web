import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { RowMappingWidget } from "./row-mapping";
import { Plus } from "@/pages-components/products/profits/widgets/pricing-list/icons/plus";
import { PricingListTableProps } from "../../interface";
import { MoreMenuWidget } from "./more-menu";
import { GoMakeDeleteModal } from "@/components";
import { useState } from "react";
import { EPricingBy } from "../../enums/profites-enum";

const PrimaryTableCell = styled(TableCell)(() => {
  return {
    [`&.${tableCellClasses.head}`]: {
      padding: 0,
    },
    [`&.${tableCellClasses.body}`]: {
      padding: 0,
    },
  };
});

const PricingListTable = ({
  tableHeaders,
  tableBodyList,
  changeactionProfitRowsItems,
  onOpenAddStepModal,
  updateActionProfitRow,
  selectedPricingBy,
  anchorElMorePriceTable,
  openMorePriceTable,
  handleClickMorePriceTable,
  handleCloseMorePriceTable,
  selectedActionProfitRow,
  setSelectedActionProfit,
  deleteActionProfitRow,
  selectedAdditionalProfitRow,
  addNewStepForActionProfitRow,
}: PricingListTableProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [openDeleteRowModal, setOpenDeleteRowModal] = useState<boolean>(false);
  const onClickOpenDeleteRowModal = () => {
    setOpenDeleteRowModal(true);
  };
  const onClickCloseDeleteRowModal = () => {
    setOpenDeleteRowModal(false);
  };

  return (
    <>
      <TableContainer
        style={{
          maxHeight: 250,
          overflow: "scroll",
        }}
      >
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow style={classes.tableRowStyle}>
              {tableHeaders.map((header, index) => (
                <PrimaryTableCell
                  key={index}
                  style={
                    header === "Total price"
                      ? classes.tableHeaderStyle2
                      : classes.tableHeaderStyle
                  }
                >
                  {header}
                </PrimaryTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableBodyList &&
              tableBodyList?.map((item: any, index: number) => {
                return (
                  <RowMappingWidget
                    key={`${item?.id}-${item?.actionProfitId}-${index}`}
                    item={item}
                    index={index}
                    changeactionProfitRowsItems={changeactionProfitRowsItems}
                    updateActionProfitRow={updateActionProfitRow}
                    selectedPricingBy={selectedPricingBy}
                    handleClickMorePriceTable={handleClickMorePriceTable}
                    setSelectedActionProfit={setSelectedActionProfit}
                    selectedAdditionalProfitRow={selectedAdditionalProfitRow}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={classes.addNewQuantity}
        onClick={() => {
          if (selectedPricingBy?.value === EPricingBy.PACKAGE) {
            addNewStepForActionProfitRow(0, 0);
          } else {
            onOpenAddStepModal();
          }
        }}
      >
        <Plus />
        {t("products.profits.pricingListWidget.addNewStep")}
      </div>
      <MoreMenuWidget
        handleClose={handleCloseMorePriceTable}
        open={openMorePriceTable}
        anchorEl={anchorElMorePriceTable}
        selectedActionProfitRow={selectedActionProfitRow}
        onClickOpenDeleteRowModal={onClickOpenDeleteRowModal}
      />
      <GoMakeDeleteModal
        openModal={openDeleteRowModal}
        onClose={onClickCloseDeleteRowModal}
        onClickDelete={() => deleteActionProfitRow(selectedActionProfitRow?.id)}
      />
    </>
  );
};
export { PricingListTable };
