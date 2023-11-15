import { GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages-components/quote/store/quote";
import { useState } from "react";

const RowInside = ({
  index,
  tablePercent,
  clasess,
  entry,
  row,
  isCheckbox = true,
  changeItems,
  indexTable,
}: any) => {
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const [initialValue, setInitialValue] = useState(entry[1]);
  return (
    <div
      key={`row_table_${index}`}
      style={{ ...clasess.rowItem, width: `${tablePercent[index]}` }}
    >
      {entry[0] === "id" && isCheckbox ? (
        <div key={`row_table_${index}`} style={clasess.rowItem}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
          />
          {entry[1]}
        </div>
      ) : entry[0] === "details" ? (
        <>
          <div key={`row_table_${index}`} style={clasess.rowItem}>
            {entry[1]}
          </div>
          <div style={clasess.detailsLine} />
        </>
      ) : entry[0] === "amount" ||
        entry[0] === "unitPrice" ||
        entry[0] === "discount" ||
        entry[0] === "finalPrice" ? (
        <div key={`row_table_${index}`} style={clasess.rowItem}>
          <GomakeTextInput
            style={clasess.textInputWithoutStyle}
            value={Number(entry[1]).toFixed(2)}
            onChange={(e: any) => {
              const newValue = e.target.value;
              changeItems(indexTable, entry[0], newValue);
              if (newValue !== initialValue) {
                quoteStateValue?.getCalculateQuoteItem(
                  row?.quoteItemId,
                  index - 3,
                  newValue
                );
              }
            }}
          />
        </div>
      ) : (
        <div key={`row_table_${index}`} style={clasess.rowItem}>
          {entry[1]}
        </div>
      )}
    </div>
  );
};

export { RowInside };
