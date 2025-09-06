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
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {
  FinishingCategory,
  SelectedFinishingMachine,
} from "@/widgets/quick-setup/on-boarding-setup/types";

interface Step2FinishingSelectionProps {
  finishingCategories: FinishingCategory[];
  selectedFinishingMachines: SelectedFinishingMachine[];
  selectedCategoryMachines: { [categoryId: string]: string };
  onAddFinishingMachine: (categoryId: string) => void;
  onDeleteFinishingMachine: (machineId: string) => void;
  onCategoryMachineChange: (categoryId: string, machineName: string) => void;
  onAddNewMachine?: (categoryId: string, machineName: string) => void;
  autoSelectedMachines?: SelectedFinishingMachine[]; // New prop for auto-selected machines
}

export const Step2FinishingSelection: React.FC<
  Step2FinishingSelectionProps
> = ({
  finishingCategories,
  selectedFinishingMachines,
  selectedCategoryMachines,
  onAddFinishingMachine,
  onDeleteFinishingMachine,
  onCategoryMachineChange,
  onAddNewMachine,
  autoSelectedMachines = [],
}) => {
  const { t } = useTranslation();
  const [searchTerms, setSearchTerms] = useState<{
    [categoryId: string]: string;
  }>({});

  const clearCategorySelection = (categoryId: string) => {
    onCategoryMachineChange(categoryId, "");
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

  const handleAddNewMachine = (categoryId: string) => {
    const searchTerm = searchTerms[categoryId];
    if (searchTerm && onAddNewMachine) {
      onAddNewMachine(categoryId, searchTerm);
      // Clear the search term after adding
      setSearchTerms((prev) => ({
        ...prev,
        [categoryId]: "",
      }));
    }
  };

  // Helper function to check if a machine is auto-selected
  const isAutoSelected = (machineId: string): boolean => {
    return autoSelectedMachines.some((machine) => machine.id === machineId);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Finishing Categories
          </Typography>

          {finishingCategories.map((category) => {
            const filteredMachines = getFilteredMachines(category);
            const searchTerm = searchTerms[category.id] || "";
            const hasSearchTerm = searchTerm.length > 0;
            const hasNoResults = hasSearchTerm && filteredMachines.length === 0;

            return (
              <Paper
                key={category.id}
                sx={{ p: 3, mb: 3, border: "1px solid #e0e0e0" }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  {t(category.name)}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    alignItems: "flex-end",
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel>search for your machine</InputLabel>
                    <Select
                      value={selectedCategoryMachines[category.id] || ""}
                      onChange={(e) =>
                        onCategoryMachineChange(category.id, e.target.value)
                      }
                      label="search for your machine"
                      input={<OutlinedInput label="search for your machine" />}
                      sx={{
                        borderBottom: '2px solid #e0e0e0',
                        '&:hover': {
                          borderBottom: '2px solid #bdbdbd',
                        },
                        '&.Mui-focused': {
                          borderBottom: '2px solid #1976d2',
                        },
                        '& .MuiOutlinedInput-root': {
                          borderBottom: '2px solid #e0e0e0',
                          '&:hover': {
                            borderBottom: '2px solid #bdbdbd',
                          },
                          '&.Mui-focused': {
                            borderBottom: '2px solid #1976d2',
                          },
                        },
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          {selectedCategoryMachines[category.id] && (
                            <IconButton
                              onClick={() =>
                                clearCategorySelection(category.id)
                              }
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
                          placeholder="search for your machine"
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

                      {filteredMachines.map((machine) => (
                        <MenuItem
                          key={machine.id}
                          value={machine.model}
                          sx={{ py: 1, fontSize: "14px" }}
                        >
                          {machine.manufacturer} - {machine.model}
                        </MenuItem>
                      ))}

                      {hasNoResults && onAddNewMachine && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <MenuItem
                            onClick={() => handleAddNewMachine(category.id)}
                            sx={{
                              py: 1,
                              fontSize: "14px",
                              color: "primary.main",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AddIcon fontSize="small" />
                            Add new machine "{searchTerm}"
                          </MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    onClick={() => onAddFinishingMachine(category.id)}
                    disabled={!selectedCategoryMachines[category.id]}
                    sx={{ minWidth: 100 }}
                  >
                    Add
                  </Button>
                </Box>

                {/* Selected machines list */}
                {selectedFinishingMachines.filter(
                  (machine) => machine.categoryId === category.id
                ).length > 0 && (
                  <Box>
                    {selectedFinishingMachines
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
                              onClick={() =>
                                onDeleteFinishingMachine(machine.id)
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
            );
          })}
        </Box>

        {selectedFinishingMachines.length > 0 && (
          <Paper sx={{ p: 2, mt: 3, backgroundColor: "#e8f5e8" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Finishing Machines ({selectedFinishingMachines.length}):
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedFinishingMachines.map((machine) => (
                <Chip
                  key={machine.id}
                  label={`${machine.name} (${machine.categoryName})`}
                  size="small"
                  color={isAutoSelected(machine.id) ? "warning" : "success"}
                  variant="outlined"
                  sx={{
                    backgroundColor: isAutoSelected(machine.id)
                      ? "#fff3cd"
                      : undefined,
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
