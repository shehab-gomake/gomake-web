import { styled } from "@mui/material/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { ITableProps } from "@/components/tables/interface";
import { useStyle } from "@/components/tables/style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PrimaryCheckbox } from "../check-box/primary-check-box";

const PrimaryTableCell = styled(TableCell)(() => {
  const { primaryColor } = useGomakeTheme();
  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: primaryColor(50),
      color: primaryColor(900),
      ...FONT_FAMILY.Lexend(500, 14),
      padding: "5px 5px",
      height: 47,
    },
    [`&.${tableCellClasses.body}`]: {
      ...FONT_FAMILY.Lexend(500, 14),
      color: primaryColor(500),
      padding: "3px 0",
      height: 47,
    },
  };
});

const PrimaryTableRow = styled(TableRow)(() => {
  return {
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  };
});

const OddEvenTableRow = styled(TableRow)(() => {
  return {
    "&:nth-of-type(even)": {
      backgroundColor: `#ececec8a !important`,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  };
});

const ClassicTableCell = styled(TableCell)(() => {
  return {
    [`&.${tableCellClasses.head}`]: {
      color: "#B5B7C0",
      ...FONT_FAMILY.Lexend(500, 14),
      padding: "5px 5px",
    },
    [`&.${tableCellClasses.body}`]: {
      ...FONT_FAMILY.Lexend(500, 14),
      color: "#292D32",
      padding: "3px 0",
    },
  };
});

const ClassicTableRow = styled(TableRow)(() => {
  return {
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    "&:first-child td, &:first-child th": {
      borderBottom: "1px solid #e0e0e0",
    },
  };
});

const RoundTableCell = styled(TableCell)(() => {
  return {
    [`&.${tableCellClasses.head}`]: {
      ...FONT_FAMILY.Lexend(500, 13),
      backgroundColor: "#F9FAFB",
      borderBottom: "1px solid #EAECF0 !important",
      color: "#475467",
      padding: "5px 5px",
      height: "40px !important",
    },
    [`&.${tableCellClasses.body}`]: {
      color: "#292D32",
      // padding: "3px 0",
      padding: "5px 5px",

      height: 47,
      ...FONT_FAMILY.Lexend(400, 14),
    },
  };
});

const RoundTableRow = styled(TableRow)(() => {
  return {
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  };
});

const StyledTableContainer = styled(TableContainer)(() => ({
  // Enable horizontal scrolling
  overflowX: "auto",

  "&::-webkit-scrollbar": {
    width: "10px",
    height: "10px", // For horizontal scrollbar height
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#CCCDCF",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    cursor: "pointer",
  },
}));

// const PrimaryTable = ({
//   rows,
//   headers,
//   stickyHeader,
//   stickyFirstCol,
//   maxHeight,
//   variant,
//   withoutShadow,
//   columnWidths,
//   dataTour,
//   isLastItemTotal = false,
//   onSelectionChange,
//   enableCheckboxes = false,
// }: ITableProps) => {
//   const { t } = useTranslation();
//   const dir: "rtl" | "ltr" = t("direction");
//   const { classes } = useStyle(maxHeight, dir);

//   const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set()); // Using a Set to keep track of selected rows
//   const handleRowSelection = (rowIndex: number) => {
//     setSelectedRows((prevSelectedRows) => {
//       const newSelectedRows = new Set(prevSelectedRows);
//       if (newSelectedRows.has(rowIndex)) {
//         newSelectedRows.delete(rowIndex);
//       } else {
//         newSelectedRows.add(rowIndex);
//       }

//       onSelectionChange?.(newSelectedRows); // Trigger the callback
//       return newSelectedRows;
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectedRows?.size === rows?.length) {
//       setSelectedRows(new Set()); // Deselect all
//       onSelectionChange?.(new Set());
//     } else {
//       const allSelected = new Set<number>();
//       rows.forEach((_, index) => allSelected.add(index));
//       setSelectedRows(allSelected);
//       onSelectionChange?.(allSelected); // Trigger the callback
//     }
//   };

//   const TableCell =
//     variant === "ClassicTable"
//       ? ClassicTableCell
//       : variant === "RoundTable"
//       ? RoundTableCell
//       : PrimaryTableCell;

//   const TableRow =
//     variant === "ClassicTable"
//       ? ClassicTableRow
//       : variant === "OddEvenTable"
//       ? OddEvenTableRow
//       : variant === "RoundTable"
//       ? RoundTableRow
//       : PrimaryTableRow;

//   return (
//     <Paper
//       sx={{
//         width: "100%",
//         overflow: "hidden",
//         boxShadow: withoutShadow && "none",
//         height: "100%",
//         ...(variant === "RoundTable" && {
//           borderRadius: "12px",
//           border: "1px solid #EAECF0 !important",
//         }),
//       }}
//     >
//       <StyledTableContainer style={classes.tableContainer}>
//         <Table data-tour={dataTour} stickyHeader={stickyHeader}>
//           <TableHead>
//             <TableRow>
//               {/* Header Checkbox */}
//               {enableCheckboxes && (
//                 <TableCell padding="checkbox">
//                   <PrimaryCheckbox
//                     checked={selectedRows?.size === rows?.length}
//                     onChange={handleSelectAll}
//                     inputProps={{ "aria-label": "select all" }}
//                   />
//                 </TableCell>
//               )}
//               {headers?.map((header, index) => (
//                 <TableCell key={index} align="center">
//                   {header}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows?.map((row, index) => (
//               <TableRow
//                 key={`row_${index}`}
//                 style={{
//                   backgroundColor:
//                     isLastItemTotal && index === rows.length - 1
//                       ? "#EFDDFF"
//                       : "inherit",
//                 }}
//               >
//                 {/* Row Checkbox */}
//                 {enableCheckboxes && (
//                   <TableCell padding="checkbox">
//                     <PrimaryCheckbox
//                       checked={selectedRows?.has(index)}
//                       onChange={() => handleRowSelection(index)}
//                       inputProps={{ "aria-label": `select row ${index}` }}
//                     />
//                   </TableCell>
//                 )}
//                 {row.map((cell, cellIndex) => {
//                   const cellStyle = columnWidths
//                     ? {
//                         width: columnWidths?.[cellIndex],
//                       }
//                     : {};
//                   return (
//                     <TableCell align="center" style={cellStyle} key={cellIndex}>
//                       {cell}
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </StyledTableContainer>
//     </Paper>
//   );
// };

const PrimaryTable = ({
  rows,
  headers,
  stickyHeader,
  stickyFirstCol,
  maxHeight,
  variant,
  withoutShadow,
  columnWidths,
  dataTour,
  isLastItemTotal = false,

  enableCheckboxes = false,
  onSelectionChange,
  rowCheckboxCondition = () => true,
}: ITableProps) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleRowSelection = (rowIndex: number) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(rowIndex)) {
        newSelectedRows.delete(rowIndex);
      } else {
        newSelectedRows.add(rowIndex);
      }
      // Trigger the onSelectionChange callback
      onSelectionChange?.(newSelectedRows);
      return newSelectedRows;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows?.size === rows?.filter(rowCheckboxCondition).length) {
      setSelectedRows(new Set());
      onSelectionChange?.(new Set());
    } else {
      const allSelected = new Set<number>();
      rows.forEach((_, index) => {
        if (rowCheckboxCondition(rows[index])) allSelected.add(index);
      });
      setSelectedRows(allSelected);
      onSelectionChange?.(allSelected);
    }
  };

  const TableCell =
    variant === "ClassicTable"
      ? ClassicTableCell
      : variant === "RoundTable"
      ? RoundTableCell
      : PrimaryTableCell;

  const TableRow =
    variant === "ClassicTable"
      ? ClassicTableRow
      : variant === "OddEvenTable"
      ? OddEvenTableRow
      : variant === "RoundTable"
      ? RoundTableRow
      : PrimaryTableRow;

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        boxShadow: withoutShadow && "none",
        height: "100%",
        ...(variant === "RoundTable" && {
          borderRadius: "12px",
          border: "1px solid #EAECF0 !important",
        }),
      }}
    >
      <StyledTableContainer style={classes.tableContainer}>
        <Table data-tour={dataTour} stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {/* Header Checkbox */}
              {enableCheckboxes && (
                <TableCell padding="checkbox">
                  <PrimaryCheckbox
                    checked={
                      selectedRows?.size ===
                      rows?.filter(rowCheckboxCondition).length
                    }
                    onChange={handleSelectAll}
                    inputProps={{ "aria-label": "select all" }}
                  />
                </TableCell>
              )}
              {headers?.map((header, index) => (
                <TableCell key={index} align="center">
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => (
              <TableRow
                key={`row_${index}`}
                style={{
                  backgroundColor:
                    isLastItemTotal && index === rows.length - 1
                      ? "#EFDDFF"
                      : "inherit",
                }}
              >
                {/* Row Checkbox */}
                {/* {enableCheckboxes && rowCheckboxCondition(row) && (
                  <TableCell padding="checkbox">
                    <PrimaryCheckbox
                      checked={selectedRows.has(index)}
                      onChange={() => handleRowSelection(index)}
                      inputProps={{ "aria-label": `select row ${index}` }}
                    />
                  </TableCell>
                )} */}
                {enableCheckboxes && (
                  <TableCell padding="checkbox">
                    {rowCheckboxCondition(row) ? (
                      <PrimaryCheckbox
                        checked={selectedRows.has(index)}
                        onChange={() => handleRowSelection(index)}
                        inputProps={{ "aria-label": `select row ${index}` }}
                      />
                    ) : null}
                  </TableCell>
                )}
                {row.map((cell, cellIndex) => {
                  const cellStyle = columnWidths
                    ? {
                        width: columnWidths?.[cellIndex],
                      }
                    : {};
                  return (
                    <TableCell align="center" style={cellStyle} key={cellIndex}>
                      {cell}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
};

export { TableCell, TableRow, PrimaryTable, PrimaryTableCell, PrimaryTableRow };
