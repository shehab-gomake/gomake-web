import { GomakeTextInput } from "@/components";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { editPriceListState } from "../../../store/edit-price-list";
import { useClickAway } from "@uidotdev/usehooks";
import Lottie from "react-lottie";
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
    autoplay: true,
    animationData: animationData,
  };

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
          <Lottie options={defaultOptions} height={"50px"} width={"50px"} />
        ) : (
          <div
            onClick={() => {
              if (
                entry[0] !== "unitPrice" &&
                entry[0] !== "totalPrice" &&
                entry[0] !== "cost" &&
                entry[0] !== "quantity" &&
                entry[0] !== "status" &&
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
            {entry[0] === "profit" && "%"}
          </div>
        )
      ) : row.status === "pending" ? (
        <Lottie options={defaultOptions} height={"50px"} width={"50px"} />
      ) : (
        entry[1]
      )}
    </div>
  );
};

export { RowInside };
