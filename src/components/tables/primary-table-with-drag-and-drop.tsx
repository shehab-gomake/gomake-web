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
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FONT_FAMILY } from "@/utils/font-family";
import { ITableProps } from "@/components/tables/interface";
import { useStyle } from "@/components/tables/style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";
import SortIcon from "@mui/icons-material/Sort"; // Sort icon import

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
  const { neutralColor } = useGomakeTheme();
  return {
    "&:nth-of-type(even)": {
      backgroundColor: neutralColor(100),
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  };
});

const StyledTableContainer = styled(TableContainer)(() => ({
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    width: "10px",
    height: "10px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#CCCDCF",
    borderRadius: "10px",
  },
}));
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

const PrimaryTableWithDragAndDrop = ({
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
  onDragEnd, // Pass onDragEnd from parent to handle drag logic
}: ITableProps) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);
  const TableCell =
    variant === "ClassicTable" ? ClassicTableCell : PrimaryTableCell;
  const TableRow =
    variant === "ClassicTable" ? ClassicTableRow : PrimaryTableRow;

  // Helper function to get consistent styles while dragging
  const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
    // Maintain table layout while dragging
    width: "100%",
    display: isDragging && "flex",
    flexDirection: isDragging && "row",
    justifyContent: isDragging && "space-between",
    alignItems: isDragging && "center",
    backgroundColor: isDragging ? "#f4f4f4" : "inherit",
  });

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        boxShadow: withoutShadow && "none",
      }}
    >
      <StyledTableContainer style={classes.tableContainer}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Table
                ref={provided.innerRef}
                data-tour={dataTour}
                stickyHeader={stickyHeader}
                {...provided.droppableProps}
              >
                <TableHead>
                  <TableRow>
                    {headers?.map((header, index) => (
                      <TableCell
                        key={`header_${index}`}
                        align={index === 0 ? (dir === "rtl" ? "right" : "left") :
                          index === 1 ? (dir === "rtl" ? "right" : "left") : "center"}
                        style={index === 0 ? { width: columnWidths?.[0], maxWidth: columnWidths?.[0], minWidth: columnWidths?.[0], paddingLeft: "10px", paddingRight: "10px" } : {}}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row, index) => (
                    <Draggable
                      key={`row_${index}`}
                      draggableId={`row_${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {/* Add SortIcon as the drag handle */}
                          <TableCell
                            {...provided.dragHandleProps}
                            align={dir === "rtl" ? "right" : "left"}
                            style={{ width: "50px", maxWidth: "50px", minWidth: "50px", paddingLeft: "10px", paddingRight: "10px" }}
                          >
                            <SortIcon
                              style={{
                                cursor: "grab",
                                transform: dir === "rtl" ? "scaleX(-1)" : "none"
                              }}
                            />
                          </TableCell>
                          {row.map((cell, cellIndex) => {
                            const cellStyle = columnWidths
                              ? {
                                width: columnWidths?.[cellIndex + 1],
                                maxWidth: columnWidths?.[cellIndex + 1],
                                minWidth: columnWidths?.[cellIndex + 1],
                              }
                              : {};
                            return (
                              <TableCell
                                key={`cell_${cellIndex}`}
                                align={cellIndex === 0 ? (dir === "rtl" ? "right" : "left") : "center"}
                                style={cellStyle}
                              >
                                {cell}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </StyledTableContainer>
    </Paper>
  );
};

export { PrimaryTableWithDragAndDrop, PrimaryTableCell, PrimaryTableRow };
