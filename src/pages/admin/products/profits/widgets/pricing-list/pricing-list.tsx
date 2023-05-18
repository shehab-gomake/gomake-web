import { useEffect, useState } from "react";

import { useStyle } from "./style";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate } from "@/components";
import { Header } from "./header";
import { Row } from "./row";
import { useRecoilValue } from "recoil";
import { actionProfitLists } from "@/store";
import { Plus } from "./icons/plus";
import { profitsState } from "../../store/profits";
import { AddPricingListRowWidget } from "./add-pricing-row-widget";

interface IProps {
  tableHeaders: any[];
}

const PricingList = ({ tableHeaders }: IProps) => {
  const actionProfits = useRecoilValue<any>(actionProfitLists);
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const { clasess } = useStyle();
  const [istimeOut, setIsTimeOut] = useState(false);
  const profitsValue = useRecoilValue<any>(profitsState);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeOut(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div style={clasess.headerMainCointaner}>
        <div style={clasess.listTitle}>
          {t("products.profits.pricingListWidget.pricingListTitle")}
        </div>
        <div style={clasess.filtersCointaner}>
          <div style={clasess.filterContainer}>
            <GoMakeAutoComplate
              options={["Quantity", "Size"]}
              style={clasess.autoComplateStyle}
              placeholder={t(
                "products.profits.pricingListWidget.meterPerPrice"
              )}
              value={actionProfits?.pricingBy === 0 ? "Quantity" : "Size"}
              disabled={true}
            />
          </div>
          <div style={clasess.filterContainer}>
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
          </div>
        </div>
      </div>
      <div style={clasess.container}>
        <div style={clasess.header}>
          {tableHeaders.map((header: any, index: number) => {
            return (
              <Header
                key={`header_item${index}`}
                header={header}
                width={`${100 / tableHeaders.length}%`}
              />
            );
          })}
        </div>
        <div style={clasess.tableBody}>
          {actionProfits?.actionProfitRowsMapped?.length > 0 ? (
            <>
              {actionProfits?.actionProfitRowsMapped?.map(
                (row: any, index: number) => {
                  return (
                    <div key={`body_row${index}`} style={{ width: "100%" }}>
                      <Row
                        row={row}
                        width={`${100 / (Object.entries(row).length - 1)}%`}
                      />
                      <div style={clasess.line}></div>
                    </div>
                  );
                }
              )}
            </>
          ) : (
            <>
              {!istimeOut ? (
                <>
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={68}
                    style={clasess.skeletonRowStyle}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={68}
                    style={clasess.skeletonRowStyle}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={68}
                    style={clasess.skeletonRowStyle}
                  />
                </>
              ) : (
                <div style={clasess.noDataContainer}>
                  {" "}
                  {t("skeleton.noData")}
                </div>
              )}
            </>
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
          style={clasess.addNewStep}
          onClick={() => {
            profitsValue?.setOpenAddNewPricingStepRow(true);
          }}
        >
          <Plus />
          {t("products.profits.pricingListWidget.addNewStep")}
        </div>
      </div>
    </>
  );
};
export { PricingList };
