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

const Exceptions = ({ tableHeaders, tableRows }: IProps) => {
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const { istimeOut, _tableRows, t } = useExceptions({
    tableRows,
  });
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
          <div
            style={clasess.addNewException}
            onClick={profitsStateValue.onOpenAddExceptionModal}
          >
            <Plus />
            {t("products.profits.exceptions.addNewException")}
          </div>
        </div>
      </div>
      <AddExceptionModal />
    </>
  );
};
export { Exceptions };
