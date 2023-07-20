import { useGomakeRouter } from "@/hooks";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const Row = ({ row, width, tablePercent, index }: any) => {
  const { clasess } = useStyle({ width, index, tablePercent });
  const { t } = useTranslation();
  const { navigate } = useGomakeRouter();
  return (
    <div style={clasess.bodyRow}>
      {Object.entries(row).map((entry: [string, any]) => {
        if (entry[0] !== "id" && entry[0] !== "recordID") {
          return (
            <div
              key={`row_table_${index}`}
              style={clasess.rowItem}
              className="scrollBlue"
              onClick={() => navigate(`/settings/edit-product/${row?.id}`)}
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
