import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "50%",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        position: "absolute" as "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        height: "max-content",
        minHeight: "27%",
        maxHeight: "60%",
        overFlow: "auto" as "auto",
        padding: convertWidthToVW(24),
      },
      subContainer: {
        display: "flex",
        gap: "10px",
        width: "100%",
        overflowX: "scroll" as "scroll",
        paddingTop: "6px"
      },
      titleModalStyle: {
        display: "flex",
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 18),
        lineHeight: "28px"
      },
      headerContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      closeIcon: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        cursor: "pointer" as "pointer",
      },
      tabsContainer: {
        height: "fit-content",
        display: 'flex',
        minWidth: "fit-content",
        padding: "13px",
        flexDirection: 'column' as 'column',
        alignItems: 'flex-start',
        gap: 'var(--spacing-xs, 4px)',
        borderRadius: 'var(--radius-xl, 12px)',
        border: '1px solid var(--Colors-Border-border-secondary, #EAECF0)',
        background: 'var(--Colors-Background-bg-secondary_alt, #F9FAFB)',
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      },
      tabContent: {
        width: "100%"
      },
      receiptMethodsTable: {
        borderRadius: "12px",
        maxHeight: "100%",
        overflow: "scroll",
        border: "1px solid #EAECF0"
      },
      tableRowStyle: {
        height: "44px",
        background: "#8283BE",
        color: "white",
      },
      cellContainerStyle: {
        textAlign: "center" as "center",
        padding: "0px 24px",
        ...FONT_FAMILY.Inter(400, 14),
        color: "#475467",
      },
      tableHeaderStyle: {
        background: 'var(--Colors-Background-bg-secondary_alt, #F9FAFB)',
        color: "#475467",
        textAlign: "center" as "center",
        fontStyle: "normal",
        ...FONT_FAMILY.Inter(500, 14),
      },
      noDataText: {
        ...FONT_FAMILY.Inter(600, 16),
        color: 'var(--colors-text-text-primary-900, #101828)',
        textAlign: 'center' as 'center',
        fontStyle: 'normal',
        lineHeight: '24px',
      },
      noDataSubText: {
        ...FONT_FAMILY.Inter(400, 14),
        color: 'var(--colors-text-text-tertiary-600, #475467)',
        textAlign: 'center' as 'center',
        fontStyle: 'normal',
        lineHeight: '20px'
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };