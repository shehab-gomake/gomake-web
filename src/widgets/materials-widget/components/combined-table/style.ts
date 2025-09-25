import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      // Main container styles
      mainContainer: {
        position: 'relative',
        width: '100%'
      },

      // Table container styles
      tableContainer: {
        maxHeight: 800,
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

      // Header cell with fixed column background
      headerCellFixed: {
        textAlign: 'center',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        padding: '4px',
        backgroundColor: '#D5D7FF',
      },

      // Body row styles
      bodyRow: {
        '&:hover': {
          backgroundColor: '#f8f9fa',
          '& .MuiTableCell-root.fixed-column': {
            backgroundColor: '#f5f5f5'
          }
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

      // First column sticky styles
      firstColumnSticky: {
        position: 'sticky',
        left: 0,
        zIndex: 5,
        backgroundColor: '#fff',
      },

      // Last fixed columns sticky styles
      lastFixedColumnSticky: {
        position: 'sticky',
        zIndex: 5,
        backgroundColor: '#fff',
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
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0'
      },

      // Scroll indicator button
      scrollIndicatorButton: {
        position: 'absolute',
        top: '50%',
        right: `${3 * 118}px`, // Position at the start of fixed columns
        transform: 'translateY(-50%)',
        backgroundColor: primaryColor(500),
        color: '#fff',
        width: '32px',
        height: '32px',
        boxShadow: `0 4px 12px ${primaryColor(300, 0.3)}`,
        zIndex: 1000,
        '&:hover': {
          backgroundColor: primaryColor(600),
          boxShadow: `0 6px 16px ${primaryColor(400, 0.4)}`,
        },
        '&:active': {
          transform: 'translateY(-50%) scale(0.95)',
        },
        transition: 'all 0.2s ease-in-out',
        '@keyframes pulse': {
          '0%': {
            boxShadow: `0 4px 12px ${primaryColor(300, 0.3)}`
          },
          '50%': {
            boxShadow: `0 6px 20px ${primaryColor(500, 0.5)}`
          },
          '100%': {
            boxShadow: `0 4px 12px ${primaryColor(300, 0.3)}`
          }
        },
        animation: 'pulse 2s ease-in-out infinite'
      },

    };
  }, [theme, primaryColor, secondColor]);

  // Utility functions for dynamic styles
  const getHeaderCellStyle = (isFirstColumn: boolean, isLastFixedColumn: boolean, index: number, headersLength: number) => ({
    textAlign: 'center',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    padding: '4px',
    backgroundColor: isLastFixedColumn ? '#D5D7FF' : '#EBECFF',
    minWidth: isFirstColumn ? '50px' : isLastFixedColumn ? '123px' : 'auto',
    width: isFirstColumn ? '50px' : isLastFixedColumn ? '123px' : 'auto',
    ...(isFirstColumn && {
      position: "sticky",
      left: 0,
      zIndex: 110,
    }),
    ...(isLastFixedColumn && {
      position: 'sticky',
      right: (headersLength - 1 - index) * 123,
      zIndex: 105,
      boxShadow: index === headersLength && '-4px 0 8px rgba(0,0,0,0.15), -2px 0 4px rgba(0,0,0,0.1)',
      borderLeft: index === headersLength - 3 ? '0.5px solid rgba(0,0,0,0.15)' : 'none'
    })
  });

  const getBodyCellStyle = (isFirstColumn: boolean, isLastFixedColumn: boolean, cellIndex: number, headersLength: number) => ({
    textAlign: 'center',
    padding: '12px 8px',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #e0e0e0',
    position: 'relative',
    minWidth: isFirstColumn ? '50px' : isLastFixedColumn ? '123px' : 'auto',
    width: isFirstColumn ? '50px' : isLastFixedColumn ? '123px' : 'auto',
    ...(isFirstColumn && {
      position: 'sticky',
      left: 0,
      zIndex: 5,
      backgroundColor: '#fff',
    }),
    ...(isLastFixedColumn && {
      position: 'sticky',
      right: (headersLength - 1 - cellIndex) * 123,
      zIndex: 5,
      backgroundColor: '#fff',
      boxShadow: cellIndex === headersLength && '-4px 0 8px rgba(0,0,0,0.15), -2px 0 4px rgba(0,0,0,0.1)',
      borderLeft: cellIndex === headersLength - 3 ? '0.5px solid rgba(0,0,0,0.15)' : 'none'
    })
  });
  
  return {
    classes,
    getHeaderCellStyle,
    getBodyCellStyle,
  };
};

export { useStyle };
