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
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

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
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [selectedMachines, setSelectedMachines] = useState<SelectedMachine[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [machinesLoading, setMachinesLoading] = useState(false);
  const [machineSearchTerm, setMachineSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  // Load all machines on component mount
  useEffect(() => {
    loadAllMachines();
  }, []);

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

  const loadAllMachines = async () => {
    setMachinesLoading(true);
    try {
      // Load machines for all categories
      const allMachinesData: Machine[] = [];

      for (const category of categories) {
        const callBack = (res: any) => {
          if (res.success) {
            let machinesData: Machine[] = [];

            if (res.data?.data?.data) {
              machinesData = res.data.data.data;
            } else if (res.data?.data) {
              machinesData = res.data.data;
            } else if (Array.isArray(res.data)) {
              machinesData = res.data;
            }

            allMachinesData.push(...machinesData);
          }
        };

        await adminGetAllMachineByCategory(callApi, callBack, category.id);
      }

      setAllMachines(allMachinesData);
      setMachines(allMachinesData);
      setMachinesLoading(false);
    } catch (error) {
      console.error("Error loading machines:", error);
      setMachinesLoading(false);
    }
  };

  const loadMachinesByCategory = async (categoryId: string) => {
    setMachinesLoading(true);
    try {
      const callBack = (res: any) => {
        if (res.success) {
          let machinesData: Machine[] = [];

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

  const handleMachineChange = (machineId: string) => {
    setSelectedMachine(machineId);

    // Find the machine and set its category as default
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
        setSelectedCategory("");
        setMachineSearchTerm("");
        setCategorySearchTerm("");
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

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    t(category.name).toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Quick Setup - Test Page
      </Typography>

      {/* Main Content - Previously Modal Content */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("quickSetup.addYourMachines")}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {/* Machine Selection - Now First */}
            <FormControl fullWidth>
              <InputLabel>{t("machineAttributes.machineName")}</InputLabel>
              <Select
                value={selectedMachine}
                onChange={(e) => handleMachineChange(e.target.value)}
                label={t("machineAttributes.machineName")}
                input={
                  <OutlinedInput label={t("machineAttributes.machineName")} />
                }
                endAdornment={
                  <InputAdornment position="end">
                    {selectedMachine && (
                      <IconButton
                        onClick={clearMachineSelection}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
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
                    {t("common.loading")}
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
              </Select>
            </FormControl>

            {/* Category Selection - Now Second */}
            <FormControl fullWidth>
              <InputLabel>{t("machineAttributes.category")}</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label={t("machineAttributes.category")}
                input={
                  <OutlinedInput label={t("machineAttributes.category")} />
                }
                endAdornment={
                  <InputAdornment position="end">
                    {selectedCategory && (
                      <IconButton
                        onClick={clearCategorySelection}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
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
                {filteredCategories.map((category) => (
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
