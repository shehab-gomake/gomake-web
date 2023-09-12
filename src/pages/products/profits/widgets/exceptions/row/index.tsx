import { IconButton } from "@mui/material";
import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { profitsState } from "../../../store/profits";
import { EditIcon } from "@/icons";

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
            entry[0] !== "exceptionTypeValue" &&
            entry[0] !== "recordID" &&
            entry[0] !== "item"
          ) {
            return (
              <div
                key={`row_table_${index}`}
                style={{
                  ...clasess.rowItem,
                  width: index === 3 ? "40%" : "20%",
                }}
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
          style={{
            position: "absolute",
            right: 0,
          }}
          onClick={() => profitsStateValue?.onOpenUpdateExceptionModal(row)}
        >
          <EditIcon />
        </IconButton>
      </div>
    </>
  );
};

export { Row };
