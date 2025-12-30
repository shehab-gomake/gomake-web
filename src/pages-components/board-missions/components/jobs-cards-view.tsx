import { Box, CircularProgress, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { RepeatOrderCard } from "../../repeat-orders/components/repeat-order-card";

interface JobsCardsViewProps {
  jobs: any[];
  isLoading: boolean;
  isError: boolean;
  quantities?: Record<string, number>;
  onQuantityIncrease?: (jobId: string) => void;
  onQuantityDecrease?: (jobId: string) => void;
  onRepeatOrder?: (job: any) => void;
  formatISODateTime: (date: string) => string;
  showQuantityControls?: boolean;
  showRepeatButton?: boolean;
}

const JobsCardsView = ({
  jobs,
  isLoading,
  isError,
  quantities = {},
  onQuantityIncrease,
  onQuantityDecrease,
  onRepeatOrder,
  formatISODateTime,
  showQuantityControls = false,
  showRepeatButton = false,
}: JobsCardsViewProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
        width="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
        width="100%"
      >
        <Box
          style={{
            ...FONT_FAMILY.Lexend(500, 16),
            color: "#FF0000",
          }}
        >
          {t("repeatOrders.errorLoadingJobs")}
        </Box>
      </Box>
    );
  }

  if (jobs.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
        width="100%"
      >
        <Box
          style={{
            ...FONT_FAMILY.Lexend(500, 16),
            color: "#666",
          }}
        >
          {t("repeatOrders.noJobsFound")}
        </Box>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {jobs.map((job) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
          <RepeatOrderCard
            job={job}
            quantity={quantities?.[job.id] || job.quantity || 1}
            onQuantityIncrease={
              showQuantityControls && onQuantityIncrease
                ? () => onQuantityIncrease(job.id)
                : undefined
            }
            onQuantityDecrease={
              showQuantityControls && onQuantityDecrease
                ? () => onQuantityDecrease(job.id)
                : undefined
            }
            onRepeatOrder={
              showRepeatButton && onRepeatOrder
                ? () => onRepeatOrder(job)
                : undefined
            }
            formatISODateTime={formatISODateTime}
            showQuantityControls={showQuantityControls}
            showRepeatButton={showRepeatButton}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export { JobsCardsView };
