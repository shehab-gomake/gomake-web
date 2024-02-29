import { PrimaryTableCell } from "@/components/tables/primary-table";
import { TableRow } from "@mui/material";
import { useStyle } from "../style";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";



const RowCell = ({ text }) => {
    const { classes } = useStyle();
    return (
        <PrimaryTableCell
            style={classes.cellContainerStyle}>
            {text}
        </PrimaryTableCell>
    );
};

const RowMappingWidget = ({
    item,
    index,
}) => {
    return (
        <TableRow
            key={item.id}
            style={{ background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB" }}>
            <RowCell text={"test"} />
            <RowCell text={"test"} />
            <RowCell text={"test"} />
            <RowCell text={item.cashAmount} />
        </TableRow>
    );
};
export { RowMappingWidget };