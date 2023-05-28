import { GomakeTextInput } from "@/components";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { editPriceListState } from "../../../store/edit-price-list";

const RowInside = ({
  index,
  tablePercent,
  clasess,
  entry,
  editPriceListStateValue,
  setEditPriceListState,
}: any) => {
  const [isUpdate, setIsUpdate] = useState(false);

  return (
    <div
      key={`row_table_${index}`}
      style={
        entry[0] == "more"
          ? clasess.editItem
          : entry[0] === "ExpProfit"
          ? clasess.rowItemExpPofit
          : { ...clasess.rowItem, width: `${tablePercent[index]}` }
      }
    >
      {isUpdate ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            // gap: 100,
          }}
        >
          <div style={clasess.textInputsContainer}>
            <GomakeTextInput
              style={clasess.textInputStyle}
              value={
                editPriceListStateValue?.state
                  ? editPriceListStateValue?.state[entry[0]]
                  : entry[1]
              }
              onMouseLeave={() => setIsUpdate(false)}
              onChange={(e) => {
                setEditPriceListState({
                  ...editPriceListStateValue,
                  state: {
                    ...editPriceListStateValue.state,
                    [entry[0]]: e.target.value,
                  },
                });
              }}
              autoFocus={true}
            />
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setEditPriceListState({
              ...editPriceListStateValue,
              state: {
                ...editPriceListStateValue.state,
                [entry[0]]: entry[1],
              },
            });
            setIsUpdate(true);
          }}
        >
          {entry[1]}
        </div>
      )}
    </div>
  );
};

export { RowInside };
