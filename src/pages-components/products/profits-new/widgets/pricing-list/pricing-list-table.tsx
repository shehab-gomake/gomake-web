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
}) => {
  console.log("tableBodyList", tableBodyList);
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <TableContainer
        style={{
          // maxHeight: 123,
          maxHeight: 250,

          overflow: "scroll",
        }}
      >
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow style={clasess.tableRowStyle}>
              {tableHeaders.map((header, index) => (
                <PrimaryTableCell
                  key={index}
                  style={
                    header === "Total price"
                      ? clasess.tableHeaderStyle2
                      : clasess.tableHeaderStyle
                  }
                >
                  {header}
                </PrimaryTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{ border: "1px solid #EAECF0" }}>
            {tableBodyList?.map((item: any, index: number) => {
              return (
                <RowMappingWidget
                  key={item?.id}
                  item={item}
                  index={index}
                  changeactionProfitRowsItems={changeactionProfitRowsItems}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={clasess.addNewQuantity}>
        <Plus />
        {t("products.profits.pricingListWidget.addNewQuantity")}
      </div>
    </>
  );
};
export { PricingListTable };
