import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const classes = useMemo(() => {
    return {
      // Container styles
      childTableContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1000,
      },
      
      // Split layout container
      splitTableContainer: {
        display: 'flex',
        width: '100%',
        position: 'relative',
      },
      
      // Fixed columns container (always visible)
      fixedColumnsContainer: {
        position: 'sticky',
        left: 0,
        zIndex: 10000,
        backgroundColor: '#fff',
        borderRight: '2px solid #e0e0e0',
        minWidth: '200px',
        maxWidth: '200px',
        flexShrink: 0,
      },
      
      // Scrollable columns container
      scrollableColumnsContainer: {
        flex: 1,
        overflowX: 'auto',
        position: 'relative',
      },
      loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        // p: 3
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
         width: 'fit-content',
        minWidth: 'fit-content',
        // textTransform: 'capitalize',
      },
      headerCellUnitText:{
        ...FONT_FAMILY.Inter(700, 12)
      },
      headerCellPriceUnitText:{
        textTransform: 'capitalize' as 'capitalize',

      },
      headerCellText:{
        color:"#2E3092"

      },
      headerCellSticky: {
        textAlign: 'center',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        padding: '4px',
        backgroundColor: '#EBECFF',
        position: 'sticky',
        [isRTL ? 'left' : 'right']: '123px',
        zIndex: 105,
        width: 'fit-content',
        minWidth: 'fit-content',
        textTransform: 'capitalize',
      },
      headerCellStickyLast: {
        textAlign: 'center',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        padding: '4px',
        backgroundColor: '#EBECFF',
        position: 'sticky',
        [isRTL ? 'left' : 'right']: 0,
        zIndex: 105,
        width: 'fit-content',
        minWidth: 'fit-content',
        textTransform: 'capitalize',
      },

      // Body row styles
      bodyRow: {
        // '&:hover': {
        //   backgroundColor: '#f8f9fa',
        //   zIndex: 1000,
        //   '& .MuiTableCell-root.fixed-column': {
        //     backgroundColor: '#f5f5f5',
        //     zIndex: 1000,
        //   }
        // }
      },

      // Body cell styles
      bodyCell: {
        textAlign: 'center',
        padding: '12px 8px',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #e0e0e0',
        color:"#2E3092",
        backgroundColor: '#fff',

      },
      bodyCellSticky: {
        textAlign: 'center',
        padding: '12px 8px',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        [isRTL ? 'left' : 'right']: '123px',
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
        [isRTL ? 'left' : 'right']: 0,
        zIndex: 5,
        backgroundColor: '#fff'
      },

      // Add button container above table
      addButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: '8px',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 2147483647, // Maximum z-index
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        // Ensure it stays above everything
        isolation: 'isolate',
        transform: 'translateZ(0)',
      },

      // Table title text
      tableTitle: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#374151',
        margin: 0,
      },

      // Add inventory button
      addInventoryButton: {
        backgroundColor: '#fff',
        color: primaryColor(600),
        border: `1px solid ${primaryColor(200)}`,
        borderRadius: '6px',
        fontWeight: 500,
        fontSize: '12px',
        textTransform: 'none',
        minHeight: '28px',
        minWidth: 'auto',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        width: 'fit-content',
        height: '40px',
        '&:hover': {
          backgroundColor: primaryColor(50),
          borderColor: primaryColor(400),
          color: primaryColor(700),
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        
      },

      // Add purchase pricing button
      addPurchasePricingButton: {
        backgroundColor: '#fff',
        color: secondColor(600),
        border: `1px solid ${secondColor(200)}`,
        padding: '6px 12px',
        borderRadius: '6px',
        fontWeight: 500,
        fontSize: '12px',
        textTransform: 'none',
        minHeight: '28px',
        minWidth: 'auto',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: secondColor(50),
          borderColor: secondColor(400),
          color: secondColor(700),
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        '& .MuiButton-startIcon': {
          marginRight: '6px',
          '& svg': {
            fontSize: '16px',
          },
        },
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
        color: secondColor(500),
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
      dialogTitle:{
       padding:"8px 16px",
       paddingBottom:"0px",
      },
      // Modal styles
      modalContent: {
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        gap:"15px",

      },
      modalContent1:{
        padding:"8px 16px",
      },
      modalLabelText: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#000'
      },
      modalLabelText2: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: '14px',
        fontWeight: 600,
        color: '#000'
      },
      modalInputContainer:{
        display: 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%'
     },
     modalInputContainerItem:{
        width: '50%'
     },
      modalSelect: {
        width: '100%',
        height: '37px',
        padding: '0px 12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: '#fff'
      },
      modalActions: {
        padding: '8px 16px'
      },
      modalCancelButton: {
        backgroundColor: '#f5f5f5',
        color: '#666',
        width: 'auto',
        padding: '8px 16px',
        height: '40px'
      },
      modalSubmitButton: {
        width: 'auto',
        padding: '8px 16px',
        height: '40px'
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
      modalActionsContainer:{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        marginTop: 5
      }
    };
  }, [theme, primaryColor, secondColor, isRTL, dir]);
  
  return {
    classes,
  };
};

export { useStyle };
