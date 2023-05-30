import { useEffect, useState } from "react";

import { useStyle } from "./style";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate } from "@/components";
import { Header } from "./header";
import { Row } from "./row";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  actionProfitLists,
  actionProfitRows,
  actionProfitRowsState,
} from "@/store";
import { Plus } from "./icons/plus";
import { profitsState } from "../../store/profits";
import { AddPricingListRowWidget } from "./add-pricing-row-widget";
import { productTestState } from "@/store/product-test";
import { AddQuantityModal } from "./add-quantity-modal";

interface IProps {
  tableHeaders: any[];
  tablePercent?: any[];
}

const PricingList = ({ tableHeaders, tablePercent }: IProps) => {
  const { t } = useTranslation();
  const actionProfits = useRecoilValue<any>(actionProfitLists);
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const profitsValue = useRecoilValue<any>(profitsState);
  const actionProfitRowsVal = useRecoilValue<any>(actionProfitRows);

  const actionProfitRowsNew = useRecoilValue<any>(actionProfitRowsState);

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
        <div style={clasess.filtersCointaner}>
          {/* <div style={clasess.filterContainer}>
            <GoMakeAutoComplate
              options={["Quantity", "Size"]}
              style={clasess.autoComplateStyle}
              placeholder={t(
                "products.profits.pricingListWidget.meterPerPrice"
              )}
              value={actionProfits?.pricingBy === 0 ? "Quantity" : "Size"}
              disabled={true}
            />
          </div> */}
          {/* <div style={clasess.filterContainer}>
            <GoMakeAutoComplate
              options={[
                { label: "Linear", value: 0 },
                { label: "Steps", value: 1 },
              ]}
              style={clasess.autoComplateStyle}
              placeholder={t("products.profits.pricingListWidget.transition")}
              value={actionProfits?.transitionType === 0 ? "Linear" : "Steps"}
              onChange={(e, item) => {
                profitsStateValue?.updateActionProfit(item?.value);
              }}
            />
          </div> */}
        </div>
      </div>
      <div style={clasess.container}>
        <div style={clasess.header}>
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
        <div style={clasess.tableBody}>
          {typeof actionProfitRowsNew === "string" ? (
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
          ) : actionProfitRowsNew?.length > 0 ? (
            <div style={clasess.row}>
              {actionProfitRowsNew?.map((row: any, index: number) => {
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
              })}
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
        <div
          style={clasess.addNewQuantity}
          // onClick={() => {
          //   profitsValue?.setOpenAddNewPricingStepRow(true);
          // }}
          onClick={profitsStateValue?.onOpenAddQuantityModal}
        >
          <Plus />
          {t("products.profits.pricingListWidget.addNewQuantity")}
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
