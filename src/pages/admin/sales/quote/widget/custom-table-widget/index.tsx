import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderTable } from "./sub-widget/header";
import { RowCustomTable } from "./sub-widget/row";
interface IProps {
  headerTitle?: string;
  tableHeaders?: any;
  headerWidth?: any;
  tableRowPercent?: any;
  data?: any;
  index?: number;
}
const CustomTableWidget = ({
  headerTitle,
  tableHeaders,
  headerWidth,
  tableRowPercent,
  data,
  index,
}: IProps) => {
  const { clasess } = useStyle({ headerWidth, index });
  const { t } = useTranslation();
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.tableHeaderContainer}>
        <div style={clasess.headerStyle}>{headerTitle}</div>
        <div style={clasess.filtersContainer}>
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.sortBy")}
          />
          <GoMakeAutoComplate
            options={["A", "B", "C", "D", "E", "F"]}
            style={clasess.autoComplateStyle}
            placeholder={t("sales.quote.discountBy")}
          />
        </div>
      </div>
      <div style={clasess.tableHeadersStyle}>
        {tableHeaders?.map((item: string, index: number) => {
          return (
            <HeaderTable
              header={item}
              headerWidth={headerWidth}
              index={index}
            />
          );
        })}
      </div>
      <div style={clasess.row}>
        {data?.map((row: any, index: number) => {
          return (
            <div key={`body_row${index}`} style={{ width: "100%" }}>
              <RowCustomTable row={row} tablePercent={tableRowPercent} />
              <div style={clasess.line}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { CustomTableWidget };
