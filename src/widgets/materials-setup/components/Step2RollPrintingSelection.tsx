import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Checkbox,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useMaterialCategories } from "../hooks/use-material-categories";

interface Material {
  categoryKey: string;
  categoryName: string;
}

interface MaterialValue {
  valueKey: string;
  value: string | number;
}

interface SelectedMaterial {
  materialTypeKey: string;
  categoryKey: string;
  values: MaterialValue[];
}

interface Step2RollPrintingSelectionProps {
  selectedMaterials: SelectedMaterial[];
  onMaterialsChange: (materials: SelectedMaterial[]) => void;
}

const Step2RollPrintingSelection: React.FC<Step2RollPrintingSelectionProps> = ({
  selectedMaterials,
  onMaterialsChange,
}) => {
  const { t } = useTranslation();
  const { materials, loading } = useMaterialCategories("roll printing");

  // Combine API materials with custom materials from selectedMaterials
  const allMaterials = React.useMemo(() => {
    const apiMaterials = materials || [];
    const customMaterials = selectedMaterials
      .filter((m) => m.materialTypeKey === "roll printing")
      .map((m) => ({
        categoryKey: m.categoryKey,
        categoryName: m.categoryKey, // Use categoryKey as display name for custom materials
      }));

    // Remove duplicates (in case a custom material has the same key as an API material)
    const existingKeys = new Set(apiMaterials.map((m) => m.categoryKey));
    const uniqueCustomMaterials = customMaterials.filter(
      (m) => !existingKeys.has(m.categoryKey)
    );

    return [...apiMaterials, ...uniqueCustomMaterials];
  }, [materials, selectedMaterials]);
  const [materialDimensions, setMaterialDimensions] = useState<{
    [key: string]: { width?: number };
  }>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialWidth, setNewMaterialWidth] = useState<number | "">("");

  // Initialize local state from selectedMaterials when component mounts or selectedMaterials changes
  useEffect(() => {
    const rollMaterials = selectedMaterials.filter(
      (m) => m.materialTypeKey === "roll printing"
    );
    const dimensions: { [key: string]: { width?: number } } = {};

    rollMaterials.forEach((material) => {
      const widthValue = material.values.find(
        (v) => v.valueKey === "width"
      )?.value;

      dimensions[material.categoryKey] = {
        width: widthValue ? Number(widthValue) : undefined,
      };
    });

    setMaterialDimensions(dimensions);
  }, [selectedMaterials]);

  const handleMaterialToggle = (material: Material, checked: boolean) => {
    if (checked) {
      const newMaterial: SelectedMaterial = {
        materialTypeKey: "roll printing",
        categoryKey: material.categoryKey,
        values: [
          {
            valueKey: "width",
            value: materialDimensions[material.categoryKey]?.width || "",
          },
        ],
      };
      onMaterialsChange([...selectedMaterials, newMaterial]);
    } else {
      onMaterialsChange(
        selectedMaterials.filter((m) => m.categoryKey !== material.categoryKey)
      );
      // Remove dimensions for this material
      const newDimensions = { ...materialDimensions };
      delete newDimensions[material.categoryKey];
      setMaterialDimensions(newDimensions);
    }
  };

  const handleWidthChange = (materialId: string, value: number) => {
    const newDimensions = {
      ...materialDimensions,
      [materialId]: {
        ...materialDimensions[materialId],
        width: value,
      },
    };
    setMaterialDimensions(newDimensions);

    // Update the selected material with new width
    const updatedMaterials = selectedMaterials.map((material) => {
      if (material.categoryKey === materialId) {
        return {
          ...material,
          values: material.values.map((val) =>
            val.valueKey === "width" ? { ...val, value } : val
          ),
        };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const isMaterialSelected = (materialId: string) => {
    return selectedMaterials.some((m) => m.categoryKey === materialId);
  };

  const handleAddNewMaterial = () => {
    if (!newMaterialName.trim()) return;

    const newMaterial: SelectedMaterial = {
      materialTypeKey: "roll printing",
      categoryKey: newMaterialName.trim(),
      values: [
        {
          valueKey: "width",
          value: newMaterialWidth || "",
        },
      ],
    };

    onMaterialsChange([...selectedMaterials, newMaterial]);

    // Update local dimensions
    setMaterialDimensions((prev) => ({
      ...prev,
      [newMaterialName.trim()]: {
        width: newMaterialWidth ? Number(newMaterialWidth) : undefined,
      },
    }));

    // Reset form and close dialog
    setNewMaterialName("");
    setNewMaterialWidth("");
    setShowAddDialog(false);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography>{t("Loading materials...")}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t("Roll Printing Department Materials")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        {t(
          "Select the materials you use for roll printing and specify their width."
        )}
      </Typography>

      <Grid container spacing={1.5}>
        {allMaterials?.map((material) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={material.categoryKey}>
            <Card
              sx={{
                border: isMaterialSelected(material.categoryKey)
                  ? "2px solid"
                  : "1px solid",
                borderColor: isMaterialSelected(material.categoryKey)
                  ? "primary.main"
                  : "divider",
                backgroundColor: isMaterialSelected(material.categoryKey)
                  ? "rgba(25, 118, 210, 0.08)"
                  : "background.paper",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 2,
                },
              }}
              onClick={() =>
                handleMaterialToggle(
                  material,
                  !isMaterialSelected(material.categoryKey)
                )
              }
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={isMaterialSelected(material.categoryKey)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleMaterialToggle(material, e.target.checked);
                    }}
                    size="small"
                    sx={{ p: 0.5, mr: 1 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {material.categoryName}
                  </Typography>
                </Box>

                {isMaterialSelected(material.categoryKey) && (
                  <Box sx={{ mt: 1.5 }}>
                    <TextField
                      label={t("Width (mm)")}
                      type="number"
                      size="small"
                      value={
                        materialDimensions[material.categoryKey]?.width || ""
                      }
                      onChange={(e) =>
                        handleWidthChange(
                          material.categoryKey,
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add New Material Button */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setShowAddDialog(true)}
          sx={{ minWidth: 200 }}
        >
          {t("Add New Material")}
        </Button>
      </Box>

      {/* Add Material Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("Add New Roll Material")}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label={t("Material Name")}
              value={newMaterialName}
              onChange={(e) => setNewMaterialName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t("Width (mm)")}
              type="number"
              value={newMaterialWidth}
              onChange={(e) =>
                setNewMaterialWidth(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>{t("Cancel")}</Button>
          <Button
            onClick={handleAddNewMaterial}
            variant="contained"
            disabled={!newMaterialName.trim()}
          >
            {t("Add Material")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { Step2RollPrintingSelection };
