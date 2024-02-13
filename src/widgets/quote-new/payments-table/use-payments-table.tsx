import { useTranslation } from "react-i18next";
import {TableCell,styled,tableCellClasses} from "@mui/material";
import { useState } from "react";

const usePaymentsTable = () => {
    const { t } = useTranslation();
    const [totalSum, setTotalSum] = useState(0);
    const [checkedItems, setCheckedItems] = useState({});
    const columnWidths = ["5%", "19%", "19%", "19%", "19%", "19%"];

    const tableHeaders = [
        "#",
        t("payment.documentDate"),
        t("payment.documentNumber"),
        t("payment.documentType"),
        t("payment.detail"),
        t("payment.sum"),

    ];

    const tableRows =
        [
            {
                "documentDate": "01/02/2024",
                "documentNumber": "1",
                "documentType": 50,
                "detail": 364.96,
                "sum": 100
            },
            {
                "documentDate": "02/02/2024",
                "documentNumber": "2",
                "documentType": 50,
                "detail": 364.96,
                "sum": 200,

            },
            {
                "documentDate": "03/02/2024",
                "documentNumber": "3",
                "documentType": 50,
                "detail": 364.96,
                "sum": 300,
            }
        ]
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




    

      const handleCheckboxChange = (index) => {
        setCheckedItems((prevCheckedItems) => {
          const updatedCheckedItems = {
            ...prevCheckedItems,
            [index]: !prevCheckedItems[index],
          };
      
          let sum = 0;
          tableRows.forEach((item, index) => {
            if (updatedCheckedItems[index]) {
              sum += item.sum;
            }
          });
      
          setTotalSum(sum);
          return updatedCheckedItems;
        });
      };

    
    
    return {
        
        columnWidths,
        tableHeaders,
        tableRows,
        PrimaryTableCell,
        totalSum,
        checkedItems, 
        handleCheckboxChange,
    };
};

export { usePaymentsTable };
