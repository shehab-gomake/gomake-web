import { IProps } from "./interfaces";
import { useStyle } from "./style";
import { IconButton, Skeleton } from "@mui/material";
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
import { EditIcon } from "@/icons";
import { UpdateExceptionModal } from "../update-exception-modal";

const Exceptions = ({ tableHeaders, tableRows }: IProps) => {
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const actionProfits = useRecoilValue<any>(actionProfitLists);

  const actionExceptionProfitIdValue = useRecoilValue<any>(
    actionExceptionProfitId
  );
  const { t } = useTranslation();

  console.log("tableRows", tableRows);

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
                          width: "100%",
                          justifyContent: "space-between",
                          paddingLeft: 22,
                          paddingRight: 22,
                        }}
                      >
                        <div style={{ ...clasess.rowHeader, width: "20%" }}>
                          {t("products.profits.exceptions.type")}
                        </div>
                        <div style={{ ...clasess.rowHeader, width: "20%" }}>
                          {t("products.profits.exceptions.parameter")}
                        </div>
                        <div style={{ ...clasess.rowHeader, width: "20%" }}>
                          {t("products.profits.exceptions.value")}
                        </div>
                        <div style={{ ...clasess.rowHeader, width: "40%" }}>
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
                              display: "flex",
                            }
                          : {
                              width: "100%",
                              display: "flex",
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
      <UpdateExceptionModal />
      <AddExceptionModal />
    </>
  );
};
export { Exceptions };
