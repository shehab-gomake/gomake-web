import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      // Container styles
      childTableContainer: {
        width: '100%',
        mt: 1
      },
      loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        p: 3
      },
      noDataContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 1,
        p: 3,
        border: '1px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      },
      noDataText: {
        fontSize: '14px',
        color: '#666'
      },
      noDataLink: {
        fontSize: '14px',
        color: primaryColor(500),
        textDecoration: 'underline',
        cursor: 'pointer',
        fontWeight: '500'
      },

      // Table container styles
      tableContainer: {
        maxHeight: 400,
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
        tableLayout: 'auto'
      },

      // Header row styles
      headerRow: {
        textAlign: 'center',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        padding: '4px',
        backgroundColor: '#EBECFF',
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
         width: 'fit-content',
        minWidth: 'fit-content'
      },
      headerCellSticky: {
        textAlign: 'center',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        padding: '4px',
        backgroundColor: '#EBECFF',
        position: 'sticky',
        right: '123px',
        zIndex: 105,
        width: 'fit-content',
        minWidth: 'fit-content',
      },
      headerCellStickyLast: {
        textAlign: 'center',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        padding: '4px',
        backgroundColor: '#EBECFF',
        position: 'sticky',
        right: 0,
        zIndex: 105,
        width: 'fit-content',
        minWidth: 'fit-content',
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

      // Body cell styles
      bodyCell: {
        textAlign: 'center',
        padding: '12px 8px',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #e0e0e0'
      },
      bodyCellSticky: {
        textAlign: 'center',
        padding: '12px 8px',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        right: '123px',
        zIndex: 5,
        backgroundColor: '#fff',
      },
      bodyCellStickyLast: {
        textAlign: 'center',
        padding: '12px 8px',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #e0e0e0',
        minWidth: '123px',
        width: '123px',
        position: 'sticky',
        right: 0,
        zIndex: 5,
        backgroundColor: '#fff'
      },

      // Header button container
      headerButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1
      },

      // Action button styles
      addButton: {
        color: primaryColor(500),
        '&:hover': {
          backgroundColor: primaryColor(50)
        }
      },
      deleteButton: {
        color: '#f44336',
        '&:hover': {
          backgroundColor: '#ffebee'
        }
      },
      actionButton: {
        color: primaryColor(500),
        marginRight: '4px',
        '&:hover': {
          backgroundColor: primaryColor(50)
        }
      },

      // Modal styles
      modalContent: {
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      },
      modalLabelText: {
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#000'
      },
      modalSelect: {
        width: '100%',
        height: '37px',
        padding: '0 12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: '#fff'
      },
      modalActions: {
        padding: '16px 24px'
      },
      modalCancelButton: {
        backgroundColor: '#f5f5f5',
        color: '#666',
        marginRight: '8px',
        width: 'auto',
        padding: '8px 16px'
      },
      modalSubmitButton: {
        width: 'auto',
        padding: '8px 16px'
      },

      // Main container
      mainContainer: {
        width: '100%',
        gridColumn: '1 / -1'
      },

      // Drag and drop styles for child tables
      dragHandleCell: {
        width: '40px',
        minWidth: '40px',
        textAlign: 'center',
        cursor: 'grab',
        padding: '4px',
        '&:active': {
          cursor: 'grabbing'
        }
      },
      dragHandleIcon: {
        color: primaryColor(400),
        fontSize: '16px',
        '&:hover': {
          color: primaryColor(600),
        }
      },
      draggingRow: {
        backgroundColor: '#f4f4f4',
        opacity: 0.8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transform: 'rotate(1deg)',
      },
      dropZone: {
        backgroundColor: primaryColor(50),
        borderTop: `2px solid ${primaryColor(500)}`,
      },
    };
  }, [theme, primaryColor, secondColor]);
  
  return {
    classes,
  };
};

export { useStyle };
