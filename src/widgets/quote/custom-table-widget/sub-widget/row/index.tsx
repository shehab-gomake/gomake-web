import { RowInside } from "./row-inside";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const RowCustomTable = ({
  row,
  tablePercent,
  isCheckbox,
  changeItems,
  indexTable,
}: any) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.bodyRow}>
      {Object.entries(row).map((entry: [string, any], index) => {
        if (entry[0] !== "quoteItemId" && entry[0] !== "recordID" && entry[0] !== "childsQuoteItems") {
          return (
            <>
            <RowInside
              index={index}
              tablePercent={tablePercent}
              clasess={clasess}
              entry={entry}
              isCheckbox={isCheckbox}
              row={row}
              changeItems={changeItems}
              indexTable={indexTable}
            />
            
            </>
          );
        }
      })}
    </div>
  );
};

export { RowCustomTable };
