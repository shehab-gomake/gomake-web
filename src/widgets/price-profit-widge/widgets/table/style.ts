import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
const useStyle = () => {
  const classes = useMemo(() => {
    return {
      tableContainer:{
        maxHeight: "69vh",
      },
        table: {
          borderCollapse: 'separate' as "separate"
        },
        tableHead:{
          height:72,
          background:"#B1B2E3"
        },
        tableHeadTotal:{
          height:72,
          background:"#D0D5DD"
        },
        tableHeadCell: {
          border: '1px solid #EAECF0',
          ...FONT_FAMILY.Lexend(500, 14),
          paddingLeft: "25px",
          color: "#FFF"
        },
        tableHeadCellValue: {
          border: '1px solid #EAECF0',
          textAlign: 'center',
          ...FONT_FAMILY.Lexend(500, 14),
          color: "#FFF"
        },
        tableHeadCellValueTotal: {
          ...FONT_FAMILY.Lexend(600, 14),
          borderLeft: "6px solid #4BA30D",
            paddingLeft: "25px"
        },
        tableHeadCellTotalValue: {
          border: '1px solid #EAECF0',
          textAlign: 'center',
          ...FONT_FAMILY.Lexend(500, 14)
        },
        tableBodyCell: {
          border: '1px solid #EAECF0',
          width: "120px",
          maxWidth: "120px",
          
        },
        tableBodyCellForProduct: {
          border: '1px solid #EAECF0',
          width: "120px",
          maxWidth: "120px",
          position: "relative" as "relative",
          "&:hover": {
            background: "#F9FAFB"
          }
        },
        moreIconContainer: { 
          position: "absolute" as "absolute",
          right: "10px",
          top: "25px",
          cursor: "pointer",
        },
        tableBodyCellError: {
          backgroundColor: '#f8d7da',
          color: 'red',
          ...FONT_FAMILY.Lexend(500, 14),
          cursor: "pointer"
        },
        tableBodyNotErrorCell: {
          ...FONT_FAMILY.Lexend(500, 14),
          cursor: "pointer"

        },
        tableBodyCellContent: {
          display: 'flex',
          flexDirection: "row" as "row",
          justifyContent: "center",
          alignItems: 'center',
          gap: 5,
          textAlign: 'center' as "center",
        },
        menuContainer: {
          display: "flex",
          flexDirection: "column" as "column",
          gap: 10,
        },
        menuItem: {
          display: "flex",
          flexDirection: "row" as "row",
          gap: 10,
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%"
        },
        menuItemRestoreContainer: {
          display: "flex",
          flexDirection: "row" as "row",
          gap: 8,
          justifyContent: "flex-start",
          alignItems: "center"
        },
        menuItemUpdateContainer: {
          display: "flex",
          flexDirection: "row" as "row",
          gap: 8,
          justifyContent: "flex-start",
          alignItems: "center"
        },
        menuItemRestoreText: {
          ...FONT_FAMILY.Lexend(500, 14),
          color: "#079455",

        },
        menuItemUpdateText: {
          ...FONT_FAMILY.Lexend(500, 14),
          color: "#D92D20",
        },
        menuItemReviewContainer: {
          display: "flex",
          flexDirection: "row" as "row",
          gap: 8,
          justifyContent: "flex-start",
          alignItems: "center"
        },
        menuItemReviewText: {
          ...FONT_FAMILY.Lexend(500, 14),
          color: "#344054",
        },
        viewAllContainer: {
          display: "flex",
          flexDirection: "row" as "row",
          justifyContent: "flex-start",
          alignItems: "center",
          ...FONT_FAMILY.Lexend(500, 16),
          color: "#2E3092",
          width: "100%",
          gap: 8,
          padding: "16px",
          cursor: "pointer"
        },
        moreMenuContainer: {
          display: "flex",
          flexDirection: "row" as "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0px 4px",
          gap: 16

        },
        switchContainer: {
          display: "flex",
          flexDirection: "row" as "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          border: "1px solid #EAECF0",
          borderRadius: "6px",
          padding: "0px 8px"
        },
        switchText: {
          ...FONT_FAMILY.Lexend(700, 14),
          color: "#344054"
        },
        appearanceText: {
          ...FONT_FAMILY.Lexend(500, 14),
          color: "#344054"
        }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
