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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  SelectedMachine,
  SelectedFinishingMachine,
  FinishingCategory,
} from "@/widgets/quick-setup/on-boarding-setup/types";

interface Step3RollFlexoFinishingSelectionProps {
  selectedMachines: SelectedMachine[];
  rollFlexoFinishingCategories: FinishingCategory[];
  selectedRollFlexoFinishingMachines: SelectedFinishingMachine[];
  selectedRollFlexoCategoryMachines: { [categoryId: string]: string };
  onAddRollFlexoFinishingMachine: (categoryId: string) => void;
  onDeleteRollFlexoFinishingMachine: (machineId: string) => void;
  onRollFlexoCategoryMachineChange: (
    categoryId: string,
    machineName: string
  ) => void;
  hasRollOrFlexoPrinting: boolean;
}

export const Step3RollFlexoFinishingSelection: React.FC<
  Step3RollFlexoFinishingSelectionProps
> = ({
  selectedMachines,
  rollFlexoFinishingCategories,
  selectedRollFlexoFinishingMachines,
  selectedRollFlexoCategoryMachines,
  onAddRollFlexoFinishingMachine,
  onDeleteRollFlexoFinishingMachine,
  onRollFlexoCategoryMachineChange,
  hasRollOrFlexoPrinting,
}) => {
  if (!hasRollOrFlexoPrinting) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Roll/Flexo Finishing Machines Configuration
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Roll/Flexo finishing machines are only available for Roll Digital
            and/or Flexo printing machines.
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
            ⚠️ No Roll/Flexo Printing Machines Selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have selected machines that don't require Roll/Flexo finishing
            configuration. You can proceed to complete the setup or go back to
            add Roll Digital and/or Flexo printing machines.
          </Typography>
        </Paper>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Finishing Machines for Roll/Flexo Printing
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Based on your selected Roll Digital and/or Flexo printing machines,
          configure the finishing machines for each category below. You must
          choose at least one finishing machine.
        </Typography>

        <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Selected Roll/Flexo Printing Machines:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedMachines
              .filter((machine) => {
                const categoryName = machine.categoryName.toLowerCase();
                return (
                  categoryName.includes("roll") ||
                  categoryName.includes("flexo")
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
          Finishing Categories
        </Typography>

        {rollFlexoFinishingCategories.map((category) => (
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
                  value={selectedRollFlexoCategoryMachines[category.id] || ""}
                  onChange={(e) =>
                    onRollFlexoCategoryMachineChange(
                      category.id,
                      e.target.value
                    )
                  }
                  label="Select Machine"
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
                onClick={() => onAddRollFlexoFinishingMachine(category.id)}
                disabled={!selectedRollFlexoCategoryMachines[category.id]}
                sx={{ minWidth: 100 }}
              >
                Add
              </Button>
            </Box>

            {selectedRollFlexoFinishingMachines
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
                    <Typography variant="body1">{machine.name}</Typography>
                    <IconButton
                      onClick={() =>
                        onDeleteRollFlexoFinishingMachine(machine.id)
                      }
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
          </Paper>
        ))}
      </Box>

      {selectedRollFlexoFinishingMachines.length > 0 && (
        <Paper sx={{ p: 2, mt: 3, backgroundColor: "#e8f5e8" }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Selected Roll/Flexo Finishing Machines (
            {selectedRollFlexoFinishingMachines.length}):
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedRollFlexoFinishingMachines.map((machine) => (
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
  );
};
