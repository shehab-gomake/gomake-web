import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Checkbox, TableRow } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { useQuoteConfirmation } from "@/pages-components/quote-confirmation/use-quote-confirmation";
import { ERPDocumentsTypesEnum } from "@/enums/document-type-enum";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "@/hooks/use-date-format";

const DebtRowMappingWidget = ({ item, index, headerHeight, parentIndex }) => {
  const { t } = useTranslation();
  const { classes } = useStyle({ headerHeight });
  const { formatISODateTime } = useDateFormat();
  const columnWidths = ["10%", "22%"];
  const { handleItemCheck } = useQuoteConfirmation();

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
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            checked={item?.isChecked}
            onChange={(checked) => handleItemCheck(checked, item.id)}
          />
          {parentIndex}
        </div>
      </PrimaryTableCell>

      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: "#5859A8",
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
        {item?.docNum}
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
