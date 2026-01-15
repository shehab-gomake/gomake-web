import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Button, Checkbox, TableRow } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { useQuoteConfirmation } from "@/pages-components/quote-confirmation/use-quote-confirmation";
import { ERPDocumentsTypesEnum } from "@/enums/document-type-enum";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "@/hooks/use-date-format";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const DebtRowMappingWidget = ({ item, index, headerHeight, parentIndex }) => {
  const { t } = useTranslation();
  const { classes } = useStyle({ headerHeight });
  const { formatISODateTime } = useDateFormat();
  const { primarySecondaryBlend } = useGomakeTheme();
  const columnWidths = ["10%", "22%"];
  const { getDocumentPdfByNumber, handleDebtItemCheck, quoteConfirm } =
    useQuoteConfirmation();

  return (
    <TableRow
      key={item.id}
      style={{
        background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB",
      }}
    >
      <PrimaryTableCell
        style={{
          width: columnWidths[0],
          ...classes.cellContainerStyle,
          borderBottom: item?.childsDocumentItems && "none",
        }}
      >
        <div style={classes.checkBoxContainer}>
          {quoteConfirm?.isCanSelectRows && (
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              checked={item?.isChecked}
              onChange={(checked) => handleDebtItemCheck(checked, item.transId)}
            />
          )}
          {parentIndex}
        </div>
      </PrimaryTableCell>

      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: primarySecondaryBlend(400),
        }}
      >
        {item?.docDate ? formatISODateTime(item?.docDate).split(" ")[0] : "-"}
      </PrimaryTableCell>

      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: "#000",
        }}
      >
        <Button
          onClick={() => getDocumentPdfByNumber(item?.docNum, item?.type)}
          variant="text"
          sx={{
            ...classes.documentNum,
            color: primarySecondaryBlend(300),
            textDecoration: "underline",
            textDecorationColor: primarySecondaryBlend(300),
            "&:hover": {
              textDecoration: "underline",
              backgroundColor: "rgba(88, 89, 168, 0.08)",
              textDecorationColor: primarySecondaryBlend(300),
            },
          }}
        >
          {item?.docNum}
        </Button>
      </PrimaryTableCell>

      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: "#000",
        }}
      >
        {t(`ERPDocumentsType.${ERPDocumentsTypesEnum[item?.type]}`)}
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: "#000",
        }}
      >
        {item?.price}
      </PrimaryTableCell>
    </TableRow>
  );
};
export { DebtRowMappingWidget };
