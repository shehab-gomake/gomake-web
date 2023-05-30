import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderTable } from "./sub-widget/header";
interface IProps {
  headerTitle?: string;
  tableHeaders?: any;
  headerWidth?: any;
  index?: number;
}
const CustomTableWidget = ({
  headerTitle,
  tableHeaders,
  headerWidth,
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
    </div>
  );
};

export { CustomTableWidget };
