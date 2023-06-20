import { IconButton, Tooltip } from "@mui/material";
import { useStyle } from "./style";
import DeleteIcon from "@mui/icons-material/Delete";
import { t } from "i18next";
import { GoMakeDeleteModal } from "@/components";
import { useRecoilValue } from "recoil";
import { profitsState } from "../../../store/profits";
import { EditIcon } from "@/icons";
import { useState } from "react";

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

        <IconButton
          onClick={() => profitsStateValue?.onOpenUpdateExceptionModal(row)}
        >
          <EditIcon />
        </IconButton>
      </div>
    </>
  );
};

export { Row };
