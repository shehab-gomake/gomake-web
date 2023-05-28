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
              onMouseLeave={(e) => {
                setIsUpdate(false);
                if (entry[0] === "totalPrice") {
                  console.log("e.target.value", e.target.value);
                  setEditPriceListState({
                    ...editPriceListStateValue,
                    state: {
                      ...editPriceListStateValue.state,
                      totalPrice: e.target.value,
                      profit:
                        editPriceListStateValue.state.totalPrice /
                        (editPriceListStateValue.state.profit / 100),
                    },
                  });
                }
                setUpdateTrigger(true);
              }}
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
                ...row,
              },
            });
            setIsUpdate(true);
          }}
        >
          {Number(entry[1]).toFixed(2)}
        </div>
      )}
    </div>
  );
};

export { RowInside };
