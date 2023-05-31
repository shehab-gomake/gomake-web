import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderTable } from "./sub-widget/header";
import { RowCustomTable } from "./sub-widget/row";
import { AddIcon, AddPlusIcon, PlusIcon } from "@/icons";
interface IProps {
  headerTitle?: string;
  tableHeaders?: any;
  headerWidth?: any;
  tableRowPercent?: any;
  data?: any;
  isCheckbox?: boolean;
}
const CustomTableWidget = ({
  headerTitle,
  tableHeaders,
  headerWidth,
  tableRowPercent,
  data,
  isCheckbox,
}: IProps) => {
  const { clasess } = useStyle({ headerWidth });
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
          console.log("index", index);
          console.log("data", data?.length);
          return (
            <div key={`body_row${index}`} style={{ width: "100%" }}>
              <RowCustomTable
                row={row}
                tablePercent={tableRowPercent}
                isCheckbox={isCheckbox}
              />
              {index != data?.length - 1 ? <div style={clasess.line} /> : null}
            </div>
          );
        })}
      </div>
      <div style={clasess.btnsContainer}>
        <div style={clasess.btnContainer}>
          <AddPlusIcon />
          <div style={clasess.btnTitle}>add new item</div>
        </div>
        <div style={clasess.btnContainer}>
          <AddPlusIcon />
          <div style={clasess.btnTitle}>add exist item</div>
        </div>
        <div style={clasess.btnContainer}>
          <AddPlusIcon />
          <div style={clasess.btnTitle}>add delivery</div>
        </div>
      </div>
    </div>
  );
};

export { CustomTableWidget };
