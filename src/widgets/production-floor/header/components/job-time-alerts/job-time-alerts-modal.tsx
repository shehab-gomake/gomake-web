import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { Stack, Box, IconButton, Divider } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { SketchPicker } from "react-color";
import { Popover } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useJobTimeAlerts, IJobTimeAlertStep } from "./use-job-time-alerts";
import { FONT_FAMILY } from "@/utils/font-family";
import AddIcon from "@mui/icons-material/Add";
import { useStyle } from "./style";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface JobTimeAlertsModalProps {
  openModal: boolean;
  onClose: () => void;
}

const JobTimeAlertsModal = ({
  openModal,
  onClose,
}: JobTimeAlertsModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const {
    steps,
    loading,
    error,
    addOrUpdateSteps,
    deleteStep,
    setSteps,
    fetchSteps,
  } = useJobTimeAlerts();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingStep, setEditingStep] = useState<IJobTimeAlertStep | null>(
    null
  );
  const [colorPickerAnchor, setColorPickerAnchor] =
    useState<HTMLDivElement | null>(null);
  const [colorPickerIndex, setColorPickerIndex] = useState<number | null>(null);
  const [newStepIndices, setNewStepIndices] = useState<Set<number>>(new Set());
  const [originalStep, setOriginalStep] = useState<IJobTimeAlertStep | null>(
    null
  );

  useEffect(() => {
    if (openModal) {
      // Reset all editing state
      setEditingIndex(null);
      setEditingStep(null);
      setNewStepIndices(new Set());
      setOriginalStep(null);
      setColorPickerAnchor(null);
      setColorPickerIndex(null);
      // Fetch fresh data from API when modal opens
      fetchSteps();
    }
  }, [openModal, fetchSteps]);

  const handleAddNew = () => {
    // Prevent adding new item if there's already an unsaved new item
    // User must save or cancel the current unsaved item first
    if (newStepIndices.size > 0) {
      return; // Don't allow adding multiple unsaved items
    }

    const newStep: IJobTimeAlertStep = {
      timeFromDeliveryTime: 0,
      color: "#8485C0",
    };
    const newIndex = steps.length;
    setEditingIndex(newIndex);
    setEditingStep(newStep);
    setSteps([...steps, newStep]);
    setNewStepIndices((prev) => {
      const updated = new Set(Array.from(prev));
      updated.add(newIndex);
      return updated;
    });
  };

  const handleEdit = (step: IJobTimeAlertStep, index: number) => {
    setEditingIndex(index);
    setEditingStep({ ...step });
    setOriginalStep({ ...step }); // Store original for cancel
  };

  const handleSave = async () => {
    if (editingStep && editingIndex !== null) {
      // Update the step in the list
      const updatedSteps = steps.map((step, index) =>
        index === editingIndex ? editingStep : step
      );

      // Prepare data for API - exclude id for new steps
      const stepsForApi = updatedSteps.map((step, index) => {
        if (newStepIndices.has(index)) {
          // New step - don't include id
          const { id, ...stepWithoutId } = step;
          return stepWithoutId;
        }
        return step;
      });

      await addOrUpdateSteps(stepsForApi);
      // Remove from newStepIndices if it was a new step (now saved)
      setNewStepIndices((prev) => {
        const updated = new Set(Array.from(prev));
        updated.delete(editingIndex);
        return updated;
      });
      setEditingIndex(null);
      setEditingStep(null);
    }
  };

  const handleCancel = () => {
    if (editingIndex !== null && editingStep) {
      // Remove the step if it was newly added
      if (newStepIndices.has(editingIndex)) {
        setSteps(steps.filter((_, index) => index !== editingIndex));
        setNewStepIndices((prev) => {
          const updated = new Set(Array.from(prev));
          updated.delete(editingIndex);
          return updated;
        });
      } else if (originalStep) {
        // Restore original step values
        setSteps(
          steps.map((s, index) => (index === editingIndex ? originalStep : s))
        );
      }
    }
    setEditingIndex(null);
    setEditingStep(null);
    setOriginalStep(null);
  };

  const handleDelete = async (step: IJobTimeAlertStep, index: number) => {
    if (newStepIndices.has(index)) {
      // Remove new step that hasn't been saved
      setSteps(steps.filter((_, i) => i !== index));
      setNewStepIndices((prev) => {
        const updated = new Set(Array.from(prev));
        updated.delete(index);
        return updated;
      });
    } else if (step.id) {
      // Delete existing step via API
      await deleteStep(step.id);
    }
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingStep(null);
    }
  };

  const handleColorChange = (color: any) => {
    if (editingStep) {
      setEditingStep({ ...editingStep, color: color.hex });
    }
  };

  const handleOpenColorPicker = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    setColorPickerAnchor(event.currentTarget);
    setColorPickerIndex(index);
  };

  const handleCloseColorPicker = () => {
    setColorPickerAnchor(null);
    setColorPickerIndex(null);
  };

  const handleTimeChange = (value: string, index: number) => {
    const numValue = parseFloat(value) || 0;
    if (editingStep && editingIndex === index) {
      setEditingStep({ ...editingStep, timeFromDeliveryTime: numValue });
    }
  };

  const handleClose = () => {
    // Remove all unsaved items before closing
    if (newStepIndices.size > 0) {
      setSteps((prevSteps) =>
        prevSteps.filter((_, index) => !newStepIndices.has(index))
      );
      setNewStepIndices(new Set());
    }
    // Clear all editing state
    setEditingIndex(null);
    setEditingStep(null);
    setOriginalStep(null);
    setColorPickerAnchor(null);
    setColorPickerIndex(null);
    onClose();
  };

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={handleClose}
      modalTitle={t("productionFloor.jobTimeAlerts")}
      modalTitleStyle={{ ...FONT_FAMILY.Inter(600, 18) }}
      modalTitleColor={"#000000"}
      withRoundedCloseIcon={false}
      insideStyle={classes.modalInsideStyle}
    >
      <Stack direction="column" gap="20px" mt="16px">
        {error && <Box sx={classes.errorBox}>{error}</Box>}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <span style={classes.sectionTitle}>
            {t("productionFloor.timeAlertSteps")}
          </span>
          <PrimaryButton
            variant="contained"
            onClick={handleAddNew}
            startIcon={<AddIcon style={{ fontSize: "16px", color: "#fff" }} />}
            style={classes.addButtonStyle}
          >
            {t("materials.buttons.add")}
          </PrimaryButton>
        </Stack>

        <Box sx={classes.scrollableContainer}>
          {steps.length === 0 ? (
            <Box sx={classes.emptyStateBox}>
              {t("productionFloor.noTimeAlertSteps")}
            </Box>
          ) : (
            <Stack direction="column" gap="12px">
              {steps.map((step, index) => (
                <Box key={step.id || `new-${index}`}>
                  <Box sx={classes.stepCard}>
                    {editingIndex === index ? (
                      <Stack direction="column" gap="16px">
                        <Stack direction="row" gap="12px" alignItems="center">
                          <Box sx={{ flex: 1 }}>
                            <span style={classes.labelStyle}>
                              {t("productionFloor.timeFromDelivery")} (h)
                            </span>
                            <GomakeTextInput
                              type="number"
                              InputProps={{
                                inputProps: {
                                  step: "0.1",
                                },
                              }}
                              value={editingStep?.timeFromDeliveryTime || 0}
                              onChange={(e) =>
                                handleTimeChange(e.target.value, index)
                              }
                              sx={classes.textInputStyle}
                            />
                          </Box>
                          <Box>
                            <span style={classes.labelStyle}>
                              {t("machineAttributes.color")}
                            </span>
                            <div
                              onClick={(e) => handleOpenColorPicker(e, index)}
                              style={classes.colorPickerContainer}
                            >
                              <div
                                style={{
                                  ...classes.colorCircle,
                                  backgroundColor:
                                    editingStep?.color || step.color,
                                }}
                              />
                              <span style={classes.colorText}>
                                {editingStep?.color || step.color}
                              </span>
                              {colorPickerIndex === index ? (
                                <KeyboardArrowUpIcon sx={classes.arrowIcon} />
                              ) : (
                                <KeyboardArrowDownIcon sx={classes.arrowIcon} />
                              )}
                            </div>
                          </Box>
                        </Stack>
                        <Stack
                          direction="row"
                          gap="8px"
                          justifyContent="flex-end"
                        >
                          <GomakePrimaryButton
                            onClick={handleCancel}
                            style={classes.cancelButtonStyle}
                          >
                            {t("materials.buttons.cancel")}
                          </GomakePrimaryButton>
                          <GomakePrimaryButton
                            onClick={handleSave}
                            disabled={loading}
                            style={classes.saveButtonStyle}
                          >
                            {t("materials.buttons.save")}
                          </GomakePrimaryButton>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" gap="16px" alignItems="center">
                          <div
                            style={{
                              ...classes.colorCircleLarge,
                              backgroundColor: step.color,
                            }}
                          />
                          <Stack direction="column">
                            <span style={classes.stepTitle}>
                              {step.timeFromDeliveryTime}{" "}
                              {t("productionFloor.hoursFromDelivery")}
                            </span>
                            <span style={classes.stepSubtitle}>
                              {step.color}
                            </span>
                          </Stack>
                        </Stack>
                        <Stack direction="row" gap="8px">
                          <IconButton
                            onClick={() => handleEdit(step, index)}
                            size="small"
                            sx={classes.editIconButton}
                            title={t("navigationButtons.edit")}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(step, index)}
                            size="small"
                            sx={classes.deleteIconButton}
                            title={t("navigationButtons.delete")}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    )}
                  </Box>
                  {index < steps.length - 1 && (
                    <Divider sx={classes.dividerStyle} />
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>

      <Popover
        open={Boolean(colorPickerAnchor) && colorPickerIndex === editingIndex}
        anchorEl={colorPickerAnchor}
        onClose={handleCloseColorPicker}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <SketchPicker
          color={editingStep?.color || "#8485C0"}
          onChange={handleColorChange}
        />
      </Popover>
    </GoMakeModal>
  );
};

export { JobTimeAlertsModal };
