import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const Row = ({ row, width, tablePercent, index }: any) => {
  const { clasess } = useStyle({ width, index, tablePercent });
  const { t } = useTranslation();
  return (
    <div style={clasess.bodyRow}>
      {Object.entries(row).map((entry: any) => {
        if (entry[0] !== "id") {
          return (
            <div
              key={`row_table_${index}`}
              style={clasess.rowItem}
              className="scrollBlue"
            >
              {entry[1]}
            </div>
          );
        }
      })}
    </div>
  );
};

export { Row };
