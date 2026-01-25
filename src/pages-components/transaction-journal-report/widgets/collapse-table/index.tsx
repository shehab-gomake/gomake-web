import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";
import React from "react";

interface CollapsibleTableProps {
  rows: any[];
  headers: string[];
  style?: React.CSSProperties;
}

function CollapsibleTable({ rows, headers, style }: CollapsibleTableProps) {
  const { t } = useTranslation();
  const isRtl = t("direction") === "rtl";

  const Row = (props: { row: any }) => {
    const { row } = props;

    return (
      <React.Fragment>
        {/* main row */}
        <TableRow
          sx={{
            "& > *": { borderBottom: "unset" },
            background: "var(--theme-secondary-50, #EBECFF)",
            textAlign: isRtl ? "right" : "left",
          }}
        >
          {headers.map((key, index) => {
            if (key !== "history") {
              if (index === 3)
                return (
                  <TableCell key={index} align={isRtl ? "left" : "right"}>
                    {row[key]}
                  </TableCell>
                );
              else
                return (
                  <TableCell key={index} align={isRtl ? "right" : "left"}>
                    <strong>{t(`reports.${key}`)} : </strong> {row[key]}
                  </TableCell>
                );
            }
            return null;
          })}
        </TableRow>
        {/* sub rows */}
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              textAlign: isRtl ? "right" : "left",
            }}
            colSpan={6}
          >
            <Collapse in={true} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {row.history.length > 0 &&
                        Object.keys(row.history[0]).map((key) => (
                          <TableCell
                            key={key}
                            align={"center"}
                            // align={isRtl ? "right" : "left"}
                          >
                            {t(`reports.${key}`)}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        {Object.keys(historyRow).map((key) => (
                          <TableCell
                            key={key}
                            align={"center"}
                            //align={isRtl ? "right" : "left"}
                          >
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
        direction: isRtl ? "rtl" : "ltr",
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
