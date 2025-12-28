import { Box, IconButton, Stack } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/button/primary-button";
import { FONT_FAMILY } from "@/utils/font-family";
import { Add, Remove, Close } from "@mui/icons-material";
import { useState } from "react";

interface RepeatOrderCardProps {
  job: any;
  quantity: number;
  onQuantityIncrease: () => void;
  onQuantityDecrease: () => void;
  onRepeatOrder: () => void;
  formatISODateTime: (date: string) => string;
}

const RepeatOrderCard = ({
  job,
  quantity,
  onQuantityIncrease,
  onQuantityDecrease,
  onRepeatOrder,
  formatISODateTime,
}: RepeatOrderCardProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  return (
    <Box sx={classes.cardContainer}>
      {/* Image Section */}
      {job.boardMissionImage && !imageError && (
        <Box
          sx={classes.imageContainer}
          onClick={() => setImageViewerOpen(true)}
        >
          <img
            src={job.boardMissionImage}
            alt={job.productName || job.jobName}
            style={classes.cardImage}
            onError={() => setImageError(true)}
          />
        </Box>
      )}

      {/* Card Content */}
      <Box sx={classes.cardContent}>
        <Stack gap={1.5} sx={classes.contentStack}>
          {/* Main Info Section */}
          <Stack gap={1}>
            {/* Customer Name - Prominent */}
            {job.clientName && (
              <Box sx={classes.mainFieldContainer}>
                <Box sx={classes.fieldLabel}>
                  {t("boardMissions.clientName")}
                </Box>
                <Box sx={classes.fieldValue}>{job.clientName}</Box>
              </Box>
            )}

            {/* Job Number and Job Name - Same Row */}
            {(job.number || job.jobName) && (
              <Box sx={classes.fieldRowContainer}>
                {/* Job Number */}
                {job.number && (
                  <Box sx={classes.fieldContainerHalf}>
                    <Box sx={classes.fieldLabel}>
                      {t("boardMissions.missionNumber")}
                    </Box>
                    <Box sx={classes.fieldValue}>
                      {job.productType
                        ? `${job.number} / ${
                            job.productTypeName || job.productType
                          }`
                        : job.number}
                    </Box>
                  </Box>
                )}
                {/* Job Name */}
                {job.jobName && (
                  <Box sx={classes.fieldContainerHalf}>
                    <Box sx={classes.fieldLabel}>
                      {t("boardMissions.jobName")}
                    </Box>
                    <Box sx={classes.fieldValue}>{job.jobName}</Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Product Name and Status - Same Row */}
            {(job.productName || job.boardMissionStatus?.name) && (
              <Box sx={classes.fieldRowContainer}>
                {/* Product Name */}
                {job.productName && (
                  <Box sx={classes.fieldContainerHalf}>
                    <Box sx={classes.fieldLabel}>
                      {t("boardMissions.productName")}
                    </Box>
                    <Box sx={classes.fieldValue}>{job.productName}</Box>
                  </Box>
                )}
                {/* Status - No Label */}
                {job.boardMissionStatus?.name && (
                  <Box sx={classes.fieldContainerHalfNoLabel}>
                    <Box sx={classes.statusValue}>
                      {t(`productionStatuses.${job.boardMissionStatus.name}`)}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Dates Section */}
            <Stack gap={0.75} sx={classes.datesSection}>
              {job.createdDate && (
                <Box sx={classes.dateField}>
                  <Box sx={classes.dateLabel}>
                    {t("boardMissions.creationDate")}
                  </Box>
                  <Box sx={classes.dateValue}>
                    {formatISODateTime(job.createdDate)}
                  </Box>
                </Box>
              )}
              {/* 
              {job.dueDate && (
                <Box sx={classes.dateField}>
                  <Box sx={classes.dateLabel}>{t("boardMissions.dueDate")}</Box>
                  <Box sx={classes.dateValue}>
                    {formatISODateTime(job.dueDate)}
                  </Box>
                </Box>
              )} */}
            </Stack>
          </Stack>

          {/* Quantity Counter Section */}
          <Box sx={classes.quantityContainer}>
            <Box sx={classes.quantityLabel}>{t("boardMissions.quantity")}</Box>
            <Stack direction="row" alignItems="center" gap={1}>
              <IconButton
                size="small"
                onClick={onQuantityDecrease}
                disabled={quantity <= 1}
                sx={classes.quantityButton}
              >
                <Remove />
              </IconButton>
              <Box sx={classes.quantityValue}>{quantity}</Box>
              <IconButton
                size="small"
                onClick={onQuantityIncrease}
                sx={classes.quantityButton}
              >
                <Add />
              </IconButton>
            </Stack>
          </Box>

          {/* Repeat Button */}
          <PrimaryButton
            variant="contained"
            onClick={onRepeatOrder}
            style={classes.repeatButton}
          >
            {t("repeatOrders.repeat")}
          </PrimaryButton>
        </Stack>
      </Box>

      {/* Image Viewer Modal */}
      {imageViewerOpen && job.boardMissionImage && (
        <Box
          sx={classes.imageViewerOverlay}
          onClick={() => setImageViewerOpen(false)}
        >
          <Box
            sx={classes.imageViewerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={job.boardMissionImage}
              alt={job.productName || job.jobName}
              style={classes.imageViewerImage}
            />
            <IconButton
              sx={classes.imageViewerClose}
              onClick={() => setImageViewerOpen(false)}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export { RepeatOrderCard };
