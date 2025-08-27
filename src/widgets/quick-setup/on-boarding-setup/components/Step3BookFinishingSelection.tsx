import React from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";
import {
  SelectedMachine,
  SelectedFinishingMachine,
  FinishingCategory,
} from "@/widgets/quick-setup/on-boarding-setup/types";

interface Step3BookFinishingSelectionProps {
  selectedMachines: SelectedMachine[];
  bookFinishingCategories: FinishingCategory[];
  selectedBookFinishingMachines: SelectedFinishingMachine[];
  selectedBookFinishingCategoryMachines: { [categoryId: string]: string };
  onAddBookFinishingMachine: (categoryId: string) => void;
  onDeleteBookFinishingMachine: (machineId: string) => void;
  onBookFinishingCategoryMachineChange: (
    categoryId: string,
    machineName: string
  ) => void;
  hasDigitalOrOffsetPrinting: boolean;
}

export const Step3BookFinishingSelection: React.FC<
  Step3BookFinishingSelectionProps
> = ({
  selectedMachines,
  bookFinishingCategories,
  selectedBookFinishingMachines,
  selectedBookFinishingCategoryMachines,
  onAddBookFinishingMachine,
  onDeleteBookFinishingMachine,
  onBookFinishingCategoryMachineChange,
  hasDigitalOrOffsetPrinting,
}) => {
  const { t } = useTranslation();

  const clearCategorySelection = (categoryId: string) => {
    onBookFinishingCategoryMachineChange(categoryId, "");
  };

  if (!hasDigitalOrOffsetPrinting) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Book Finishing Machines Configuration
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Book finishing machines are only available for Digital/Offset
            printing machines.
          </Typography>

          <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Printing Machines:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedMachines.map((machine) => (
                <Chip
                  key={machine.id}
                  label={machine.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Box>

        <Paper
          sx={{
            p: 3,
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
          }}
        >
          <Typography variant="body1" color="warning.main" sx={{ mb: 1 }}>
            ⚠️ No Digital/Offset Printing Machines Selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have selected machines that don't require book finishing
            configuration. You can proceed to complete the setup or go back to
            add Digital/Offset printing machines.
          </Typography>
        </Paper>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 300px)", // Leave space for header, stepper, and navigation buttons
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#c1c1c1",
          borderRadius: "4px",
          "&:hover": { background: "#a8a8a8" },
        },
      }}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Book Finishing Machines for Digital/Offset Printing
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Based on your selected Digital/Offset printing machines, configure
            the book finishing machines for each category below:
          </Typography>

          <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Digital/Offset Printing Machines:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedMachines
                .filter((machine) => {
                  const categoryName = machine.categoryName.toLowerCase();
                  return (
                    categoryName.includes("digital") ||
                    categoryName.includes("offset")
                  );
                })
                .map((machine) => (
                  <Chip
                    key={machine.id}
                    label={machine.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
            </Box>
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Book Finishing Categories
          </Typography>

          {bookFinishingCategories.map((category) => (
            <Paper
              key={category.id}
              sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0" }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                {t(category.name)}
              </Typography>

              <Box
                sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-end" }}
              >
                <FormControl fullWidth>
                  <InputLabel>Select Machine</InputLabel>
                  <Select
                    value={
                      selectedBookFinishingCategoryMachines[category.id] || ""
                    }
                    onChange={(e) =>
                      onBookFinishingCategoryMachineChange(
                        category.id,
                        e.target.value
                      )
                    }
                    label="Select Machine"
                    input={<OutlinedInput label="Select Machine" />}
                    endAdornment={
                      <InputAdornment position="end">
                        {selectedBookFinishingCategoryMachines[category.id] && (
                          <IconButton
                            onClick={() => clearCategorySelection(category.id)}
                            edge="end"
                            size="small"
                            sx={{ mr: 3 }}
                          >
                            <ClearIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    }
                  >
                    {category.machines.map((machine) => (
                      <MenuItem key={machine} value={machine}>
                        {machine}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={() => onAddBookFinishingMachine(category.id)}
                  disabled={!selectedBookFinishingCategoryMachines[category.id]}
                  sx={{ minWidth: 100 }}
                >
                  Add
                </Button>
              </Box>

              {/* Selected machines list */}
              {selectedBookFinishingMachines.filter(
                (machine) => machine.categoryId === category.id
              ).length > 0 && (
                <Box>
                  {selectedBookFinishingMachines
                    .filter((machine) => machine.categoryId === category.id)
                    .map((machine) => (
                      <Paper
                        key={machine.id}
                        sx={{
                          p: 2,
                          mb: 1,
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #dee2e6",
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body1">
                            {machine.name}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              onDeleteBookFinishingMachine(machine.id)
                            }
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                </Box>
              )}
            </Paper>
          ))}
        </Box>

        {selectedBookFinishingMachines.length > 0 && (
          <Paper sx={{ p: 2, mt: 3, backgroundColor: "#e8f5e8" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Book Finishing Machines (
              {selectedBookFinishingMachines.length}):
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedBookFinishingMachines.map((machine) => (
                <Chip
                  key={machine.id}
                  label={`${machine.name} (${machine.categoryName})`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};
