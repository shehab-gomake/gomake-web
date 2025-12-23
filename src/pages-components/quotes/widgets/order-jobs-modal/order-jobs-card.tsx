import React from "react";
import { Paper, Box, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { OrderJob } from "./types";
import { ORDER_STATUSES } from "@/enums";

interface OrderJobsCardProps {
  orderJobs: OrderJob[];
  quoteNumber?: string;
  onClose?: () => void;
}

const OrderJobsCard: React.FC<OrderJobsCardProps> = ({
  orderJobs,
  quoteNumber,
  onClose,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const router = useRouter();

  const handleNavigateToJobs = () => {
    if (quoteNumber) {
      router.push(`/jobs?pageNumber=1&finalPatternSearch=${quoteNumber}`);
      onClose?.();
    }
  };

  const getJobStatus = (job: OrderJob): string => {
    if (job?.isReady) {
      const storageText =
        job?.storage === "undefined"
          ? ""
          : job?.storage
          ? ` ${job.storage}`
          : " ";
      return `${t("boardMissions.done")}${storageText}`;
    }
    if (job?.orderStatus === ORDER_STATUSES.WaitingForPayment) {
      return t("boardMissions.waitingForPayment");
    }
    if (job?.boardMissionStatus && job?.station) {
      const empName =
        job.station.machineName && job.station.machineId
          ? job.station.machineName
          : job.station?.supplierId
          ? job.station.supplierName
          : job.station.employeeName;
      if (empName) {
        return `${t("productionStatuses." + job.boardMissionStatus.name)} - ${
          job.station.actionName
        } - ${empName}`;
      }
      return `${t("productionStatuses." + job.boardMissionStatus.name)} - ${
        job.station.actionName
      }`;
    }
    return "";
  };

  if (!orderJobs || orderJobs.length === 0) {
    return (
      <Paper elevation={3} sx={classes.cardPaper}>
        <Box sx={classes.cardContent}>
          <Typography sx={classes.emptyStateText}>
            {t("boardMissions.noOrderJobs")}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={classes.cardPaper}>
      <Box sx={classes.cardContent}>
        {orderJobs.map((job, index) => {
          const status = getJobStatus(job);
          return (
            <Box key={index}>
              <Box sx={classes.jobItem}>
                <Box sx={classes.jobInfo}>
                  <Typography sx={classes.jobLabel}>
                    {t("boardMissions.missionNumber")}:
                  </Typography>
                  <Typography sx={classes.jobValue}>
                    {job.jobNumber || "-"}
                  </Typography>
                </Box>
                {status && (
                  <Box sx={classes.jobInfo}>
                    <Typography sx={classes.jobLabel}>
                      {t("tableHeaders.status") || "Status"}:
                    </Typography>
                    <Typography sx={classes.jobValue}>{status}</Typography>
                  </Box>
                )}
              </Box>
              {index < orderJobs.length - 1 && <Divider sx={classes.divider} />}
            </Box>
          );
        })}
        {quoteNumber && (
          <Box sx={classes.cardButtonContainer}>
            <GomakePrimaryButton
              onClick={handleNavigateToJobs}
              style={classes.smallButton}
            >
              {t("boardMissions.viewAllJobs") || "View All Jobs"}
            </GomakePrimaryButton>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export { OrderJobsCard };
