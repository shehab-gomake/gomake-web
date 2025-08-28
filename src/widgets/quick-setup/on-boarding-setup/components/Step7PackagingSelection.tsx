import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  FinishingCategory,
  SelectedFinishingMachine,
} from "@/widgets/quick-setup/on-boarding-setup/types";

interface Step7PackagingSelectionProps {
  packagingCategories: FinishingCategory[];
  selectedPackagingMachines: SelectedFinishingMachine[];
  selectedPackagingCategoryMachines: { [categoryId: string]: string };
  onAddPackagingMachine: (categoryId: string) => void;
  onDeletePackagingMachine: (machineId: string) => void;
  onPackagingCategoryMachineChange: (
    categoryId: string,
    machineName: string
  ) => void;
  autoSelectedMachines?: SelectedFinishingMachine[];
}

export const Step7PackagingSelection: React.FC<
  Step7PackagingSelectionProps
> = ({
  packagingCategories,
  selectedPackagingMachines,
  selectedPackagingCategoryMachines,
  onAddPackagingMachine,
  onDeletePackagingMachine,
  onPackagingCategoryMachineChange,
  autoSelectedMachines = [],
}) => {
  const { t } = useTranslation();
  const [searchTerms, setSearchTerms] = useState<{
    [categoryId: string]: string;
  }>({});

  const clearCategorySelection = (categoryId: string) => {
    onPackagingCategoryMachineChange(categoryId, "");
  };

  const handleSearchChange = (categoryId: string, value: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  const getFilteredMachines = (category: FinishingCategory) => {
    const searchTerm = searchTerms[category.id] || "";
    if (!searchTerm) return category.machines;

    return category.machines.filter(
      (machine) =>
        machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Helper function to check if a machine is auto-selected
  const isAutoSelected = (machineId: string): boolean => {
    return autoSelectedMachines.some((machine) => machine.id === machineId);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("Select Packaging Machines")}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            {t("Configure packaging machines for your setup")}
          </Typography>

          <Paper sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Printing Machines:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {/* This would show selected printing machines from step 1 */}
              <Chip
                label="Packaging Setup"
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Packaging Categories
          </Typography>

          {packagingCategories.map((category) => (
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
                    value={selectedPackagingCategoryMachines[category.id] || ""}
                    onChange={(e) =>
                      onPackagingCategoryMachineChange(
                        category.id,
                        e.target.value
                      )
                    }
                    label="Select Machine"
                    input={<OutlinedInput label="Select Machine" />}
                    endAdornment={
                      <InputAdornment position="end">
                        {selectedPackagingCategoryMachines[category.id] && (
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
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 300 } },
                    }}
                  >
                    <MenuItem sx={{ p: 1 }}>
                      <TextField
                        placeholder="Search machines..."
                        value={searchTerms[category.id] || ""}
                        onChange={(e) =>
                          handleSearchChange(category.id, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputBase-root": {
                            height: 40,
                            fontSize: "14px",
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </MenuItem>
                    {getFilteredMachines(category).map((machine) => (
                      <MenuItem
                        key={machine.id}
                        value={machine.model}
                        sx={{ py: 1, fontSize: "14px" }}
                      >
                        {machine.manufacturer} - {machine.model}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={() => onAddPackagingMachine(category.id)}
                  disabled={!selectedPackagingCategoryMachines[category.id]}
                  sx={{ minWidth: 100 }}
                >
                  Add
                </Button>
              </Box>

              {/* Selected machines list */}
              {selectedPackagingMachines.filter(
                (machine) => machine.categoryId === category.id
              ).length > 0 && (
                <Box>
                  {selectedPackagingMachines
                    .filter((machine) => machine.categoryId === category.id)
                    .map((machine) => (
                      <Paper
                        key={machine.id}
                        sx={{
                          p: 2,
                          mb: 1,
                          backgroundColor: isAutoSelected(machine.id)
                            ? "#fff3cd"
                            : "#f8f9fa",
                          border: `1px solid ${
                            isAutoSelected(machine.id) ? "#ffc107" : "#dee2e6"
                          }`,
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
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body1">
                              {machine.name}
                            </Typography>
                            {isAutoSelected(machine.id) && (
                              <Chip
                                label="Auto-selected"
                                size="small"
                                color="warning"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
                          <IconButton
                            onClick={() => onDeletePackagingMachine(machine.id)}
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

        {selectedPackagingMachines.length > 0 && (
          <Paper sx={{ p: 2, mt: 3, backgroundColor: "#e8f5e8" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Packaging Machines ({selectedPackagingMachines.length}):
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedPackagingMachines.map((machine) => (
                <Chip
                  key={machine.id}
                  label={`${machine.name} (${machine.categoryName})`}
                  size="small"
                  color={isAutoSelected(machine.id) ? "warning" : "success"}
                  variant="outlined"
                  sx={{
                    backgroundColor: isAutoSelected(machine.id)
                      ? "#fff3cd"
                      : "#e8f5e8",
                  }}
                />
              ))}
            </Box>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};
