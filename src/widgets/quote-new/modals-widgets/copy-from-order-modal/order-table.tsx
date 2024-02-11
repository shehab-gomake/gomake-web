import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { RowMappingWidget } from "./row-order-mapping";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
const OrderTableWidget = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const PrimaryTableCell = styled(TableCell)(() => {
    return {
      [`&.${tableCellClasses.head}`]: {
        padding: 0,
      },
      [`&.${tableCellClasses.body}`]: {
        padding: 0,
      },
    };
  });
  const columnWidths = ["5%", "8%", "20%", "33%", "8%", "8%", "8%"];
  const tableHeaders = [
    "#",
    t("sales.quote.itemCode"),
    t("products.profits.itemName"),
    t("products.profits.details"),
    t("sales.quote.amount"),
    t("sales.quote.discount"),
    t("products.profits.pricingListWidget.unitPrice"),
    t("products.offsetPrice.admin.finalPrice"),
  ];
  const documentItems =
    [
      {
        date: "5/6/2023",
        items: [
          {
            "id": "7e92ebdc-24ef-4c21-9d15-484cbf4bc0f3",
            "code": null,
            "documentID": "602f6336-74e2-4478-839e-baa89da6a494",
            "details": "Product Category\nJob Name: test2 | Types: 1 | Quantity: 100 | Quantity:  | Reorder: true\nSize & Shape\nShape: Rectangular | Width: 21 | Height: 29.7\nPrinting\nChanging Info: true | Both side Same print color: true | Printing Sides: One Side | Printing Quality: Standard | Printing Colors: Full Color | 4 Colors Cmyk\nMedia\nPaper type: Uncoted | Sheet Weight: 80\n",
            "price": 3.34,
            "workName": "Job Name : test2",
            "discount": 5,
            "finalPrice": 317.3,
            "quantity": 100,
            "minQuantity": null,
            "statusString": null,
            "productName": "Paper Product",
            "isSelected": true,
            "productType": 0,
            "productID": "406c0d25-3ab5-44bb-b652-621b0245d752",
            "clientTypeId": "89f00e94-8b22-4997-88bb-99af57cd2db0",
            "duplicatedFromDocumentItemId": null,
            "isDuplicatedWithAnotherQuantity": false,
            "childsDocumentItems": null,
            "graphicsTypes": null
          },
          {
            "id": "7e92ebdc-24ef-4c21-9d15-484cbf4bc0f3",
            "code": null,
            "documentID": "602f6336-74e2-4478-839e-baa89da6a494",
            "details": "Product Category\nJob Name: test2 | Types: 1 | Quantity: 100 | Quantity:  | Reorder: true\nSize & Shape\nShape: Rectangular | Width: 21 | Height: 29.7\nPrinting\nChanging Info: true | Both side Same print color: true | Printing Sides: One Side | Printing Quality: Standard | Printing Colors: Full Color | 4 Colors Cmyk\nMedia\nPaper type: Uncoted | Sheet Weight: 80\n",
            "price": 3.34,
            "workName": "Job Name : test2",
            "discount": 5,
            "finalPrice": 317.3,
            "quantity": 100,
            "minQuantity": null,
            "statusString": null,
            "productName": "Paper Product",
            "isSelected": true,
            "productType": 0,
            "productID": "406c0d25-3ab5-44bb-b652-621b0245d752",
            "clientTypeId": "89f00e94-8b22-4997-88bb-99af57cd2db0",
            "duplicatedFromDocumentItemId": null,
            "isDuplicatedWithAnotherQuantity": false,
            "childsDocumentItems": null,
            "graphicsTypes": null
          },
        ]
      },
      {
        date: "7/6/2023",
        items: [
          {
            "id": "7e92ebdc-24ef-4c21-9d15-484cbf4bc0f3",
            "code": null,
            "documentID": "602f6336-74e2-4478-839e-baa89da6a494",
            "details": "Product Category\nJob Name: test2 | Types: 1 | Quantity: 100 | Quantity:  | Reorder: true\nSize & Shape\nShape: Rectangular | Width: 21 | Height: 29.7\nPrinting\nChanging Info: true | Both side Same print color: true | Printing Sides: One Side | Printing Quality: Standard | Printing Colors: Full Color | 4 Colors Cmyk\nMedia\nPaper type: Uncoted | Sheet Weight: 80\n",
            "price": 3.34,
            "workName": "Job Name : test2",
            "discount": 5,
            "finalPrice": 317.3,
            "quantity": 100,
            "minQuantity": null,
            "statusString": null,
            "productName": "Paper Product",
            "isSelected": true,
            "productType": 0,
            "productID": "406c0d25-3ab5-44bb-b652-621b0245d752",
            "clientTypeId": "89f00e94-8b22-4997-88bb-99af57cd2db0",
            "duplicatedFromDocumentItemId": null,
            "isDuplicatedWithAnotherQuantity": false,
            "childsDocumentItems": null,
            "graphicsTypes": null
          },
          {
            "id": "7e92ebdc-24ef-4c21-9d15-484cbf4bc0f3",
            "code": null,
            "documentID": "602f6336-74e2-4478-839e-baa89da6a494",
            "details": "Product Category\nJob Name: test2 | Types: 1 | Quantity: 100 | Quantity:  | Reorder: true\nSize & Shape\nShape: Rectangular | Width: 21 | Height: 29.7\nPrinting\nChanging Info: true | Both side Same print color: true | Printing Sides: One Side | Printing Quality: Standard | Printing Colors: Full Color | 4 Colors Cmyk\nMedia\nPaper type: Uncoted | Sheet Weight: 80\n",
            "price": 3.34,
            "workName": "Job Name : test2",
            "discount": 5,
            "finalPrice": 317.3,
            "quantity": 100,
            "minQuantity": null,
            "statusString": null,
            "productName": "Paper Product",
            "isSelected": true,
            "productType": 0,
            "productID": "406c0d25-3ab5-44bb-b652-621b0245d752",
            "clientTypeId": "89f00e94-8b22-4997-88bb-99af57cd2db0",
            "duplicatedFromDocumentItemId": null,
            "isDuplicatedWithAnotherQuantity": false,
            "childsDocumentItems": null,
            "graphicsTypes": null
          },
          {
            "id": "7e92ebdc-24ef-4c21-9d15-484cbf4bc0f3",
            "code": null,
            "documentID": "602f6336-74e2-4478-839e-baa89da6a494",
            "details": "Product Category\nJob Name: test2 | Types: 1 | Quantity: 100 | Quantity:  | Reorder: true\nSize & Shape\nShape: Rectangular | Width: 21 | Height: 29.7\nPrinting\nChanging Info: true | Both side Same print color: true | Printing Sides: One Side | Printing Quality: Standard | Printing Colors: Full Color | 4 Colors Cmyk\nMedia\nPaper type: Uncoted | Sheet Weight: 80\n",
            "price": 3.34,
            "workName": "Job Name : test2",
            "discount": 5,
            "finalPrice": 317.3,
            "quantity": 100,
            "minQuantity": null,
            "statusString": null,
            "productName": "Paper Product",
            "isSelected": true,
            "productType": 0,
            "productID": "406c0d25-3ab5-44bb-b652-621b0245d752",
            "clientTypeId": "89f00e94-8b22-4997-88bb-99af57cd2db0",
            "duplicatedFromDocumentItemId": null,
            "isDuplicatedWithAnotherQuantity": false,
            "childsDocumentItems": null,
            "graphicsTypes": null
          },
        ]
      }
    ]

  return (
    <>
      {
        documentItems?.map((item, index) => {
          return (
            <div >
              <div style={classes.dateSelectAllContainer}>
                <div style={classes.dateStyle}>{item?.date}</div>
                <div style={classes.selectAllContainer}>
                  <Checkbox
                    // onChange={(e, checked) => handleSelectCheck(checked, option)}
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                  // checked={true}
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
                    {item?.items?.map((item: any, index: number) => {
                      const parentIndex = index + 1;
                      return (
                        <>
                          <RowMappingWidget
                            key={item.id}
                            item={item}
                            index={index}
                            parentIndex={parentIndex}
                            columnWidths={columnWidths}
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