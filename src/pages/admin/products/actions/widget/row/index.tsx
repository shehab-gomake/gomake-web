import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const Row = ({ row, width, tablePercent, index }: any) => {
  console.log("index: " + index);
  const { clasess } = useStyle({ width, index, tablePercent });
  const { t } = useTranslation();
  return (
    <div style={clasess.bodyRow}>
      {Object.entries(row).map((entry: [string, any]) => {
        if (entry[0] !== "id" && entry[0] !== "recordID") {
          return (
            <div key={`row_table_${index}`} style={clasess.rowItem}>
              {entry[1]}
            </div>
          );
        }
      })}
    </div>
  );
};

export { Row };
