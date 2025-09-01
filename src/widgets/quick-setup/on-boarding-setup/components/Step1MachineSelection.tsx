import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import {
  Box,
  Typography,
  Chip,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  CircularProgress,
  OutlinedInput,
  InputAdornment,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {
  Machine,
  SelectedMachine,
} from "@/widgets/quick-setup/on-boarding-setup/types";

interface Step1MachineSelectionProps {
  allMachines: Machine[];
  machinesLoading: boolean;
  selectedMachines: SelectedMachine[];
  onAddMachine: (machine: Machine, categoryId: string) => void;
  onDeleteMachine: (machineId: string) => void;
  hasDigitalOrOffsetPrinting: boolean;
  onAddNewMachine?: (categoryId: string, machineName: string) => void;
}

export const Step1MachineSelection: React.FC<Step1MachineSelectionProps> = ({
  allMachines,
  machinesLoading,
  selectedMachines,
  onAddMachine,
  onDeleteMachine,
  hasDigitalOrOffsetPrinting,
  onAddNewMachine,
}) => {
  const { t } = useTranslation();
  const categories = useRecoilValue(machineCategoriesState);

  // Local state for machine selection
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMachine, setSelectedMachine] = useState<string>("");
  const [machines, setMachines] = useState<Machine[]>([]);
  const [machineSearchTerm, setMachineSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  // Filter machines based on search term
  useEffect(() => {
    if (machineSearchTerm) {
      const filtered = allMachines.filter((machine) =>
        (machine.nickName || `${machine.manufacturer} - ${machine.model}`)
          .toLowerCase()
          .includes(machineSearchTerm.toLowerCase())
      );
      setMachines(filtered);
    } else {
      setMachines(allMachines);
    }
  }, [machineSearchTerm, allMachines]);

  const handleMachineChange = (machineId: string) => {
    setSelectedMachine(machineId);

    const machine = allMachines.find((m) => m.id === machineId);
    if (machine) {
      setSelectedCategory(machine.category);
    }
  };

  const handleAddMachine = () => {
    if (!selectedMachine || !selectedCategory) {
      return;
    }

    const machine = machines.find((m) => m.id === selectedMachine);
    const category = categories.find((c) => c.id === selectedCategory);

    if (machine && category) {
      const isDuplicate = selectedMachines.some((m) => m.id === machine.id);
      if (!isDuplicate) {
        onAddMachine(machine, selectedCategory);
        setSelectedMachine("");
        setSelectedCategory("");
        setMachineSearchTerm("");
        setCategorySearchTerm("");
      }
    }
  };

  const handleAddNewMachine = () => {
    if (machineSearchTerm && selectedCategory && onAddNewMachine) {
      onAddNewMachine(selectedCategory, machineSearchTerm);
      // Clear the search term after adding
      setMachineSearchTerm("");
      setSelectedMachine("");
      setSelectedCategory("");
      setCategorySearchTerm("");
    }
  };

  const clearMachineSelection = () => {
    setSelectedMachine("");
    setSelectedCategory("");
    setMachineSearchTerm("");
    setCategorySearchTerm("");
  };

  const clearCategorySelection = () => {
    setSelectedCategory("");
    setCategorySearchTerm("");
  };

  const filterCategories = categories.filter((category) =>
    t(category.name).toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const hasNoResults = machineSearchTerm.length > 0 && machines.length === 0;
  const canAddNewMachine = hasNoResults && selectedCategory && onAddNewMachine;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("quickSetup.addYourMachines")}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-end" }}>
        {/* Machine Selection */}
        <FormControl fullWidth>
          <InputLabel>{t("machineAttributes.machineName")}</InputLabel>
          <Select
            value={selectedMachine}
            onChange={(e) => handleMachineChange(e.target.value)}
            label={t("machineAttributes.machineName")}
            input={<OutlinedInput label={t("machineAttributes.machineName")} />}
            endAdornment={
              <InputAdornment position="end">
                {selectedMachine && (
                  <IconButton
                    onClick={clearMachineSelection}
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
                value={machineSearchTerm}
                onChange={(e) => setMachineSearchTerm(e.target.value)}
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
            {machinesLoading ? (
              <MenuItem disabled sx={{ py: 1 }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                {t("general.loading")}
              </MenuItem>
            ) : (
              machines.map((machine) => (
                <MenuItem
                  key={machine.id}
                  value={machine.id}
                  sx={{ py: 1, fontSize: "14px" }}
                >
                  {machine.nickName ||
                    `${machine.manufacturer} - ${machine.model}`}
                </MenuItem>
              ))
            )}

            {canAddNewMachine && (
              <>
                <Divider sx={{ my: 1 }} />
                <MenuItem
                  onClick={handleAddNewMachine}
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
                  Add new machine "{machineSearchTerm}" to{" "}
                  {t(
                    categories.find((c) => c.id === selectedCategory)?.name ||
                      selectedCategory
                  )}
                </MenuItem>
              </>
            )}
          </Select>
        </FormControl>

        {/* Category Selection */}
        <FormControl fullWidth>
          <InputLabel>{t("machineAttributes.category")}</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label={t("machineAttributes.category")}
            input={<OutlinedInput label={t("machineAttributes.category")} />}
            endAdornment={
              <InputAdornment position="end">
                {selectedCategory && (
                  <IconButton
                    onClick={clearCategorySelection}
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
                placeholder="Search categories..."
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
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
            {filterCategories.map((category) => (
              <MenuItem
                key={category.id}
                value={category.id}
                sx={{ py: 1, fontSize: "14px" }}
              >
                {t(category.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleAddMachine}
          disabled={!selectedMachine || !selectedCategory}
          sx={{
            minWidth: 80,
            height: 40,
            fontSize: "14px",
            px: 2,
          }}
        >
          {t("navigationButtons.add")}
        </Button>
      </Box>

      {/* Help text for adding new machines */}
      {hasNoResults && !selectedCategory && (
        <Typography variant="body2" color="info.main" sx={{ mb: 2 }}>
          💡 No machines found. Select a category above to add a new machine "
          {machineSearchTerm}"
        </Typography>
      )}

      {/* Selected Machines List with contained scroll */}
      {selectedMachines.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("quickSetup.selectedMachines")} ({selectedMachines.length})
          </Typography>
          <Box
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor: "#fafafa",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#c1c1c1",
                borderRadius: "4px",
                "&:hover": {
                  background: "#a8a8a8",
                },
              },
            }}
          >
            <List sx={{ py: 0 }}>
              {selectedMachines.map((machine) => (
                <ListItem
                  key={machine.id}
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                    backgroundColor: "#fafafa",
                  }}
                >
                  <ListItemText
                    primary={machine.name}
                    secondary={
                      <Chip
                        label={machine.categoryName}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => onDeleteMachine(machine.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      )}

      {/* Validation Message */}
      {selectedMachines.length > 0 && !hasDigitalOrOffsetPrinting && (
        <Typography variant="body2" color="info.main" sx={{ mt: 2 }}>
          ℹ️ You can proceed to the next step, but finishing machines are only
          available for Digital/Offset printing machines
        </Typography>
      )}
    </Paper>
  );
};
