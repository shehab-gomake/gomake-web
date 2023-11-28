import { PrimaryTableCell } from "@/components/tables/primary-table";
import { TableRow } from "@mui/material";
import { useStyle } from "./style";

const RowMappingWidget = ({ item, index }) => {
  const { clasess } = useStyle();
  console.log("item", item);
  return (
    <TableRow
      key={item.id}
      // style={{
      //   background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB",
      // }}
    >
      <PrimaryTableCell style={clasess.cellContainerStyle}>
        {item?.value}
      </PrimaryTableCell>
      <PrimaryTableCell style={clasess.cellContainerStyle}>
        {item?.value === 0
          ? 0
          : ((item?.totalPrice - item?.value) / item?.value) * 100}{" "}
        %
      </PrimaryTableCell>
      <PrimaryTableCell style={clasess.cellContainerStyle}>
        {item?.totalPrice}
      </PrimaryTableCell>

      <PrimaryTableCell
        style={{
          ...clasess.cellContainerStyle,
          color: "#8283BE",
          cursor: "pointer",
        }}
      >
        Edit
      </PrimaryTableCell>
    </TableRow>
  );
};
export { RowMappingWidget };
