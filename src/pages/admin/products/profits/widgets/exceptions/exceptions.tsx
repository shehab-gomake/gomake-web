import { useEffect, useState } from "react";

import { IProps } from "./interfaces";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate } from "@/components";
import { Header } from "./header";
import { Row } from "./row";

const Exceptions = ({ tableHeaders, tableRows }: IProps) => {
  const [_tableRows, setTableRows] = useState(tableRows);
  const { clasess } = useStyle();
  const [istimeOut, setIsTimeOut] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeOut(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    setTableRows(tableRows);
  }, [tableRows]);
  return (
    <>
      <div style={clasess.container}>
        <div style={clasess.listTitle}>
          {t("products.profits.exceptions.title")}
        </div>
        <div style={clasess.withoutTitle}>
          <div style={clasess.header}>
            {tableHeaders.map((header: string, index: number) => {
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
            {_tableRows?.length > 0 ? (
              <>
                {_tableRows?.map((row: any, index: number) => {
                  return (
                    <>
                      <Row
                        key={`body_row${index}`}
                        row={row}
                        width={`${100 / Object.entries(row).length}%`}
                      />
                    </>
                  );
                })}
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

          <div style={clasess.minCointaner}>
            {t("products.profits.exceptions.min")}
            {20}$
          </div>
          <div style={clasess.addNewException}>
            {t("products.profits.exceptions.addNewException")}
          </div>
        </div>
      </div>
    </>
  );
};
export { Exceptions };
