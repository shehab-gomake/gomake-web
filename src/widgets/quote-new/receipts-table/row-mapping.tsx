import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Checkbox, TableRow } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useDateFormat } from "@/hooks/use-date-format";
import { ERPDocumentsTypesEnum } from "@/enums";
import { fmt2 } from "@/utils/helpers";

const RowMappingWidget = ({
  item,
  index,
  columnWidths,
  headerHeight,
  onCheckboxChange,
  isChecked,
  allocatedSum,
  setAllocatedSum,
}) => {
  const { classes } = useStyle({ headerHeight });
  const { t } = useTranslation();
  const router = useRouter();

  const handleAllocatedSumChange = (event) => {
    const newAllocatedSum = event.target.value;
    const minValue = Math.min(0, item?.sumApplied);
    const maxValue = item?.sumApplied > 0 ? item?.sumApplied : 0;
    if (
      isNaN(newAllocatedSum) ||
      newAllocatedSum < minValue ||
      newAllocatedSum > maxValue
    ) {
      return;
    }
    setAllocatedSum(index, Number(newAllocatedSum));
  };

  const { formatISODateTime } = useDateFormat();

  return (
    <TableRow
      key={item.id}
      style={{ background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB" }}
    >
      {router?.query?.isNewCreation && (
        <PrimaryTableCell
          style={{ width: columnWidths[0], ...classes.cellContainerStyle }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              checked={isChecked}
              onChange={onCheckboxChange}
            />
          </div>
        </PrimaryTableCell>
      )}
      <PrimaryTableCell
        style={{
          width: columnWidths[1],
          ...classes.cellContainerStyle,
          color: "#000000",
        }}
      >
        {formatISODateTime(item?.docDate).split(" ")[0]}
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[2],
          ...classes.cellContainerStyle,
          color: "#000000",
        }}
      >
        {item?.dueDate ? formatISODateTime(item?.dueDate).split(" ")[0] : "-"}
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[3],
          ...FONT_FAMILY.Inter(600, 14),
          color: "#5859A8",
          ...classes.cellContainerStyle,
        }}
      >
        {item.invoiceID ? (
          <a
            href={`/invoice?Id=${item.invoiceID}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#5859A8",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {item.docNum}
          </a>
        ) : (
          item.docNum
        )}
      </PrimaryTableCell>

      <PrimaryTableCell
        style={{
          width: columnWidths[4],
          ...classes.cellContainerStyle,
        }}
      >
        {t(`ERPDocumentsType.${ERPDocumentsTypesEnum[item?.documentType]}`)}
      </PrimaryTableCell>
      <PrimaryTableCell
        style={{
          width: columnWidths[5],
          ...classes.cellContainerStyle,
        }}
      >
        {t(item?.details ?? "")}
      </PrimaryTableCell>

      {!router?.query?.isNewCreation ? (
        <PrimaryTableCell
          style={{
            width: columnWidths[5],
            ...classes.cellContainerStyle,
          }}
        >
          {/* {item?.sumApplied} */}
          {fmt2(item?.sumApplied)}
        </PrimaryTableCell>
      ) : (
        <PrimaryTableCell
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            ...classes.cellContainerStyle,
            padding: "0px 50px",
            gap: "3px",
          }}
        >
          <input
            key={`allocates-${index}`}
            value={fmt2(allocatedSum)}
            onChange={handleAllocatedSumChange}
            style={{ width: "80px", textAlign: "center" }}
            type="number"
            min={Math.min(0, item?.sumApplied)}
            max={item?.sumApplied > 0 ? item?.sumApplied : 0}
          />
          / {fmt2(item?.sumApplied)}
        </PrimaryTableCell>
      )}
    </TableRow>
  );
};
export { RowMappingWidget };
