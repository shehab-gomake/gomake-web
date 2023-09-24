import { GomakeTextInput } from "@/components";
import { useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import Lottie from "lottie-react";
import * as animationData from "./loading-cal.json";

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
    if (updateTrigger) {
      onUpdate();
    }
    setUpdateTrigger(false);
  }, [updateTrigger]);

  const ref = useClickAway(() => {
    setIsUpdate(false);
    setEditPriceListState({
      ...editPriceListStateValue,
      isEdit: false,
    });
    setUpdateTrigger(true);
  });

  const defaultOptions = {
    loop: true,
    animationData: animationData,
  };

  return (
    <div
      key={`row_table_${index}`}
      style={
        entry[0] == "more"
          ? clasess.editItem
          : entry[0] === "expProfit"
          ? clasess.rowItemExpPofit
          : { ...clasess.rowItem, width: `${tablePercent[index]}` }
      }
    >
      {isUpdate ? (
        <div
          ref={ref}
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
                    changeOn: entry[0],
                    [entry[0]]: e.target.value,
                  },
                });
              }}
              autoFocus={true}
            />
          </div>
        </div>
      ) : entry[0] !== "more" ? (
        row.status === "pending" &&
        (entry[1] == 0 || entry[1] == "NaN" || entry[1] == "Infinity") ? (
          <Lottie
            animationData={defaultOptions.animationData}
            loop={defaultOptions.loop}
            style={{
              width: 50,
              height: 50,
            }}
          />
        ) : (
          <div
            onClick={() => {
              if (
                entry[0] !== "cost" &&
                entry[0] !== "quantity" &&
                entry[0] !== "status" &&
                editPriceListStateValue.isEdit !== true &&
                !row?.isBaseCaseQuantity
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
            {entry[0] !== "quantity"
              ? Number(entry[1]).toFixed(2)
              : Number(entry[1]).toFixed(0)}
            {entry[0] === "profit" && "%"}
            {entry[0] === "expProfit" && "%"}
          </div>
        )
      ) : row.status === "pending" ? (
        <Lottie
          animationData={defaultOptions.animationData}
          loop={defaultOptions.loop}
          style={{
            width: 50,
            height: 50,
          }}
        />
      ) : (
        entry[1]
      )}
    </div>
  );
};

export { RowInside };
