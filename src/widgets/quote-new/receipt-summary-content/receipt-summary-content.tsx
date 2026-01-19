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
        <Table
          size="small"
          stickyHeader
          sx={{
            minWidth: 400,
            tableLayout: "fixed",
          }}
        >
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
                  sx={{ width: "25%" }}
                >
                  <strong>{header}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={tableHeaders.length} sx={{ p: 0, border: 0 }}>
                <Box
                  sx={{ maxHeight: 230, overflowY: "auto" }}
                  className="custom-scrollbar"
                >
                  <Table size="small" sx={{ tableLayout: "fixed" }}>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell
                            sx={{ width: "25%" }}
                            align={isRTL ? "right" : "left"}
                          >
                            {formatISODateTime(item?.docDate).split(" ")[0]}
                          </TableCell>
                          <TableCell sx={{ width: "25%" }} align="center">
                            {item.docNum}
                          </TableCell>
                          <TableCell sx={{ width: "25%" }} align="center">
                            {t(
                              `ERPDocumentsType.${
                                ERPDocumentsTypesEnum[item?.documentType]
                              }`
                            )}
                          </TableCell>
                          <TableCell
                            sx={{ width: "25%" }}
                            align={isRTL ? "left" : "right"}
                          >
                            {`${item.sumApplied.toFixed(2)} ${currencySymbol}`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
          color="var(--theme-primary-color, #2E3092)"
        >
          {t("payment.remainingToPay")}:{" "}
          {`${remainingToPay.toFixed(2)} ${currencySymbol}`}
        </Typography>
      </Box>
    </Box>
  );
};
