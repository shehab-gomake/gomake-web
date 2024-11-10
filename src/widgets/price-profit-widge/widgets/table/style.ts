import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
const useStyle = () => {
  const classes = useMemo(() => {
    return {
        table: {
          borderCollapse: 'separate' as "separate"
        },
        tableHead:{
          height:72,
          background:"#F2F4F7"
        },
        tableHeadCell: {
          border: '1px solid #EAECF0',
          ...FONT_FAMILY.Lexend(700, 14),
          paddingLeft: "56px"
        },
        tableHeadCellValue: {
          border: '1px solid #EAECF0',
          textAlign: 'center',
          ...FONT_FAMILY.Lexend(700, 14)
        },
        tableHeadCellValueTotal: {
          ...FONT_FAMILY.Lexend(600, 14),
          borderLeft: "6px solid #4BA30D"
        },
        tableHeadCellTotalValue: {
          border: '1px solid #EAECF0',
          textAlign: 'center',
          ...FONT_FAMILY.Lexend(500, 14)
        },
        tableBodyCell: {
          border: '1px solid #EAECF0',
        },
        tableBodyCellError: {
          backgroundColor: '#f8d7da',
          color: 'red',
          ...FONT_FAMILY.Lexend(500, 14),
          cursor: "pointer"
        },
        tableBodyNotErrorCell: {
          ...FONT_FAMILY.Lexend(500, 14)
        },
        tableBodyCellContent: {
          display: 'flex',
          flexDirection: "row" as "row",
          justifyContent: "center",
          alignItems: 'center',
          gap: 5,
          textAlign: 'center' as "center"
        }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
