import { PrimaryTableCell } from "@/components/tables/primary-table";
import { TableRow } from "@mui/material";
import { useStyle } from "../style";

const RowCell = ({ text }) => {
    const { classes } = useStyle();
    return (
        <PrimaryTableCell
            style={classes.cellContainerStyle}>
            {text}
        </PrimaryTableCell>
    );
};

// const RowMappingWidget = ({
//     item,
//     index,
// }) => {
//     return (
//         <TableRow
//             key={item.id}
//             style={{ background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB" }}>
//             <RowCell text={item.cashAmount} />
//             <RowCell text={item.cashAmount} />
//             <RowCell text={item.cashAmount} />
//             <RowCell text={item.cashAmount} />
//         </TableRow>
//     );
// };
// export { RowMappingWidget };

const RowMappingWidget = ({ cells, index }) => {
    return (
        <TableRow key={index} style={{ background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB" }}>
            {cells.map((cell, cellIndex) => (
                <RowCell key={cellIndex} text={cell} />
            ))}
        </TableRow>
    );
};

export { RowMappingWidget };