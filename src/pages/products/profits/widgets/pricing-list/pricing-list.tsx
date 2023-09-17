import { useEffect, useState } from "react";

import { useStyle } from "./style";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Header } from "./header";
import { Row } from "./row";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { actionExceptionProfitId, actionProfitLists } from "@/store";
import { Plus } from "./icons/plus";
import { profitsState } from "../../store/profits";
import { AddPricingListRowWidget } from "./add-pricing-row-widget";
import { productTestState } from "@/store/product-test";
import { AddQuantityModal } from "./add-quantity-modal";
import { actionProfitPricingTableRowsState } from "@/store/action-profit-pricing-table-rows";
import { LineChart } from "../line-chart";

interface IProps {
  tableHeaders: any[];
  tablePercent?: any[];
}

const PricingList = ({ tableHeaders, tablePercent }: IProps) => {
  const { t } = useTranslation();
  const actionProfits = useRecoilValue<any>(actionProfitLists);
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const profitsValue = useRecoilValue<any>(profitsState);
  const [actionExceptionProfitIdValue, setactionExceptionProfitId] =
    useRecoilState<any>(actionExceptionProfitId);

  const actionProfitPricingTableRows = useRecoilValue<any>(
    actionProfitPricingTableRowsState
  );

  const [istimeOut, setIsTimeOut] = useState(false);
  const { clasess } = useStyle();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeOut(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const productTest = useRecoilValue<any>(productTestState);
  return (
    <>
      <div style={clasess.headerMainCointaner}>
        <div style={clasess.listTitle}>
          {t("products.profits.pricingListWidget.pricingListTitle")}
        </div>
        <div style={clasess.filtersCointaner}></div>
      </div>
      <div style={clasess.container}>
        <div style={clasess.tableBody}>
          {typeof actionProfitPricingTableRows === "string" ? (
            <>
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={50}
                style={clasess.skeletonRowStyle}
              />
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={50}
                style={clasess.skeletonRowStyle}
              />
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={50}
                style={clasess.skeletonRowStyle}
              />
            </>
          ) : actionProfitPricingTableRows?.length > 0 ? (
            <div style={{ ...clasess.row, position: "relative" }}>
              {actionExceptionProfitIdValue?.type == "Additional" &&
                actionExceptionProfitIdValue?.id && (
                  <div
                    style={{
                      width: 100,
                      height: "90%",
                      position: "absolute",
                      top: 0,
                      left: "29.2%",
                      border: "1px solid #F135A3",
                      borderRadius: 4,
                    }}
                  ></div>
                )}

              {["header", ...actionProfitPricingTableRows]?.map(
                (row: any, index: number) => {
                  if (row === "header") {
                    return (
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        {tableHeaders.map((header: any, index: number) => {
                          return (
                            <Header
                              key={`header_item${index}`}
                              header={header}
                              width={
                                tablePercent
                                  ? `${tablePercent[index]}`
                                  : `${100 / (tableHeaders.length - 1)}%`
                              }
                              // width={`${100 / tableHeaders.length}%`}
                            />
                          );
                        })}
                      </div>
                    );
                  }
                  return (
                    <div key={`body_row${index}`} style={{ width: "100%" }}>
                      <Row
                        row={row}
                        tablePercent={tablePercent}
                        // width={`${100 / (Object.entries(row).length - 1)}%`}
                      />
                      <div style={clasess.line}></div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div style={clasess.noDataContainer}> {t("skeleton.noData")}</div>
          )}
        </div>
        {profitsValue?.openAddNewPricingStepRow && (
          <>
            <AddPricingListRowWidget
              pricingBy={actionProfits?.pricingBy}
              profitsStateValue={profitsStateValue}
            />
          </>
        )}
        {!!productTest?.isBaseCase && (
          <div
            style={clasess.addNewQuantity}
            onClick={profitsStateValue?.onOpenAddQuantityModal}
          >
            <Plus />
            {t("products.profits.pricingListWidget.addNewQuantity")}
          </div>
        )}
        <div
          style={{
            maxHeight: 300,
            minWidth: "100%",
            width: "100%",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <LineChart />
        </div>
      </div>
      <AddQuantityModal
        openModal={profitsStateValue?.openAddQuantityModal}
        onCloseModal={profitsStateValue?.onCloseAddQuantityModal}
        profitsStateValue={profitsStateValue}
      />
    </>
  );
};
export { PricingList };
