import { GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages-components/quote/store/quote";

const RowInsideWithChilds = ({
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            key={`row_table_${index}`}
            style={{ ...clasess.rowItem, marginTop: 22 }}
          >
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
            />
            {entry[1]}
          </div>
          <div>
            {row?.childsQuoteItems?.map((item, index2) => {
              return (
                <div
                  key={`row_table_${index}`}
                  style={{ ...clasess.rowItem, height: 54 }}
                >
                  <Checkbox
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                  />
                  {item?.id}
                </div>
              );
            })}
          </div>
        </div>
      ) : entry[0] === "details" ? (
        <>
          <div
            key={`row_table_${index}`}
            style={{ ...clasess.rowItem, marginRight: 5, marginTop: 22 }}
          >
            {entry[1]}
          </div>
          {/* <div style={clasess.detailsLine} /> */}
        </>
      ) : entry[0] === "amount" ||
        entry[0] === "unitPrice" ||
        entry[0] === "discount" ||
        entry[0] === "finalPrice" ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div key={`row_table_${index}`} style={clasess.rowItem}>
            <GomakeTextInput
              style={clasess.textInputWithoutStyle}
              value={entry[1].toFixed(2)}
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
          <div>
            {row?.childsQuoteItems?.map((item, index2) => {
              return (
                <div
                  key={`row_table_${index2}`}
                  style={{ ...clasess.rowItem, borderTop: "1px solid #ccc" }}
                >
                  {entry[0] === "amount" ? (
                    <div style={{ padding: 16 }}>
                      {item?.amount?.toFixed(2)}
                    </div>
                  ) : null}
                  {entry[0] === "unitPrice" ? (
                    <div style={{ padding: 16 }}>
                      {item?.unitPrice?.toFixed(2)}
                    </div>
                  ) : null}
                  {entry[0] === "discount" ? (
                    <div style={{ padding: 16 }}>
                      {item?.discount == null ? 0 : item?.discount}
                    </div>
                  ) : null}
                  {entry[0] === "finalPrice" ? (
                    <div style={{ padding: 16 }}>
                      {item?.finalPrice?.toFixed(2)}
                    </div>
                  ) : null}
                  {entry[0] === "more" ? (
                    <div style={{ padding: 16 }}>{item?.more}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : entry[0] === "more" ? (
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div
            key={`row_table_${index}`}
            style={{ ...clasess.rowItemChilds, marginTop: 22 }}
          >
            {entry[1]}
          </div>
          <div style={{ width: "100%" }}>
            {row?.childsQuoteItems?.map((item, index2) => {
              return (
                <div
                  key={`row_table_${index2}`}
                  style={{
                    ...clasess.rowItemChilds,
                    borderTop: "1px solid #ccc",
                    height: 54,
                  }}
                >
                  {item?.more}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          key={`row_table_${index}`}
          style={{ ...clasess.rowItem, marginTop: 22 }}
        >
          {entry[1]}
        </div>
      )}
    </div>
  );
};

export { RowInsideWithChilds };
