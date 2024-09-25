import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableBody } from '@mui/material';
import { PrimaryTableCell } from "@/components/tables/primary-table";
import { useStyle } from './style';
import { useDateFormat } from '@/hooks/use-date-format';
import { useTranslation } from 'react-i18next';

interface CustomTableProps {
  headers: string[];
  rows: Array<Record<string, any>>; 
  columnWidths: string[];
}

const CustomMethodsTable: React.FC<CustomTableProps> = ({ headers, rows , columnWidths }) => {
  const { classes } = useStyle();
  const { GetDateFormat } = useDateFormat();
  const { t } = useTranslation();

  return (
      <TableContainer style={classes.receiptMethodsTable}>
        <Table stickyHeader={true}>
          <TableHead>
          <TableRow style={{...classes.tableRowStyle   }}>
              {headers.map((header, index) => (
                <PrimaryTableCell
                  key={index}
                  style={{ ...classes.tableHeaderStyle ,width: columnWidths[index] }}>
                  {t(`payment.${header}`)}
                </PrimaryTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
            {rows?.length > 0 &&
              rows?.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, index) => (
                    <PrimaryTableCell
                      key={index}
                      style={classes.cellContainerStyle}>
                      {header.includes('Date') ? GetDateFormat(row[header]) : row[header]}
                    </PrimaryTableCell>
                  ))}
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
  );
};

export default CustomMethodsTable;
