import { List, ListItemButton, Menu, MenuItem, Box } from "@mui/material";
import { useState, useMemo } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { selectedDocumentTypeState } from "../states/selected-document-type";
import { useStyle } from "./style";
import { DocumentTypeEnums } from "@/enums/document-type-enum";

const FixedDocumentType = () => {
  const { classes } = useStyle();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedType, setSelectedType] = useRecoilState(
    selectedDocumentTypeState
  );
  const { t } = useTranslation();

  const open = Boolean(anchorEl);

  const documentConfig: Array<[string, DocumentTypeEnums]> = [
    ["sales.quote.quote", DocumentTypeEnums.Quote],
    ["sales.quote.order", DocumentTypeEnums.Order],
    ["sales.quote.deliveryNote", DocumentTypeEnums.DeliveryNote],
    ["sales.quote.invoice", DocumentTypeEnums.Invoice],
    ["sales.quote.receipt", DocumentTypeEnums.Receipt],
    ["sales.quote.deliveryNoteRefund", DocumentTypeEnums.DeliveryNoteRefund],
    ["sales.quote.invoiceRefund", DocumentTypeEnums.InvoiceRefund],
    ["sales.quote.generalLedgerReport", DocumentTypeEnums.GeneralLedgerReport],
    ["sales.quote.purchaseOrder", DocumentTypeEnums.PurchaseOrder],
    ["sales.quote.purchaseInvoice", DocumentTypeEnums.PurchaseInvoice],
    [
      "sales.quote.purchaseInvoiceRefund",
      DocumentTypeEnums.PurchaseInvoiceRefund,
    ],
    ["sales.quote.boardMission", DocumentTypeEnums.BoardMission],
  ];

  const DOCUMENT_OPTIONS = documentConfig.map(([label, value]) => ({
    label,
    value,
  }));

  // usage inside component
  const options = DOCUMENT_OPTIONS;

  const selectedLabel = useMemo(() => {
    const selected = options.find((opt) => opt.value === selectedType);
    return selected ? t(selected.label) : t("dashboard.documentType");
  }, [selectedType, options, t]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <div>
      <List component="nav">
        <ListItemButton style={classes.listItemButton} onClick={handleClick}>
          <Box sx={classes.boxStyle}>
            <span style={classes.buttonLabel}>{selectedLabel}</span>
          </Box>
          <KeyboardArrowDownIcon />
        </ListItemButton>
      </List>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            width: anchorEl?.offsetWidth,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={selectedType === option.value}
            onClick={() => {
              setSelectedType(option.value);
              setAnchorEl(null);
            }}
          >
            {t(option.label)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export { FixedDocumentType };
