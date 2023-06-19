import { IProps } from "./interfaces";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";
import { Header } from "./header";
import { Row } from "./row";
import { Plus } from "./icons/plus";
import { AddExceptionModal } from "../add-exception-modal";
import { useRecoilValue } from "recoil";
import { profitsState } from "../../store/profits";
import { useExceptions } from "./use-exception";
import { actionExceptionProfitId, actionProfitLists } from "@/store";
import { UpdateMinPrice } from "./update-min-price";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Exceptions = ({ tableHeaders, tableRows }: IProps) => {
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const actionProfits = useRecoilValue<any>(actionProfitLists);

  const actionExceptionProfitIdValue = useRecoilValue<any>(
    actionExceptionProfitId
  );
  const { t } = useTranslation();

  return (
    <>
      <div style={clasess.container}>
        <div style={clasess.listTitle}>
          {t("products.profits.exceptions.title")}
        </div>
        <div style={clasess.withoutTitle}>
          <div style={clasess.tableBody}>
            {tableRows?.length > 0 ? (
              <>
                {["header", ...tableRows]?.map((row: any, index: number) => {
                  if (row === "header") {
                    return (
                      <div
                        key={`header_exp_${index}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingLeft: 22,
                          paddingRight: 22,
                        }}
                      >
                        <div style={{ width: "25%" }}>
                          {t("products.profits.exceptions.type")}
                        </div>
                        <div style={{ width: "25%" }}>
                          {" "}
                          {t("products.profits.exceptions.parameter")}
                        </div>
                        <div style={{ width: "25%" }}>
                          {t("products.profits.exceptions.value")}
                        </div>
                        <div style={{ width: "25%" }}>
                          {t("products.profits.exceptions.scopeOfChange")}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`body_row${index}`}
                      style={
                        row?.id === actionExceptionProfitIdValue?.id
                          ? {
                              backgroundColor: "#EBECFF",
                              width: "100%",
                              marginTop: 5,
                              paddingLeft: 22,
                              paddingRight: 22,
                            }
                          : {
                              width: "100%",
                              marginTop: 5,
                              paddingLeft: 22,
                              paddingRight: 22,
                            }
                      }
                    >
                      <Row key={`body_row${index}`} row={row} />
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <div style={clasess.noDataContainer}>
                  {t("skeleton.noData")}
                </div>
              </>
            )}
          </div>

          <div>
            <div style={clasess.minCointaner}>
              {t("products.profits.exceptions.min")}
              <UpdateMinPrice
                minValue={actionProfits?.minPrice}
                profitsStateValue={profitsStateValue}
              />
            </div>
            <div
              style={clasess.addNewException}
              onClick={profitsStateValue.onOpenAddExceptionModal}
            >
              <Plus />
              {t("products.profits.exceptions.addNewException")}
            </div>
          </div>
        </div>
      </div>
      <AddExceptionModal />
    </>
  );
};
export { Exceptions };
