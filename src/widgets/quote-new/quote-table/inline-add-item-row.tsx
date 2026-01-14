import { useState, useEffect } from "react";
import { TableRow, TableCell, IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";
import { useStyle } from "./style";
import { useAddNewItem } from "../modals-widgets/add-new-item-modal/use-add-new-item";
import { DeleteIcon } from "@/pages-components/quotes/more-circle/icons/delete";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";

interface InlineAddItemRowProps {
  columnWidths: any[];
  headerHeight: number;
  onCancel: () => void;
  documentType: any;
  getCalculateQuoteItem: (
    item: any,
    quantity: number,
    price: number,
    quoteValue: any,
    isNewCreation?: boolean
  ) => void;
  quoteItemValue?: any;
  setQuoteItemValue?: (value: any) => void;
  rowNumber: number;
  isInlineRowCollapsed: boolean;
  documentItems: any[];
  handleShowInlineAddRow: () => void;
  getQuote: () => void;
}

const InlineAddItemRow: React.FC<InlineAddItemRowProps> = ({
  columnWidths,
  headerHeight,
  onCancel,
  documentType,
  getCalculateQuoteItem,
  rowNumber,
  isInlineRowCollapsed,
  documentItems,
  handleShowInlineAddRow,
  getQuote,
}) => {
  const { t } = useTranslation();
  const { classes, primarySecondaryBlend } = useStyle({ headerHeight });

  const [isAdding, setIsAdding] = useState(false);
  const { CheckPreferenceValue } = usePrintHousePreferences();

  const {
    onClickCreateQuoteForCustomer,
    handleProductChange,
    combinedData,
    selectedProduct,
    selectedTab,
    setSelectedTab,
  } = useAddNewItem({
    onClose: () => {},
    getQuote: getQuote, // We don't need to refresh the quote here
    documentType,
    getCalculateQuoteItem,
  });

  const handleAdd = async () => {
    if (!selectedProduct?.id) {
      return;
    }
    setIsAdding(true);
    onClickCreateQuoteForCustomer();
    setIsAdding(false);
  };

  useEffect(() => {
    if (selectedProduct?.id && !isAdding) {
      handleAdd();
    }
  }, [selectedProduct]);

  const handleInlineProductChange = (e) => {
    handleProductChange(e);
  };

  const handleCancel = () => {
    onCancel();
  };

  if (isInlineRowCollapsed) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          padding: "4px 8px",
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={handleShowInlineAddRow}
          style={{
            color: primarySecondaryBlend(300),
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "14px",
          }}
        >
          <span style={{ marginRight: "8px" }}>+</span>
          {t("sales.quote.addNewItem")}
        </IconButton>
      </div>
    );
  }

  return (
    <TableRow style={{ backgroundColor: "#f8f9fa" }}>
      <TableCell
        style={{ width: columnWidths[0], ...classes.cellContainerStyle }}
      >
        {rowNumber}
      </TableCell>

      {!CheckPreferenceValue(
        EPreferences.HIDE_ITEM_CODE_FROM_DOCUMENT_CART
      ) && (
        <TableCell
          style={{ width: columnWidths[1], ...classes.cellContainerStyle }}
        >
          {/* Item code - will be filled after selection */}
        </TableCell>
      )}

      <TableCell
        style={{
          width: columnWidths[2],
          ...classes.cellContainerStyle,
          padding: " 8px 4px",
        }}
      >
        <div style={{ minWidth: "400px" }}>
          <GoMakeTreeSelect
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            value={selectedProduct?.id || null}
            options={combinedData}
            onChange={handleInlineProductChange}
            placeholder={t("home.admin.selectProductOrMaterial")}
          />
        </div>
      </TableCell>

      <TableCell
        style={{ width: columnWidths[3], ...classes.cellContainerStyle }}
      >
        {/* Details - will be filled after selection */}
      </TableCell>

      <TableCell
        style={{ width: columnWidths[4], ...classes.cellContainerStyle }}
      >
        {/* Amount - will be filled after selection */}
      </TableCell>

      <TableCell
        style={{ width: columnWidths[5], ...classes.cellContainerStyle }}
      >
        {/* Unit price - will be filled after selection */}
      </TableCell>

      <TableCell
        style={{ width: columnWidths[6], ...classes.cellContainerStyle }}
      >
        {/* Discount - will be filled after selection */}
      </TableCell>

      <TableCell
        style={{ width: columnWidths[7], ...classes.cellContainerStyle }}
      >
        {/* Final price - will be filled after selection */}
      </TableCell>

      <TableCell
        style={{ width: columnWidths[8], ...classes.cellContainerStyle }}
      >
        {documentItems && documentItems.length > 0 && (
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "center" }}
          >
            <Tooltip title={t("materials.buttons.cancel")}>
              <IconButton
                size="small"
                onClick={handleCancel}
                disabled={isAdding}
              >
                <DeleteIcon height={20} width={20} />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export { InlineAddItemRow };
