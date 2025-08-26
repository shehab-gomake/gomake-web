import React from "react";
import { Button, Box, Typography, Chip, Paper, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  QuickSetupModalNew,
  useQuickSetupModalNew,
  SelectedMachine,
} from "./index";

/**
 * Example component showing how to integrate the QuickSetupModalNew
 * into an existing page or component.
 */
const ExampleUsage: React.FC = () => {
  const { t } = useTranslation();
  const {
    modal,
    selectedMachines,
    openModal,
    handleSave,
    clearSelectedMachines,
  } = useQuickSetupModalNew();

  const handleSaveMachines = (machines: SelectedMachine[]) => {
    handleSave(machines);

    // Here you would typically:
    // 1. Call an API to save the selected machines
    // 2. Update your application state
    // 3. Show a success message
    // 4. Navigate to the next step

    console.log("Saving machines:", machines);

    // Example API call (uncomment and modify as needed):
    // await saveSelectedMachines(machines);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Quick Setup - Machine Selection
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is an example of how to integrate the QuickSetupModalNew component.
        Click the button below to open the modal and select machines.
      </Alert>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={openModal} size="large">
          {t("quickSetup.openModal")}
        </Button>

        {selectedMachines.length > 0 && (
          <Button
            variant="outlined"
            onClick={clearSelectedMachines}
            color="error"
          >
            Clear All Machines
          </Button>
        )}
      </Box>

      {/* Selected Machines Display */}
      {selectedMachines.length > 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("quickSetup.selectedMachines")} ({selectedMachines.length})
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {selectedMachines.map((machine) => (
              <Chip
                key={machine.id}
                label={`${machine.name} (${machine.categoryName})`}
                color="primary"
                variant="outlined"
                size="medium"
              />
            ))}
          </Box>

          <Alert severity="success">
            {t("quickSetup.loadedMachines", { count: selectedMachines.length })}
          </Alert>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No machines selected yet. Click the button above to start selecting
            machines.
          </Typography>
        </Paper>
      )}

      {/* Next Step Button */}
      {selectedMachines.length > 0 && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            color="success"
            onClick={() => {
              // Handle next step in the setup process
              console.log(
                "Proceeding to next step with machines:",
                selectedMachines
              );
            }}
          >
            Continue to Next Step
          </Button>
        </Box>
      )}

      {/* Modal */}
      <QuickSetupModalNew
        open={modal.isOpen}
        onClose={modal.close}
        onSave={handleSaveMachines}
      />
    </Box>
  );
};

export default ExampleUsage;

