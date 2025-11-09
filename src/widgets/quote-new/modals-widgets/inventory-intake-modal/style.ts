import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const classes = useMemo(() => {
    return {
      // Table container styles
      tableContainer: {
        maxHeight: 350,
        width: '100%',
        overflowX: 'auto',
        overflowY: 'auto',

        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#a8a8a8',
          },
        },
      },

      // Table styles
      table: {
        width: '100%',
        tableLayout: 'fixed' as 'fixed',
      },

      // Header row styles
      headerRow: {
        textAlign: 'center' as "center",
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        padding: '4px',
        backgroundColor: '#FFF',
         width: 'fit-content',
        minWidth: 'fit-content'
      },

        // Header cell styles
        headerCell: {
          textAlign: 'center',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          padding: '4px',
          backgroundColor: '#EBECFF',
          textTransform: 'capitalize' as 'capitalize',
        },
        // Column width styles
        codeCell: {
          minWidth: '100px',
          width: '100px',
        },
        purchasePriceCell: {
          minWidth: '180px',
          width: '180px',
        },
        purchaseCurrencyCell: {
          minWidth: '140px',
          width: '140px',
        },
        salePriceCell: {
          minWidth: '180px',
          width: '180px',
        },
        saleCurrencyCell: {
          minWidth: '140px',
          width: '140px',
        },
        quantityCell: {
          minWidth: '120px',
          width: '120px',
        },
      headerCellUnitText: {
        ...FONT_FAMILY.Inter(700, 12),
        textTransform: 'lowercase' as 'lowercase',
      },
      headerCellPriceUnitText:{
        textTransform: 'capitalize' as 'capitalize',

      },
      headerCellText: {
        color: "#2E3092",
      },

      // Body row styles
      bodyRow: {
        '&:hover': {
          backgroundColor: '#f8f9fa',
        },
      },

      // Body cell styles
      bodyCell: {
        textAlign: 'center' as 'center',
        padding: '12px 8px',
        whiteSpace: 'nowrap' as 'nowrap',
        borderBottom: '1px solid #e0e0e0',
        color: "#2E3092",
        backgroundColor: '#fff',
      },

      // Input container
      inputContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      },
    };
  }, [theme, primaryColor, secondColor, isRTL, dir]);

  return {
    classes,
  };
};
