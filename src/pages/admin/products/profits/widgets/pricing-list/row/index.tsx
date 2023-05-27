import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";
import { useRecoilState, useRecoilValue } from "recoil";
import { editPriceListState } from "../../../store/edit-price-list";
import { IconButton, Tooltip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import CancelIcon from "@mui/icons-material/Cancel";
import { profitsState } from "../../../store/profits";
import { actionExceptionProfitId } from "@/store";

const Row = ({ row, width, tablePercent }: any) => {
  const { clasess } = useStyle({ width });
  const [editPriceListStateValue, setEditPriceListState] =
    useRecoilState<any>(editPriceListState);
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const actionExceptionProfitIdValue = useRecoilValue<any>(
    actionExceptionProfitId
  );
  const { t } = useTranslation();
  return (
    <div style={clasess.bodyRow}>
      {Object.entries(row).map((entry: [string, any], index: number) => {
        if (entry[0] !== "id") {
          return (
            <div
              key={`row_table_${index}`}
              style={
                entry[0] == "more"
                  ? clasess.editItem
                  : { ...clasess.rowItem, width: `${tablePercent[index]}` }
              }
            >
              {editPriceListStateValue?.isEdit &&
              editPriceListStateValue?.id === row.id ? (
                <>
                  {(entry[0] === "width" ||
                    entry[0] === "height" ||
                    entry[0] === "profit" ||
                    entry[0] === "quantity") && (
                    <div style={clasess.textInputsContainer}>
                      <GomakeTextInput
                        style={clasess.textInputStyle}
                        value={editPriceListStateValue?.state[entry[0]]}
                        onChange={(e) => {
                          setEditPriceListState({
                            ...editPriceListStateValue,
                            state: {
                              ...editPriceListStateValue.state,
                              [entry[0]]: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                entry[1]
              )}
            </div>
          );
        }
      })}
      {editPriceListStateValue?.isEdit &&
        editPriceListStateValue?.id === row.id && (
          <div style={clasess.controlsContainer}>
            <Tooltip title={t("materials.buttons.saveModifications")}>
              <IconButton
                // onClick={
                //   actionExceptionProfitIdValue
                //     ? () => profitsStateValue?.updateActionExceptionProfitRow()
                //     : () => profitsStateValue?.updateActionProfitRow()
                // }
                onClick={() => profitsStateValue?.updateActionProfitRow()}
              >
                <SaveIcon style={{ color: "#a1a2cd" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("materials.buttons.cancel")}>
              <IconButton
                onClick={() => {
                  setEditPriceListState({ isEdit: false });
                }}
              >
                <CancelIcon style={{ color: "#a1a2cd" }} />
              </IconButton>
            </Tooltip>
          </div>
        )}
    </div>
  );
};

export { Row };
