import { Box, IconButton, Stack } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/button/primary-button";
import { FONT_FAMILY } from "@/utils/font-family";
import { Add, Remove, Close } from "@mui/icons-material";
import { useState } from "react";
import { createPortal } from "react-dom";

interface RepeatOrderCardProps {
  job: any;
  quantity: number;
  onQuantityIncrease?: () => void;
  onQuantityDecrease?: () => void;
  onRepeatOrder?: () => void;
  formatISODateTime: (date: string) => string;
  showQuantityControls?: boolean;
  showRepeatButton?: boolean;
}

const RepeatOrderCard = ({
  job,
  quantity,
  onQuantityIncrease,
  onQuantityDecrease,
  onRepeatOrder,
  formatISODateTime,
  showQuantityControls = true,
  showRepeatButton = true,
}: RepeatOrderCardProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  return (
    <Box sx={classes.cardContainer}>
      {/* Card Content */}
      <Box sx={classes.cardContent}>
        <Stack gap={1.5} sx={classes.contentStack}>
          {/* Main Info Section */}
          <Stack gap={1}>
            {/* Customer Name - Prominent with Image Thumbnail */}
            {job.clientName && (
              <Box sx={classes.mainFieldContainer}>
                <Box sx={classes.customerNameRow}>
                  {/* First div: Label and Value stacked */}
                  <Box sx={classes.customerNameColumn}>
                    <Box sx={classes.fieldLabel}>
                      {t("boardMissions.clientName")}
                    </Box>
                    <Box sx={classes.fieldValue}>{job.clientName}</Box>
                  </Box>
                  {/* Second div: Image Thumbnail */}
                  {job.boardMissionImage && !imageError && (
                    <Box
                      sx={classes.imageThumbnail}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageViewerOpen(true);
                      }}
                    >
                      <img
                        src={job.boardMissionImage}
                        alt={job.productName || job.jobName}
                        style={classes.thumbnailImage}
                        onError={() => setImageError(true)}
                      />
                    </Box>
                  )}
                </Box>
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
                      {job.orderNumber && ` / ${job.orderNumber}`}
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

            {/* Product Name and Price - Same Row */}
            {(job.productName || job.price) && (
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
                {job.price && (
                  <Box sx={classes.fieldContainerHalf}>
                    <Box sx={classes.fieldLabel}>
                      {t("pricingWidget.finalPrice")}
                    </Box>
                    <Box sx={classes.statusValue}>
                      {job.currency
                        ? `${job.price} ${job.currency}`
                        : job.price}
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
                    {t("repeatOrders.lastOrder")}
                  </Box>
                  <Box sx={classes.dateValue}>
                    {formatISODateTime(job.createdDate)}
                  </Box>
                </Box>
              )}
            </Stack>
          </Stack>

          {/* Quantity Counter Section */}
          {showQuantityControls && (
            <Box sx={classes.quantityContainer}>
              <Box sx={classes.quantityLabel}>
                {t("boardMissions.quantity")}
              </Box>
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
          )}

          {/* Repeat Button */}
          {showRepeatButton && (
            <PrimaryButton
              variant="contained"
              onClick={onRepeatOrder}
              style={classes.repeatButton}
            >
              {t("repeatOrders.repeat")}
            </PrimaryButton>
          )}
        </Stack>
      </Box>

      {/* Image Viewer Modal - Rendered via Portal to avoid card hover effects */}
      {imageViewerOpen &&
        job.boardMissionImage &&
        typeof document !== "undefined" &&
        createPortal(
          <Box
            sx={classes.imageViewerOverlay}
            onClick={(e) => {
              // Only close if clicking directly on the overlay, not on the content
              if (e.target === e.currentTarget) {
                setImageViewerOpen(false);
              }
            }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setImageViewerOpen(false);
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>,
          document.body
        )}
    </Box>
  );
};

export { RepeatOrderCard };
