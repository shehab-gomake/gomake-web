import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { Stack, Box, IconButton, Divider } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { PrimaryButton } from "@/components/button/primary-button";
import { SketchPicker } from "react-color";
import { Popover } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useJobTimeAlerts, IJobTimeAlertStep } from "./use-job-time-alerts";
import { FONT_FAMILY } from "@/utils/font-family";
import AddIcon from "@mui/icons-material/Add";

interface JobTimeAlertsModalProps {
  openModal: boolean;
  onClose: () => void;
}

const JobTimeAlertsModal = ({
  openModal,
  onClose,
}: JobTimeAlertsModalProps) => {
  const { t } = useTranslation();
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
    const numValue = parseInt(value) || 0;
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
      insideStyle={{
        width: "600px",
        minWidth: "500px",
        maxHeight: "80vh",
        padding: "20px",
      }}
    >
      <Stack direction="column" gap="20px">
        {error && (
          <Box
            sx={{
              padding: "10px",
              backgroundColor: "#FEE4E2",
              color: "#D92D20",
              borderRadius: "8px",
              ...FONT_FAMILY.Inter(400, 14),
            }}
          >
            {error}
          </Box>
        )}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <span
            style={{
              ...FONT_FAMILY.Inter(500, 16),
              color: "#344054",
            }}
          >
            {t("productionFloor.timeAlertSteps")}
          </span>
          <PrimaryButton
            variant="contained"
            onClick={handleAddNew}
            startIcon={<AddIcon style={{ fontSize: "16px", color: "#fff" }} />}
            style={{
              borderRadius: "8px",
              height: "36px",
              width: "fit-content",
            }}
          >
            {t("materials.buttons.add")}
          </PrimaryButton>
        </Stack>

        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#cccdcf",
              borderRadius: "10px",
            },
          }}
        >
          {steps.length === 0 ? (
            <Box
              sx={{
                padding: "40px",
                textAlign: "center",
                color: "#98A2B3",
                ...FONT_FAMILY.Inter(400, 14),
              }}
            >
              {t("productionFloor.noTimeAlertSteps")}
            </Box>
          ) : (
            <Stack direction="column" gap="12px">
              {steps.map((step, index) => (
                <Box key={step.id || `new-${index}`}>
                  <Box
                    sx={{
                      padding: "16px",
                      border: "1px solid #D0D5DD",
                      borderRadius: "8px",
                      backgroundColor: "#FAFAFA",
                    }}
                  >
                    {editingIndex === index ? (
                      <Stack direction="column" gap="16px">
                        <Stack direction="row" gap="12px" alignItems="center">
                          <Box sx={{ flex: 1 }}>
                            <span
                              style={{
                                ...FONT_FAMILY.Inter(500, 14),
                                color: "#344054",
                                display: "block",
                                marginBottom: "8px",
                              }}
                            >
                              {t("productionFloor.timeFromDelivery")} (h)
                            </span>
                            <GomakeTextInput
                              type="number"
                              value={editingStep?.timeFromDeliveryTime || 0}
                              onChange={(e) =>
                                handleTimeChange(e.target.value, index)
                              }
                              sx={{
                                width: "100%",
                                borderRadius: "8px",
                                "& .MuiOutlinedInput-root": {
                                  "& input": {
                                    height: "44px",
                                  },
                                },
                              }}
                            />
                          </Box>
                          <Box>
                            <span
                              style={{
                                ...FONT_FAMILY.Inter(500, 14),
                                color: "#344054",
                                display: "block",
                                marginBottom: "8px",
                              }}
                            >
                              {t("machineAttributes.color")}
                            </span>
                            <div
                              onClick={(e) => handleOpenColorPicker(e, index)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                border: "1px solid #D0D5DD",
                                borderRadius: "8px",
                                backgroundColor: "white",
                                cursor: "pointer",
                                width: "140px",
                              }}
                            >
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    editingStep?.color || step.color,
                                  border: "1px solid #D0D5DD",
                                }}
                              />
                              <span
                                style={{
                                  ...FONT_FAMILY.Inter(400, 14),
                                  color: "#344054",
                                  flex: 1,
                                }}
                              >
                                {editingStep?.color || step.color}
                              </span>
                              {colorPickerIndex === index ? (
                                <KeyboardArrowUpIcon
                                  sx={{ color: "#98A2B3", fontSize: "18px" }}
                                />
                              ) : (
                                <KeyboardArrowDownIcon
                                  sx={{ color: "#98A2B3", fontSize: "18px" }}
                                />
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
                            style={{
                              borderRadius: "8px",
                              height: "36px",
                              background: "white",
                              color: "#000000",
                              border: "1px solid #D0D5DD",
                            }}
                          >
                            {t("materials.buttons.cancel")}
                          </GomakePrimaryButton>
                          <GomakePrimaryButton
                            onClick={handleSave}
                            disabled={loading}
                            style={{
                              borderRadius: "8px",
                              height: "36px",
                            }}
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
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              backgroundColor: step.color,
                              border: "1px solid #D0D5DD",
                            }}
                          />
                          <Stack direction="column">
                            <span
                              style={{
                                ...FONT_FAMILY.Inter(500, 14),
                                color: "#344054",
                              }}
                            >
                              {step.timeFromDeliveryTime}{" "}
                              {t("productionFloor.hoursFromDelivery")}
                            </span>
                            <span
                              style={{
                                ...FONT_FAMILY.Inter(400, 12),
                                color: "#98A2B3",
                              }}
                            >
                              {step.color}
                            </span>
                          </Stack>
                        </Stack>
                        <Stack direction="row" gap="8px">
                          <IconButton
                            onClick={() => handleEdit(step, index)}
                            size="small"
                            sx={{
                              color: "#344054",
                              "&:hover": { backgroundColor: "#F2F4F7" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(step, index)}
                            size="small"
                            sx={{
                              color: "#D92D20",
                              "&:hover": { backgroundColor: "#FEE4E2" },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    )}
                  </Box>
                  {index < steps.length - 1 && (
                    <Divider sx={{ marginTop: "12px" }} />
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
