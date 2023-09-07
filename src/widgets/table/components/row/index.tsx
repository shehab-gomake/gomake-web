import { useRecoilValue } from "recoil";

import { ShowSupplierList } from "@/store";

import { useStyle } from "./style";

const Row = ({ index, row, width }: any) => {
  const { clasess } = useStyle({ width });

  const showUnderRowWidget = useRecoilValue(ShowSupplierList);
  return (
    <>
      <div style={index % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
        {Object.entries(row).map((entry: [string, any], index: number) => {
          return (
            <div key={`row_table_${index}`} style={ index == 0 ? clasess.sticky : clasess.rowItem }>
              {entry[1]}
            </div>
          );
        })}
      </div>
      {showUnderRowWidget?.stateShow &&
      showUnderRowWidget.item[showUnderRowWidget.key] ===
        row[showUnderRowWidget.key]
        ? showUnderRowWidget?.widget
        : null}
    </>
  );
};

export { Row };
