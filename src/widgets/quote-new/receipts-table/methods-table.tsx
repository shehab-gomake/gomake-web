import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableBody } from '@mui/material';
import { PrimaryTableCell } from "@/components/tables/primary-table";
import { useStyle } from './style';
import { FONT_FAMILY } from '@/utils/font-family';
import { useDateFormat } from '@/hooks/use-date-format';
import { useTranslation } from 'react-i18next';

interface CustomTableProps {
  title: string;
  headers: string[];
  rows: Array<Record<string, any>>; 
  columnWidths: string[];
}

const CustomMethodsTable: React.FC<CustomTableProps> = ({ title, headers, rows , columnWidths }) => {
  const { classes } = useStyle({ headerHeight: "44px" });
  const { GetDateFormat } = useDateFormat();
  const { t } = useTranslation();

  return (
    <div style={classes.receiptMethodsTable}>
      <span style={{fontWeight:450}}>{title}</span>
      <TableContainer style={{ maxHeight: 420, overflow: "scroll", border: "1px solid #EAECF0" }}>
        <Table stickyHeader={true}>
          <TableHead>
          <TableRow style={{...classes.tableRowStyle   }}>
          {/* <TableRow style={{...classes.tableRowStyle , background:"#f5f5f5",  }}> */}
              {headers.map((header, index) => (
                <PrimaryTableCell
                  key={index}
                  style={{ ...classes.tableHeaderStyle ,width: columnWidths[index] }}>
                  {/* style={{ 
                      borderRight: "1px solid #EAECF0",
                      color: "black",
                      textAlign: "center" as "center",
                      ...FONT_FAMILY.Inter(400, 12),
                   }}> */}
                  {t(`payment.${header}`)}
                </PrimaryTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{ border: "1px solid #EAECF0" }}>
            {rows?.length > 0 ? (
              rows?.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, index) => (
                    <PrimaryTableCell
                      key={index}
                      style={{
                        ...FONT_FAMILY.Inter(600, 14),
                        color: "#5859A8",
                        ...classes.cellContainerStyle,
                      }}>
                      {header.includes('Date') ? GetDateFormat(row[header]) : row[header]}
                    </PrimaryTableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <PrimaryTableCell colSpan={headers.length}>
                  No data available
                </PrimaryTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CustomMethodsTable;
