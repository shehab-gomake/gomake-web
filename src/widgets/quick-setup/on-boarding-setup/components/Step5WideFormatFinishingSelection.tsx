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
import {
  SelectedMachine,
  SelectedFinishingMachine,
  FinishingCategory,
} from "@/widgets/quick-setup/on-boarding-setup/types";

interface Step5WideFormatFinishingSelectionProps {
  selectedMachines: SelectedMachine[];
  wideFormatFinishingCategories: FinishingCategory[];
  selectedWideFormatFinishingMachines: SelectedFinishingMachine[];
  selectedWideFormatFinishingCategoryMachines: { [categoryId: string]: string };
  onAddWideFormatFinishingMachine: (categoryId: string) => void;
  onDeleteWideFormatFinishingMachine: (machineId: string) => void;
  onWideFormatFinishingCategoryMachineChange: (
    categoryId: string,
    machineName: string
  ) => void;
  hasWidePrinting: boolean;
}

export const Step5WideFormatFinishingSelection: React.FC<
  Step5WideFormatFinishingSelectionProps
> = ({
  selectedMachines,
  wideFormatFinishingCategories,
  selectedWideFormatFinishingMachines,
  selectedWideFormatFinishingCategoryMachines,
  onAddWideFormatFinishingMachine,
  onDeleteWideFormatFinishingMachine,
  onWideFormatFinishingCategoryMachineChange,
  hasWidePrinting,
}) => {
  const clearCategorySelection = (categoryId: string) => {
    onWideFormatFinishingCategoryMachineChange(categoryId, "");
  };

  if (!hasWidePrinting) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Wide Format Finishing Machines Configuration
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Wide format finishing machines are only available for Wide printer
            machines.
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
            ⚠️ No Wide Printer Machines Selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have selected machines that don't require wide format finishing
            configuration. You can proceed to complete the setup or go back to
            add Wide printer machines.
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
          Select Wide Format Finishing Machines for Wide Printing
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Based on your selected Wide printer machines, configure the Wide
            format finishing machines for each category below:
          </Typography>

          <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Wide Printer Machines:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedMachines
                .filter((machine) => {
                  const categoryName = machine.categoryName.toLowerCase();
                  return categoryName.includes("wide");
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
            Wide Format Finishing Categories
          </Typography>

          {wideFormatFinishingCategories.map((category) => (
            <Paper
              key={category.id}
              sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0" }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                {category.name}
              </Typography>

              <Box
                sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-end" }}
              >
                <FormControl fullWidth>
                  <InputLabel>Select Machine</InputLabel>
                  <Select
                    value={
                      selectedWideFormatFinishingCategoryMachines[
                        category.id
                      ] || ""
                    }
                    onChange={(e) =>
                      onWideFormatFinishingCategoryMachineChange(
                        category.id,
                        e.target.value
                      )
                    }
                    label="Select Machine"
                    input={<OutlinedInput label="Select Machine" />}
                    endAdornment={
                      <InputAdornment position="end">
                        {selectedWideFormatFinishingCategoryMachines[
                          category.id
                        ] && (
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
                  onClick={() => onAddWideFormatFinishingMachine(category.id)}
                  disabled={
                    !selectedWideFormatFinishingCategoryMachines[category.id]
                  }
                  sx={{ minWidth: 100 }}
                >
                  Add
                </Button>
              </Box>

              {/* Selected machines list */}
              {selectedWideFormatFinishingMachines.filter(
                (machine) => machine.categoryId === category.id
              ).length > 0 && (
                <Box>
                  {selectedWideFormatFinishingMachines
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
                              onDeleteWideFormatFinishingMachine(machine.id)
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

        {selectedWideFormatFinishingMachines.length > 0 && (
          <Paper sx={{ p: 2, mt: 3, backgroundColor: "#e8f5e8" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Wide Format Finishing Machines (
              {selectedWideFormatFinishingMachines.length}):
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedWideFormatFinishingMachines.map((machine) => (
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
