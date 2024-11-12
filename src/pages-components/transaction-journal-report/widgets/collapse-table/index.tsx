// CollapsibleTable.tsx

import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";

interface CollapsibleTableProps {
  rows: any[];
  headers: string[];
  style?: React.CSSProperties; // Allow custom styles to be passed as a prop
}

function CollapsibleTable({ rows, headers, style }: CollapsibleTableProps) {
  const Row = (props: { row: any }) => {
    const { row } = props;
    const { t } = useTranslation();

    return (
      <React.Fragment>
        {/* main row */}
        <TableRow
          sx={{ "& > *": { borderBottom: "unset" }, background: "#ebecff" }}
        >
          {headers.map((key, index) => {
            if (key !== "history") {
              if (index === 2)
                return (
                  <TableCell key={index} align="left">
                    {row[key]}
                  </TableCell>
                );
              else
                return (
                  <TableCell key={index} align="left">
                    <strong>{t(`reports.${key}`)} : </strong> {row[key]}
                  </TableCell>
                );
            }
            return null;
          })}
        </TableRow>
        {/* sub rows */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={true} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {row.history.length > 0 &&
                        Object.keys(row.history[0]).map((key) => (
                          <TableCell key={key}>{t(`reports.${key}`)}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        {Object.keys(historyRow).map((key) => (
                          <TableCell key={key} align={"left"}>
                            {historyRow[key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "500px",
        overflowY: "auto",
        ...style,
      }}
    >
      <Table aria-label="collapsible table">
        {/* <TableHead>
          <TableRow>
            <TableCell />
            {headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead> */}
        <TableBody>
          {rows.map((row, index) => (
            <Row key={index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CollapsibleTable;
