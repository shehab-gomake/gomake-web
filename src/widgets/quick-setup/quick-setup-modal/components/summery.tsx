// components/SummarySection.tsx
import { Box, Typography } from "@mui/material";

interface Props {
  selectedMethods: string[];
  selectedDigitalOffsetActions: string[];
  selectedBookFinishingActions: string[];
  selectedRollActions: string[];
  selectedWidePrinterActions: string[];
  selectedDTFActions: string[];
  selectedPacking: string[];
  materialDigitalOffset: string[];
  materialRollMaxWidth: string;
  materialWide: string[];
  materialWideMaxWidth: string;
  materialWideMaxLength: string;
}

export const SummarySection = ({
  selectedMethods,
  selectedDigitalOffsetActions,
  selectedBookFinishingActions,
  selectedRollActions,
  selectedWidePrinterActions,
  selectedDTFActions,
  selectedPacking,

  materialDigitalOffset,
  materialRollMaxWidth,
  materialWide,
  materialWideMaxWidth,
  materialWideMaxLength,
}: Props) => {
  const renderList = (title: string, items: string[]) =>
    items.length > 0 && (
      <Box mb={2}>
        <Typography fontSize="18px" fontWeight="600">
          {title}
        </Typography>
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Box>
    );

  return (
    <>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Summary
      </Typography>

      {renderList("Printing Methods:", selectedMethods)}
      {renderList(
        "Finishing Actions (Digital/Offset):",
        selectedDigitalOffsetActions
      )}
      {renderList(
        "Book Finishing Actions (Digital/Offset):",
        selectedBookFinishingActions
      )}
      {renderList("Roll Finishing Actions:", selectedRollActions)}
      {renderList("Wide Printer Actions:", selectedWidePrinterActions)}
      {renderList("DTF & Sublimation Actions:", selectedDTFActions)}

      {renderList("Material Sizes (Digital/Offset):", materialDigitalOffset)}
      {materialRollMaxWidth && (
        <Box mb={2}>
          <Typography fontSize="18px" fontWeight="600">
            Roll Material Max Width:
          </Typography>
          <Typography>{materialRollMaxWidth} cm</Typography>
        </Box>
      )}
      {renderList("Wide Printer Materials:", materialWide)}
      {(materialWideMaxWidth || materialWideMaxLength) && (
        <Box mb={2}>
          <Typography fontSize="18px" fontWeight="600">
            Wide Printer Max Dimensions:
          </Typography>
          <Typography>
            {materialWideMaxWidth ? `Width: ${materialWideMaxWidth} cm` : ""}
            {materialWideMaxLength
              ? `, Length: ${materialWideMaxLength} cm`
              : ""}
          </Typography>
        </Box>
      )}
      {renderList("Packing Methods:", selectedPacking)}
    </>
  );
};
