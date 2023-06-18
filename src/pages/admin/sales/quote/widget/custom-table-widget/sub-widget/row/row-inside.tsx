import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";

const RowInside = ({
  index,
  tablePercent,
  clasess,
  entry,
  isCheckbox = true,
}: any) => {
  const { secondColor, primaryColor } = useGomakeTheme();
  return (
    <div
      key={`row_table_${index}`}
      style={{ ...clasess.rowItem, width: `${tablePercent[index]}` }}
    >
      {entry[0] === "id" && isCheckbox ? (
        <div key={`row_table_${index}`} style={clasess.rowItem}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
          />
          {entry[1]}
        </div>
      ) : entry[0] === "details" ? (
        <>
          <div key={`row_table_${index}`} style={clasess.rowItem}>
            {entry[1]}
          </div>
          <div style={clasess.detailsLine} />
        </>
      ) : (
        <div key={`row_table_${index}`} style={clasess.rowItem}>
          {entry[1]}
        </div>
      )}
    </div>
  );
};

export { RowInside };
