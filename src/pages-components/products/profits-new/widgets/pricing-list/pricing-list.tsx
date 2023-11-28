import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  tableCellClasses,
} from "@mui/material";
import { RowMappingWidget } from "./row-mapping";
import { LineChart } from "@/pages-components/products/profits/widgets/line-chart";
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
const PricingList = ({
  tableHeaders,
  tableBodyList,
  PricingBy,
  Transition,
  actionProfitRowChartData,
  setSelectedPricingBy,
  setSelectedTransition,
  selectedTransition,
  selectedPricingBy,
  updatePricingByForAction,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <div style={clasess.headerMainCointaner}>
        <div style={clasess.listTitle}>
          {t("products.profits.pricingListWidget.pricingListTitle")}
        </div>
        <div style={clasess.filtersCointaner}>
          <div style={clasess.autoCompleteContainer}>
            <GoMakeAutoComplate
              options={PricingBy}
              style={clasess.autoCompleteStyleContainer}
              placeholder="Pricing by"
              onChange={(e, value) => updatePricingByForAction(value)}
              value={selectedPricingBy}
            />
          </div>
          <div style={clasess.autoCompleteContainer}>
            <GoMakeAutoComplate
              options={Transition}
              style={clasess.autoCompleteStyleContainer}
              placeholder={"Transition"}
              onChange={(e, value) => setSelectedTransition(value)}
              value={selectedTransition}
            />
          </div>
        </div>
      </div>
      <TableContainer
        style={{
          maxHeight: 400,
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
              return <RowMappingWidget item={item} index={index} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={clasess.addNewQuantity}>
        <Plus />
        {t("products.profits.pricingListWidget.addNewQuantity")}
      </div>
      <div
        style={{
          maxHeight: 300,
          minWidth: "100%",
          width: "100%",
          // paddingLeft: 20,
          // paddingRight: 20,
        }}
      >
        <LineChart actionProfitRowChartData={actionProfitRowChartData} />
      </div>
    </>
  );
};
export { PricingList };
