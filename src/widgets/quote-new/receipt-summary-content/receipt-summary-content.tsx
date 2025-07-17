import { FC } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { ERPDocumentsTypesEnum } from "@/enums/document-type-enum";
import { useReceiptSummaryContent } from "./use-receipt-summary-content";

export interface ReceiptItem {
  id: string;
  docDate: string;
  docNum: string;
  documentType: string;
  sumApplied: number;
}

interface ReceiptSummaryContentProps {
  items: ReceiptItem[];
  totalPayment: number;
}

export const ReceiptSummaryContent: FC<ReceiptSummaryContentProps> = ({
  items,
  totalPayment,
}) => {
  const {
    t,
    tableHeaders,
    currencySymbol,
    isRTL,
    totalAgreement,
    remainingToPay,
    formatISODateTime,
  } = useReceiptSummaryContent(items, totalPayment);

  return (
    <Box p={2}>
      <TableContainer component={Paper} variant="outlined">
        {/* Header Table */}
        <Table size="small" sx={{ minWidth: 400 }} stickyHeader>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableCell
                  key={index}
                  align={
                    index === 0
                      ? isRTL
                        ? "right"
                        : "left"
                      : index === tableHeaders.length - 1
                      ? isRTL
                        ? "left"
                        : "right"
                      : "center"
                  }
                >
                  <strong>{header}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>

        {/* Scrollable Body */}
        <Box
          className="custom-scrollbar"
          sx={{ maxHeight: 230, overflowY: "auto" }}
        >
          <Table size="small" sx={{ minWidth: 400 }}>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align={isRTL ? "right" : "left"}>
                    {formatISODateTime(item?.docDate).split(" ")[0]}
                  </TableCell>
                  <TableCell align="center">{item.docNum}</TableCell>
                  <TableCell align="center">
                    {t(
                      `ERPDocumentsType.${
                        ERPDocumentsTypesEnum[item?.documentType]
                      }`
                    )}
                  </TableCell>
                  <TableCell align={isRTL ? "left" : "right"}>
                    {`${item.sumApplied.toFixed(2)} ${currencySymbol}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2" mb={0.5}>
          <strong>{t("payment.totalDocuments")}:</strong>{" "}
          {`${totalAgreement.toFixed(2)} ${currencySymbol}`}
        </Typography>
        <Typography variant="body2" mb={0.5}>
          <strong>{t("payment.totalPayment")}:</strong>{" "}
          {`${totalPayment.toFixed(2)} ${currencySymbol}`}
        </Typography>
        <Typography
          variant={remainingToPay === 0 ? "body2" : "body1"}
          fontWeight={600}
          color="#2e3092"
        >
          {t("payment.remainingToPay")}:{" "}
          {`${remainingToPay.toFixed(2)} ${currencySymbol}`}
        </Typography>
      </Box>
    </Box>
  );
};
