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
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const OrderTableWidget = ({
  PrimaryTableCell,
  columnWidths,
  tableHeaders,
  documentItems,
  handleItemSelect,
  handleSelectAll,
  areAllItemsSelected,
  selectedItems,
  filterItems,
  handleSelectAllDocuments
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  const filteredDocumentItems = useMemo(() => {
    return documentItems
      ?.map((documentItem) => {
        const filteredItems = filterItems(
          documentItem?.isReady,
          documentItem.orderItems
        );
        return { ...documentItem, filteredItems };
      })
      .filter((item) => item.filteredItems?.length > 0);
  }, [documentItems, filterItems]);
  const checkIfAllDocumentsSelected = ()=>{
    if(!filteredDocumentItems || !filteredDocumentItems.length){
      return false;
    }
    for(let document of filteredDocumentItems){
      if(!areAllItemsSelected(document.id))
        return false;
    }
    return true;
  }
  return (
      <>
        <div style={classes.selectAllDocumentsContainer}>
          <Checkbox
              checked={checkIfAllDocumentsSelected()}
              onChange={() => handleSelectAllDocuments(filteredDocumentItems)}
              icon={<CheckboxIcon/>}
              checkedIcon={<CheckboxCheckedIcon/>}
          />
          <div style={classes.selectAllStyle}>
            {t("deposits.selectAllDocuments")}
          </div>
        </div>
        {filteredDocumentItems?.map((documentItem) => (
            <div key={documentItem.id}>
              <div style={classes.dateSelectAllContainer}>
                <div style={classes.dateStyle}>
                  {documentItem?.number} - {documentItem?.date?.split("T")[0]}
                </div>
                <div style={classes.selectAllContainer}>
                  <Checkbox
                      checked={areAllItemsSelected(documentItem.id)}
                      onChange={() => handleSelectAll(documentItem)}
                      icon={<CheckboxIcon/>}
                      checkedIcon={<CheckboxCheckedIcon/>}
                  />
                  <div style={classes.selectAllStyle}>
                    {t("deposits.selectAll")}
                  </div>
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
                  <TableBody style={{border: "1px solid #EAECF0"}}>
                    {documentItem.filteredItems?.map((item, index) => {
                      const parentIndex = index + 1;
                      return (
                          <RowMappingWidget
                              key={item.id}
                              item={item}
                              index={index}
                              parentIndex={parentIndex}
                              columnWidths={columnWidths}
                              handleItemSelect={handleItemSelect}
                              isSelected={selectedItems.some(
                                  (selectedItem) => selectedItem.id === item.id
                              )}
                          />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
        ))}
      </>
  );
};

export {OrderTableWidget};
