import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { adminGetAllMachineByCategory } from "@/services/api-service/machines/admin-machines";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  Typography,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useModal } from "@/hooks/use-modal";

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

interface QuickSetupModalNewProps {
  open: boolean;
  onClose: () => void;
  onSave?: (machines: SelectedMachine[]) => void;
}

const QuickSetupModalNew: React.FC<QuickSetupModalNewProps> = ({
  open,
  onClose,
  onSave,
}) => {
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
    if (onSave) {
      onSave(selectedMachines);
    }
    onClose();
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? t(category.name) : categoryId;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("quickSetup.selectMachines")}</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("quickSetup.addNewMachine")}
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
            {t("common.add")}
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={selectedMachines.length === 0}
        >
          {t("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickSetupModalNew;

