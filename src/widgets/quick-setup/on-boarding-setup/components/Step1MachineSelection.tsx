import React, { useState, useEffect, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  keyframes,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {
  Machine,
  SelectedMachine,
} from "@/widgets/quick-setup/on-boarding-setup/types";
import { pulseAnimation } from "@/widgets/quick-setup/on-boarding-setup/animations";

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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [pendingMachineName, setPendingMachineName] = useState("");
  const [machineSelectOpen, setMachineSelectOpen] = useState(false);
  const [categorySelectOpen, setCategorySelectOpen] = useState(false);
  const [modalCategorySelectOpen, setModalCategorySelectOpen] = useState(false);

  // Refs for auto-focusing TextFields
  const machineSearchRef = useRef<HTMLInputElement>(null);
  const categorySearchRef = useRef<HTMLInputElement>(null);
  const modalCategorySearchRef = useRef<HTMLInputElement>(null);

  // Filter machines based on search term
  useEffect(() => {
    if (machineSearchTerm) {
      const filtered = allMachines.filter((machine) => {
        const machineName =
          machine.manufacturer && machine.model
            ? `${machine.manufacturer} - ${machine.model}`
            : machine.nickName || "";
        return machineName
          .toLowerCase()
          .includes(machineSearchTerm.toLowerCase());
      });
      setMachines(filtered);
    } else {
      setMachines(allMachines);
    }
  }, [machineSearchTerm, allMachines]);

  // Auto-focus TextFields when dropdowns open
  useEffect(() => {
    if (machineSelectOpen) {
      setTimeout(() => {
        machineSearchRef.current?.focus();
      }, 100);
    }
  }, [machineSelectOpen]);

  useEffect(() => {
    if (categorySelectOpen) {
      setTimeout(() => {
        categorySearchRef.current?.focus();
      }, 100);
    }
  }, [categorySelectOpen]);

  useEffect(() => {
    if (modalCategorySelectOpen) {
      setTimeout(() => {
        modalCategorySearchRef.current?.focus();
      }, 100);
    }
  }, [modalCategorySelectOpen]);

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
    if (machineSearchTerm) {
      setPendingMachineName(machineSearchTerm);
      setShowCategoryModal(true);
    }
  };

  const handleCategoryModalConfirm = () => {
    if (pendingMachineName && selectedCategory && onAddNewMachine) {
      onAddNewMachine(selectedCategory, pendingMachineName);
      // Clear the search term and close modal after adding
      setMachineSearchTerm("");
      setSelectedMachine("");
      setSelectedCategory("");
      setCategorySearchTerm("");
      setPendingMachineName("");
      setShowCategoryModal(false);
    }
  };

  const handleCategoryModalCancel = () => {
    setShowCategoryModal(false);
    setPendingMachineName("");
    setSelectedCategory("");
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
  const canAddNewMachine = hasNoResults && onAddNewMachine;

  return (
    <Paper sx={{ p: 2, mb: 1 }}>
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        {t("quickSetup.addYourMachines")}
      </Typography> */}

      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-end" }}>
        {/* Machine Selection */}
        <FormControl fullWidth>
          <InputLabel>search for your machine</InputLabel>
          <Select
            value={selectedMachine}
            onChange={(e) => handleMachineChange(e.target.value)}
            label="search for your machine"
            input={<OutlinedInput label="search for your machine" />}
            open={machineSelectOpen}
            onOpen={() => setMachineSelectOpen(true)}
            onClose={() => {
              setMachineSelectOpen(false);
              setMachineSearchTerm("");
            }}
            sx={{
              borderBottom: "2px solid #e0e0e0",
              "&:hover": {
                borderBottom: "2px solid #bdbdbd",
              },
              "&.Mui-focused": {
                borderBottom: "2px solid #1976d2",
              },
              "& .MuiOutlinedInput-root": {
                borderBottom: "2px solid #e0e0e0",
                "&:hover": {
                  borderBottom: "2px solid #bdbdbd",
                },
                "&.Mui-focused": {
                  borderBottom: "2px solid #1976d2",
                },
              },
            }}
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
              PaperProps: {
                style: {
                  maxHeight: 300,
                  padding: 0,
                },
                sx: {
                  "& .MuiList-root": {
                    paddingTop: 0,
                  },
                },
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
            }}
          >
            {/* Search TextField positioned above options */}
            <Box
              sx={{
                p: 1,
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
              }}
            >
              <TextField
                inputRef={machineSearchRef}
                placeholder="search for your machine"
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
                    backgroundColor: "white",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#bdbdbd",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
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
            </Box>

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
                  {machine.manufacturer && machine.model
                    ? `${machine.manufacturer} - ${machine.model}`
                    : machine.nickName || "Unknown Machine"}
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
                  Add new machine "{machineSearchTerm}"
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
            open={categorySelectOpen}
            onOpen={() => setCategorySelectOpen(true)}
            onClose={() => {
              setCategorySelectOpen(false);
              setCategorySearchTerm("");
            }}
            sx={{
              borderBottom: "2px solid #e0e0e0",
              "&:hover": {
                borderBottom: "2px solid #bdbdbd",
              },
              "&.Mui-focused": {
                borderBottom: "2px solid #1976d2",
              },
              "& .MuiOutlinedInput-root": {
                borderBottom: "2px solid #e0e0e0",
                "&:hover": {
                  borderBottom: "2px solid #bdbdbd",
                },
                "&.Mui-focused": {
                  borderBottom: "2px solid #1976d2",
                },
              },
            }}
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
              PaperProps: {
                style: {
                  maxHeight: 300,
                  padding: 0,
                },
                sx: {
                  "& .MuiList-root": {
                    paddingTop: 0,
                  },
                },
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
            }}
          >
            {/* Search TextField positioned above options */}
            <Box
              sx={{
                p: 1,
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
              }}
            >
              <TextField
                inputRef={categorySearchRef}
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
                    backgroundColor: "white",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#bdbdbd",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
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
            </Box>

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
          // startIcon={<AddIcon />}
          sx={{
            minWidth: 120,
            height: 40,
            fontSize: "14px",
            px: 3,
            ...(selectedMachine &&
              selectedCategory && {
                animation: `${pulseAnimation} 1.5s infinite`,
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }),
          }}
        >
          {t("navigationButtons.add")}
        </Button>
      </Box>

      {/* Help text for adding new machines */}
      {hasNoResults && (
        <Typography variant="body2" color="info.main" sx={{ mb: 2 }}>
          💡 No machines found. Click the "Add new machine" option in the
          dropdown above to add "{machineSearchTerm}"
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

      {/* Category Selection Modal */}
      <Dialog
        open={showCategoryModal}
        onClose={handleCategoryModalCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Category for "{pendingMachineName}"</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Please select a category for the new machine "{pendingMachineName}"
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{t("machineAttributes.category")}</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label={t("machineAttributes.category")}
              input={<OutlinedInput label={t("machineAttributes.category")} />}
              open={modalCategorySelectOpen}
              onOpen={() => setModalCategorySelectOpen(true)}
              onClose={() => {
                setModalCategorySelectOpen(false);
                setCategorySearchTerm("");
              }}
              sx={{
                borderBottom: "2px solid #e0e0e0",
                "&:hover": {
                  borderBottom: "2px solid #bdbdbd",
                },
                "&.Mui-focused": {
                  borderBottom: "2px solid #1976d2",
                },
                "& .MuiOutlinedInput-root": {
                  borderBottom: "2px solid #e0e0e0",
                  "&:hover": {
                    borderBottom: "2px solid #bdbdbd",
                  },
                  "&.Mui-focused": {
                    borderBottom: "2px solid #1976d2",
                  },
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    padding: 0,
                  },
                  sx: {
                    "& .MuiList-root": {
                      paddingTop: 0,
                    },
                  },
                },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
            >
              {/* Search TextField positioned above options */}
              <Box
                sx={{
                  p: 1,
                  borderBottom: "1px solid #e0e0e0",
                  backgroundColor: "#fafafa",
                }}
              >
                <TextField
                  inputRef={modalCategorySearchRef}
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
                      backgroundColor: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#bdbdbd",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                      },
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
              </Box>

              {filterCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {t(category.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCategoryModalCancel} color="inherit">
            {t("navigationButtons.cancel")}
          </Button>
          <Button
            onClick={handleCategoryModalConfirm}
            variant="contained"
            disabled={!selectedCategory}
          >
            {t("navigationButtons.add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
