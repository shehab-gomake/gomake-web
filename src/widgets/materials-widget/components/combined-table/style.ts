import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const classes = useMemo(() => {
    return {
      // Main container styles
      mainContainer: {
        position: 'relative',
        width: '100%'
      },

      // Table container styles
      tableContainer: {
        maxHeight: "calc(100vh - 200px)",
        width: '100%',
        overflowX: 'auto',
        overflowY: 'auto',
        position: 'relative',
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
        tableLayout: 'auto'
      },

      // Header row styles
      headerRow: {
        backgroundColor: '#EBECFF',
        position: 'sticky',
        top: 0,
        zIndex: 100
      },

      // Header cell base styles
      headerCellBase: {
        textAlign: 'center',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        padding: '4px',
      },

      // Header cell with normal background
      headerCell: {
        textAlign: 'center',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        padding: '4px',
        backgroundColor: '#EBECFF',
      },


      // Body row styles
      bodyRow: {
        '&:hover': {
          backgroundColor: '#f8f9fa',
        }
      },

      // Body cell base styles
      bodyCellBase: {
        textAlign: 'center',
        padding: '12px 8px',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
      },


      // Child table row container
      childTableRowContainer: {
        padding: 0,
        border: 'none',
        position: 'relative',
        zIndex: 1
      },

      // Child table content box
      childTableContentBox: {
        padding: '2px 8px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
      },

      // Scroll indicator button
      scrollIndicatorButton: {
        position: 'absolute',
        top: '50%',
        [isRTL ? 'left' : 'right']: '16px',
        transform: 'translateY(-50%)',
        backgroundColor: primaryColor(200),
        color: '#fff',
        width: '32px',
        height: '32px',
        boxShadow: `0 4px 12px ${primaryColor(200)}`,
        zIndex: 1000,
        '&:hover': {
          backgroundColor: primaryColor(200),
          boxShadow: `0 6px 16px ${primaryColor(200)}`,
        },
        '&:active': {
          transform: 'translateY(-50%) scale(0.95)',
        },
        transition: 'all 0.2s ease-in-out',
        '@keyframes pulse': {
          '0%': {
            boxShadow: `0 4px 12px ${primaryColor(300)}`
          },
          '50%': {
            boxShadow: `0 6px 20px ${primaryColor(500)}`
          },
          '100%': {
            boxShadow: `0 4px 12px ${primaryColor(300)}`
          }
        },
        animation: 'pulse 2s ease-in-out infinite'
      },

    };
  }, [theme, primaryColor, secondColor, isRTL, dir]);

  // Utility functions for dynamic styles
  const getHeaderCellStyle = () => ({
    textAlign: 'center',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    padding: '4px',
    backgroundColor: '#EBECFF',
  });

  const getBodyCellStyle = () => ({
    textAlign: 'center',
    padding: '12px 8px',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #e0e0e0',
    position: 'relative',
  });
  
  return {
    classes,
    getHeaderCellStyle,
    getBodyCellStyle,
  };
};

export { useStyle };
