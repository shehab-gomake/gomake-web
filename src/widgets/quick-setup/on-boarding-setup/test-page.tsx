import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { adminGetAllMachineByCategory } from "@/services/api-service/machines/admin-machines";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Machine {
  id: string;
  manufacturer: string;
  model: string;
  nickName?: string;
  category: string;
}

interface SelectedMachine {
  id: string;
  name: string;
  category: string;
  categoryName: string;
}

const TestPage: React.FC = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const categories = useRecoilValue(machineCategoriesState);

  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMachine, setSelectedMachine] = useState<string>("");
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachines, setSelectedMachines] = useState<SelectedMachine[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [machinesLoading, setMachinesLoading] = useState(false);

  // Load machines when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadMachinesByCategory(selectedCategory);
    } else {
      setMachines([]);
    }
    setSelectedMachine("");
  }, [selectedCategory]);

  const loadMachinesByCategory = async (categoryId: string) => {
    setMachinesLoading(true);
    try {
      const callBack = (res: any) => {
        if (res.success) {
          let machinesData: Machine[] = [];

          // Handle different possible response structures
          if (res.data?.data?.data) {
            machinesData = res.data.data.data;
          } else if (res.data?.data) {
            machinesData = res.data.data;
          } else if (Array.isArray(res.data)) {
            machinesData = res.data;
          }

          setMachines(machinesData);
          console.log(
            `Loaded ${machinesData.length} machines for category ${categoryId}`
          );
        } else {
          console.error("Failed to load machines:", res);
        }
        setMachinesLoading(false);
      };

      await adminGetAllMachineByCategory(callApi, callBack, categoryId);
    } catch (error) {
      console.error("Error loading machines:", error);
      setMachinesLoading(false);
    }
  };

  const handleAddMachine = () => {
    if (!selectedMachine || !selectedCategory) {
      return;
    }

    const machine = machines.find((m) => m.id === selectedMachine);
    const category = categories.find((c) => c.id === selectedCategory);

    if (machine && category) {
      const newSelectedMachine: SelectedMachine = {
        id: machine.id,
        name: machine.nickName || `${machine.manufacturer} - ${machine.model}`,
        category: category.id,
        categoryName: t(category.name),
      };

      // Check if machine is already in the list
      const isDuplicate = selectedMachines.some((m) => m.id === machine.id);
      if (!isDuplicate) {
        setSelectedMachines([...selectedMachines, newSelectedMachine]);
        setSelectedMachine("");
      }
    }
  };

  const handleDeleteMachine = (machineId: string) => {
    setSelectedMachines(selectedMachines.filter((m) => m.id !== machineId));
  };

  const handleSave = () => {
    console.log("Selected machines:", selectedMachines);
    // Here you can add additional logic like API calls to save the selected machines
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Quick Setup - Test Page
      </Typography>

      {/* Main Content - Previously Modal Content */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* <Typography variant="h6" sx={{ mb: 3 }}>
          {t("quickSetup.selectMachines")}
        </Typography> */}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("quickSetup.addYourMachines")}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {/* Category Selection */}
            <FormControl fullWidth>
              <InputLabel>{t("machineAttributes.category")}</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label={t("machineAttributes.category")}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {t(category.name)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Machine Selection */}
            <FormControl fullWidth>
              <InputLabel>{t("machineAttributes.machine")}</InputLabel>
              <Select
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                label={t("machineAttributes.machine")}
                disabled={!selectedCategory || machinesLoading}
              >
                {machinesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t("common.loading")}
                  </MenuItem>
                ) : (
                  machines.map((machine) => (
                    <MenuItem key={machine.id} value={machine.id}>
                      {machine.nickName ||
                        `${machine.manufacturer} - ${machine.model}`}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            onClick={handleAddMachine}
            disabled={!selectedMachine || !selectedCategory}
            sx={{ mb: 2 }}
          >
            {t("navigationButtons.add")}
          </Button>

          {selectedMachines.length > 0 && (
            <Typography variant="body2" color="success.main">
              {t("quickSetup.loadedMachines", {
                count: selectedMachines.length,
              })}
            </Typography>
          )}
        </Box>

        {/* Selected Machines List */}
        {selectedMachines.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("quickSetup.selectedMachines")}
            </Typography>

            <List>
              {selectedMachines.map((machine) => (
                <ListItem
                  key={machine.id}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    mb: 1,
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
                      onClick={() => handleDeleteMachine(machine.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={selectedMachines.length === 0}
          >
            {t("common.save")}
          </Button>
        </Box>
      </Paper>

      {/* Display selected machines summary */}
      {selectedMachines.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("quickSetup.selectedMachines")} ({selectedMachines.length})
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedMachines.map((machine) => (
              <Chip
                key={machine.id}
                label={`${machine.name} (${machine.categoryName})`}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TestPage;
