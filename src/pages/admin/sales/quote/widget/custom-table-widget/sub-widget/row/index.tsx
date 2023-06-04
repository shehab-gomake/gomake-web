import { RowInside } from "./row-inside";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const RowCustomTable = ({ row, tablePercent, isCheckbox }: any) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.bodyRow}>
      {Object.entries(row).map((entry: [string, any], index) => {
        if (entry[0] !== "recordID") {
          return (
            <RowInside
              index={index}
              tablePercent={tablePercent}
              clasess={clasess}
              entry={entry}
              isCheckbox={isCheckbox}
            />
          );
        }
      })}
    </div>
  );
};

export { RowCustomTable };
