import { GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages-components/quote/store/quote";

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
            value={entry[1]}
            onChange={(e: any) => {
              changeItems(indexTable, entry[0], e.target.value);
            }}
            onBlur={() =>
              quoteStateValue?.getCalculateQuoteItem(
                row?.quoteItemId,
                index - 3,
                entry[1]
              )
            }
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
