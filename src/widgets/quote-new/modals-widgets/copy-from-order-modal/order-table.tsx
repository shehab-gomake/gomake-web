import { useStyle } from "./style";
import {
  Checkbox,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { RowMappingWidget } from "./row-order-mapping";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
const OrderTableWidget = ({
  PrimaryTableCell,
  columnWidths,
  tableHeaders,
  documentItems,
  handleItemSelect,
  handleSelectAll,
  areAllItemsSelected,
  selectedItems,
  filterItems
}) => {
  const { classes } = useStyle();

  return (
    <>
      {
        documentItems?.map((documentItem, index) => {
          const filteredItems = filterItems(documentItem.items);
          if (filteredItems?.length === 0) {
            // If no items, don't render the header and return null
            return null;
          }
          return (
            <div >
              <div style={classes.dateSelectAllContainer}>
                <div style={classes.dateStyle}>{documentItem?.date?.split("T")[0]}</div>
                <div style={classes.selectAllContainer}>
                  <Checkbox
                    checked={areAllItemsSelected(documentItem.id)}
                    onChange={() => handleSelectAll(documentItem)}
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                  />
                  <div style={classes.selectAllStyle}>Select all</div>
                </div>
              </div>
              <TableContainer
                style={{
                  maxHeight: 420,
                  overflow: "scroll",
                  border: "1px solid #EAECF0",
                }}
              >
                <Table stickyHeader={true}>
                  <TableHead>
                    <TableRow style={classes.tableRowStyle}>
                      {tableHeaders.map((header, index) => (
                        <PrimaryTableCell
                          key={index}
                          style={{
                            width: columnWidths[index],
                            ...classes.tableHeaderStyle,
                          }}
                        >
                          {header}
                        </PrimaryTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ border: "1px solid #EAECF0" }}>
                    {filterItems(documentItem?.orderItems)?.map((item: any, index: number) => {
                      const parentIndex = index + 1;
                      return (
                        <>
                          <RowMappingWidget
                            key={item.id}
                            item={item}
                            index={index}
                            parentIndex={parentIndex}
                            columnWidths={columnWidths}
                            handleItemSelect={handleItemSelect}
                            isSelected={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                          />
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )

        })
      }

    </>
  );
};
export { OrderTableWidget };