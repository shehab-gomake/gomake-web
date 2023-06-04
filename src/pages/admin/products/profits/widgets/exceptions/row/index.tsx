import { IconButton, Tooltip } from "@mui/material";
import { useStyle } from "./style";
import DeleteIcon from "@mui/icons-material/Delete";
import { t } from "i18next";
import { GoMakeDeleteModal } from "@/components";
import { useRecoilValue } from "recoil";
import { profitsState } from "../../../store/profits";

const Row = ({ key, row }: any) => {
  const { clasess } = useStyle({ row });
  const profitsStateValue = useRecoilValue<any>(profitsState);
  return (
    <>
      <div key={key} style={clasess.bodyRow}>
        {Object.entries(row).map((entry: [string, any], index: number) => {
          if (
            entry[0] !== "id" &&
            entry[0] !== "selectedAdditional" &&
            entry[0] !== "exceptionTypeValue"
          ) {
            return (
              <div
                key={`row_table_${index}`}
                style={clasess.rowItem}
                onClick={() =>
                  profitsStateValue?.onCklickActionExceptionProfitRow(
                    row?.id,
                    row?.selectedAdditional,
                    row?.exceptionTypeValue
                  )
                }
              >
                {entry[1]}
              </div>
            );
          }
        })}
        {/* <div style={clasess.deleteContainer}>
          <Tooltip title={t("materials.buttons.delete")}>
            <IconButton
              onClick={() =>
                profitsStateValue?.onOpenDeleteExceptionProfitModal(row)
              }
            >
              <DeleteIcon style={{ color: "#a1a2cd" }} />
            </IconButton>
          </Tooltip>
        </div> */}
      </div>
      {row === profitsStateValue.selectedExceptionProfit && (
        <GoMakeDeleteModal
          title={t("products.profits.exceptions.deleteExceptionProfit")}
          yesBtn={t("materials.buttons.delete")}
          openModal={profitsStateValue.openDeleteExceptionProfitModal}
          onClose={profitsStateValue.onCloseDeleteExceptionProfitModal}
          // subTitle={subTitle}
          onClickDelete={() => profitsStateValue.deleteExceptionProfit(row?.id)}
        />
      )}
    </>
  );
};

export { Row };
