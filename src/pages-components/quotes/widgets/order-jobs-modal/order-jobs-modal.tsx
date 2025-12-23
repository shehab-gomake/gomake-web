import React from "react";
import { GoMakeDialog } from "@/components/dialog/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { PrimaryButton } from "@/components/button/primary-button";

interface OrderJob {
  jobNumber: string;
  station: {
    actionName: string;
    employeeName: string;
  };
}

interface OrderJobsModalProps {
  open: boolean;
  onClose: () => void;
  orderJobs: OrderJob[];
  title?: string;
  quoteNumber?: string;
}

const OrderJobsModal: React.FC<OrderJobsModalProps> = ({
  open,
  onClose,
  orderJobs,
  title,
  quoteNumber,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const router = useRouter();

  const handleNavigateToJobs = () => {
    if (quoteNumber) {
      router.push(`/jobs?pageNumber=1&finalPatternSearch=${quoteNumber}`);
      onClose();
    }
  };

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={title || t("dashboard.orderJobs")}
      maxWidth="md"
      fullWidth={true}
      showButton={false}
    >
      <div style={classes.container}>
        {orderJobs && orderJobs.length > 0 ? (
          <Paper elevation={0} sx={classes.paper}>
            <Table>
              <TableHead>
                <TableRow sx={classes.tableRow}>
                  <TableCell align="center" sx={classes.headerCell}>
                    {t("boardMissions.missionNumber")}
                  </TableCell>
                  <TableCell align="center" sx={classes.headerCell}>
                    {t("boardMissions.actionName")}
                  </TableCell>
                  <TableCell align="center" sx={classes.headerCell}>
                    {t("sales.quote.employeeName")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderJobs.map((job, index) => (
                  <TableRow key={index} sx={classes.bodyRow}>
                    <TableCell align="center" sx={classes.bodyCell}>
                      {job.jobNumber || "-"}
                    </TableCell>
                    <TableCell align="center" sx={classes.bodyCell}>
                      {job.station?.actionName || "-"}
                    </TableCell>
                    <TableCell align="center" sx={classes.bodyCell}>
                      {job.station?.employeeName || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <div style={classes.emptyState}>{t("boardMissions.noOrderJobs")}</div>
        )}
        {quoteNumber && (
          <Box sx={classes.buttonContainer}>
            <PrimaryButton
              variant="contained"
              style={{ width: "fit-content" }}
              onClick={handleNavigateToJobs}
            >
              {t("boardMissions.viewAllJobs") || "View All Jobs"}
            </PrimaryButton>
          </Box>
        )}
      </div>
    </GoMakeDialog>
  );
};

export { OrderJobsModal };
export type { OrderJob };
