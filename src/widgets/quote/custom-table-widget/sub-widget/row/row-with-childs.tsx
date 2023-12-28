import { RowInside } from "./row-inside";
import { RowInsideWithChilds } from "./row-inside-with-childs";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const RowWithChildsTable = ({
  row,
  tablePercent,
  isCheckbox,
  changeItems,
  indexTable,
  changeItemsChilds,
}: any) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.bodyRow}>
      {Object.entries(row).map((entry: [string, any], index) => {
        if (
          entry[0] !== "quoteItemId" &&
          entry[0] !== "recordID" &&
          entry[0] !== "childsDocumentItems"
        ) {
          return (
            <>
              <RowInsideWithChilds
                index={index}
                tablePercent={tablePercent}
                clasess={clasess}
                entry={entry}
                isCheckbox={isCheckbox}
                row={row}
                changeItems={changeItems}
                changeItemsChilds={changeItemsChilds}
                indexTable={indexTable}
              />
            </>
          );
        }
      })}
    </div>
  );
};

export { RowWithChildsTable };
