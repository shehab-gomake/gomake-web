import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptRight } from "@/utils/adapter";

const useStyle = (dir: string) => {
  const { theme, primaryColor, warningColor } = useGomakeTheme();
  const BORDER = "0.1px solid #CECECE";
  const BORDER_RADIUS = "16px";
  const classes = useMemo(() => {
    return {
      tableWrapper: {
        border: BORDER,
        borderRadius: BORDER_RADIUS,
        borderRight: 0,
        padding: 0,
        overflow: "auto" as "auto",
        maxHeight: "75vh",
        position: "relative" as "relative",
        marginBottom: "5px",
        width: "fit-content",
        maxWidth: "100%",
        // Custom scrollbar styling
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#c1c1c1",
          borderRadius: "4px",
          "&:hover": {
            background: "#a8a8a8",
          },
        },
        "&::-webkit-scrollbar-corner": {
          background: "#f1f1f1",
        },
      },
      table: {
        borderCollapse: "collapse" as "collapse",
        position: "relative" as "relative",
      },

      tableHead: {
        backgroundColor: primaryColor(500),
        maxHeight: "100px",
        height: "100px",
        color: "white",
        textAlign: "center" as "center",
        ...FONT_FAMILY.Lexend(400, 12),
        position: "sticky" as "sticky",
        top: "0px",
        cursor: "pointer" as "pointer",
        minWidth: "120px",
        padding: "0 5px",
      },

      selectedMachine: {
        backgroundColor: primaryColor(300),
      },

      tableCell: {
        textAlign: "center" as "center",
        ...FONT_FAMILY.Lexend(500, 16),
        lineHeight: 0,
        height: "40px",
        minWidth: "115px",
        border: BORDER,
        borderTop: 0,
        borderLeft: 0,
      },
      tdRows: {
        // display: 'flex',
        // flexDirection: 'column' as 'column',
        // alignItems: 'center' as 'center',
        // justifyContent: 'center' as 'center',
        // width: '100%',
        // height: '100%',
        // maxHeight: '80px',
        //  gap: '8px',
        // ...FONT_FAMILY.Lexend(400, 14)
      },

      firstColHead: {
        minWidth: "650px",
        zIndex: 1,
        padding: "0 5px",
        ...adaptRight(dir, 0),
      },
      firstColHeadContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRight: 0,
        position: "relative" as "relative",
      },
      firstColCell: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: "350px",
        padding: " 5px",
      },
      splitBoardsStatuses: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center" as "center",
        //?new
        gap: 10,
      },
      splitBoardsStatusesRow: {
        height: 40,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        width: 200,
        border: 0,
        paddingLeft: 5,
      },
      firstColCellSplitBoards: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minWidth: "405px",
        padding: "0 5px 0 0",
      },
      lateMission: {
        backgroundColor: warningColor(100),
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
