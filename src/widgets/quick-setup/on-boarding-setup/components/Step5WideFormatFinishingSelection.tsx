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

interface Step5WideFormatFinishingSelectionProps {
  wideFormatFinishingCategories: FinishingCategory[];
  selectedWideFormatFinishingMachines: SelectedFinishingMachine[];
  selectedWideFormatFinishingCategoryMachines: { [categoryId: string]: string };
  onAddWideFormatFinishingMachine: (categoryId: string) => void;
  onDeleteWideFormatFinishingMachine: (machineId: string) => void;
  onWideFormatFinishingCategoryMachineChange: (
    categoryId: string,
    machineName: string
  ) => void;
}

export const Step5WideFormatFinishingSelection: React.FC<
  Step5WideFormatFinishingSelectionProps
> = ({
  wideFormatFinishingCategories,
  selectedWideFormatFinishingMachines,
  selectedWideFormatFinishingCategoryMachines,
  onAddWideFormatFinishingMachine,
  onDeleteWideFormatFinishingMachine,
  onWideFormatFinishingCategoryMachineChange,
}) => {
  const { t } = useTranslation();
  const [searchTerms, setSearchTerms] = useState<{
    [categoryId: string]: string;
  }>({});

  const clearCategorySelection = (categoryId: string) => {
    onWideFormatFinishingCategoryMachineChange(categoryId, "");
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

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
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
                {t(category.name)}
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
