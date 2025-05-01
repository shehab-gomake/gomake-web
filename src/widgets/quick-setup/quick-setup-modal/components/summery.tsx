import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const renderList = (
    labelKey: string,
    items: string[],
    withTran: boolean = true
  ) =>
    items.length > 0 && (
      <Box mb={2}>
        <Typography fontSize="18px" fontWeight="600">
          {t(labelKey)}
        </Typography>
        <ul>
          {items.map((item) => (
            <li key={item}>
              {withTran ? t(`quickSetup.options.${item}`) : item}
            </li>
          ))}
        </ul>
      </Box>
    );

  return (
    <>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        {t("quickSetup.summary.summary")}
      </Typography>

      {renderList("quickSetup.summary.printing_methods", selectedMethods)}
      {renderList(
        "quickSetup.summary.finishing_actions_digital_offset",
        selectedDigitalOffsetActions
      )}
      {renderList(
        "quickSetup.summary.book_finishing_actions_digital_offset",
        selectedBookFinishingActions
      )}
      {renderList(
        "quickSetup.summary.roll_finishing_actions",
        selectedRollActions
      )}
      {renderList(
        "quickSetup.summary.wide_printer_actions",
        selectedWidePrinterActions
      )}
      {renderList(
        "quickSetup.summary.dtf_sublimation_actions",
        selectedDTFActions
      )}
      {renderList(
        "quickSetup.summary.material_sizes_digital_offset",
        materialDigitalOffset,
        false
      )}

      {materialRollMaxWidth && (
        <Box mb={2}>
          <Typography fontSize="18px" fontWeight="600">
            {t("quickSetup.summary.roll_material_max_width")}
          </Typography>
          <Typography>
            {t("quickSetup.summary.width_value_cm", {
              value: materialRollMaxWidth,
            })}
          </Typography>
        </Box>
      )}

      {renderList("quickSetup.summary.wide_printer_materials", materialWide)}

      {(materialWideMaxWidth || materialWideMaxLength) && (
        <Box mb={2}>
          <Typography fontSize="18px" fontWeight="600">
            {t("quickSetup.summary.wide_printer_max_dimensions")}
          </Typography>
          <Typography>
            {materialWideMaxWidth
              ? t("quickSetup.summary.width_value_cm", {
                  value: materialWideMaxWidth,
                })
              : ""}
            {materialWideMaxLength
              ? `, ${t("quickSetup.summary.length_value_cm", {
                  value: materialWideMaxLength,
                })}`
              : ""}
          </Typography>
        </Box>
      )}

      {renderList("quickSetup.summary.packing_methods", selectedPacking)}
    </>
  );
};
