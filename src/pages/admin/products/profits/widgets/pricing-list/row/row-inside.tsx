import { GomakeTextInput } from "@/components";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { editPriceListState } from "../../../store/edit-price-list";

const RowInside = ({
  index,
  tablePercent,
  clasess,
  entry,
  editPriceListStateValue,
  setEditPriceListState,
  row,
  onUpdate,
}: any) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  useEffect(() => {
    console.log("updateTrigger", updateTrigger);
    if (updateTrigger) {
      onUpdate();
    }
    setUpdateTrigger(false);
  }, [updateTrigger]);
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsUpdate(false);

                  setEditPriceListState({
                    ...editPriceListStateValue,
                    isEdit: false,
                  });
                  setUpdateTrigger(true);
                }
              }}
              onChange={(e) => {
                setEditPriceListState({
                  ...editPriceListStateValue,
                  state: {
                    ...editPriceListStateValue.state,
                    [entry[0]]: e.target.value,
                  },
                });
                if (entry[0] === "totalPrice") {
                  setEditPriceListState({
                    ...editPriceListStateValue,
                    state: {
                      ...editPriceListStateValue.state,
                      totalPrice: e.target.value,
                      profit:
                        e.target.value /
                        (editPriceListStateValue.state.profit / 100),
                    },
                  });
                }
              }}
              autoFocus={true}
            />
          </div>
        </div>
      ) : entry[0] !== "more" ? (
        <div
          onClick={() => {
            if (
              entry[0] !== "cost" &&
              entry[0] !== "quantity" &&
              editPriceListStateValue.isEdit !== true
            ) {
              setEditPriceListState({
                ...editPriceListStateValue,
                state: {
                  ...row,
                },
                isEdit: true,
              });
              setIsUpdate(true);
            }
          }}
        >
          {Number(entry[1]).toFixed(2)}
        </div>
      ) : (
        entry[1]
      )}
    </div>
  );
};

export { RowInside };
