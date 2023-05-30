import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
interface IProps {
  headerTitle?: string;
  tableHeaders?: any;
}
const CustomTableWidget = ({ headerTitle, tableHeaders }: IProps) => {
  const { clasess } = useStyle();
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
        {tableHeaders?.map((item: string) => {
          return <div style={clasess.headerNameStyle}>{item}</div>;
        })}
      </div>
    </div>
  );
};

export { CustomTableWidget };
