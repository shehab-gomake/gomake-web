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

interface Step4FlatbedsSelectionProps {
  selectedMaterials: SelectedMaterial[];
  onMaterialsChange: (materials: SelectedMaterial[]) => void;
}

const Step4FlatbedsSelection: React.FC<Step4FlatbedsSelectionProps> = ({
  selectedMaterials,
  onMaterialsChange,
}) => {
  const { t } = useTranslation();
  const { materials, loading } = useMaterialCategories("flatbeds");

  // Combine API materials with custom materials from selectedMaterials
  const allMaterials = React.useMemo(() => {
    const apiMaterials = materials || [];
    const customMaterials = selectedMaterials
      .filter((m) => m.materialTypeKey === "flatbeds")
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
  const [materialDetails, setMaterialDetails] = useState<{
    [key: string]: { width?: number; length?: number; type?: string };
  }>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialType, setNewMaterialType] = useState("");
  const [newMaterialWidth, setNewMaterialWidth] = useState<number | "">("");
  const [newMaterialLength, setNewMaterialLength] = useState<number | "">("");

  // Initialize local state from selectedMaterials when component mounts or selectedMaterials changes
  useEffect(() => {
    const flatbedsMaterials = selectedMaterials.filter(
      (m) => m.materialTypeKey === "flatbeds"
    );
    const details: {
      [key: string]: { width?: number; length?: number; type?: string };
    } = {};

    flatbedsMaterials.forEach((material) => {
      const widthValue = material.values.find(
        (v) => v.valueKey === "width"
      )?.value;
      const lengthValue = material.values.find(
        (v) => v.valueKey === "length"
      )?.value;
      const typeValue = material.values.find(
        (v) => v.valueKey === "type"
      )?.value;

      details[material.categoryKey] = {
        width: widthValue ? Number(widthValue) : undefined,
        length: lengthValue ? Number(lengthValue) : undefined,
        type: typeValue ? String(typeValue) : undefined,
      };
    });

    setMaterialDetails(details);
  }, [selectedMaterials]);

  const handleMaterialToggle = (material: Material, checked: boolean) => {
    if (checked) {
      const newMaterial: SelectedMaterial = {
        materialTypeKey: "flatbeds",
        categoryKey: material.categoryKey,
        values: [
          {
            valueKey: "type",
            value: materialDetails[material.categoryKey]?.type || "",
          },
          {
            valueKey: "width",
            value: materialDetails[material.categoryKey]?.width || "",
          },
          {
            valueKey: "length",
            value: materialDetails[material.categoryKey]?.length || "",
          },
        ],
      };
      onMaterialsChange([...selectedMaterials, newMaterial]);
    } else {
      onMaterialsChange(
        selectedMaterials.filter((m) => m.categoryKey !== material.categoryKey)
      );
      // Remove details for this material
      const newDetails = { ...materialDetails };
      delete newDetails[material.categoryKey];
      setMaterialDetails(newDetails);
    }
  };

  const handleDetailChange = (
    materialId: string,
    field: "width" | "length" | "type",
    value: string | number
  ) => {
    const newDetails = {
      ...materialDetails,
      [materialId]: {
        ...materialDetails[materialId],
        [field]: value,
      },
    };
    setMaterialDetails(newDetails);

    // Update the selected material with new details
    const updatedMaterials = selectedMaterials.map((material) => {
      if (material.categoryKey === materialId) {
        return {
          ...material,
          values: material.values.map((val) =>
            val.valueKey === field ? { ...val, value } : val
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
      materialTypeKey: "flatbeds",
      categoryKey: newMaterialName.trim(),
      values: [
        {
          valueKey: "type",
          value: newMaterialType || "",
        },
        {
          valueKey: "width",
          value: newMaterialWidth || "",
        },
        {
          valueKey: "length",
          value: newMaterialLength || "",
        },
      ],
    };

    onMaterialsChange([...selectedMaterials, newMaterial]);

    // Update local details
    setMaterialDetails((prev) => ({
      ...prev,
      [newMaterialName.trim()]: {
        type: newMaterialType || undefined,
        width: newMaterialWidth ? Number(newMaterialWidth) : undefined,
        length: newMaterialLength ? Number(newMaterialLength) : undefined,
      },
    }));

    // Reset form and close dialog
    setNewMaterialName("");
    setNewMaterialType("");
    setNewMaterialWidth("");
    setNewMaterialLength("");
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
        {t("Flatbeds Materials")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        {t(
          "Select the flatbed materials you use and specify their type, width, and length."
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
                  <Box
                    sx={{
                      mt: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <TextField
                      label={t("Type")}
                      size="small"
                      value={materialDetails[material.categoryKey]?.type || ""}
                      onChange={(e) =>
                        handleDetailChange(
                          material.categoryKey,
                          "type",
                          e.target.value
                        )
                      }
                      fullWidth
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        label={t("Width (mm)")}
                        type="number"
                        size="small"
                        value={
                          materialDetails[material.categoryKey]?.width || ""
                        }
                        onChange={(e) =>
                          handleDetailChange(
                            material.categoryKey,
                            "width",
                            Number(e.target.value)
                          )
                        }
                        fullWidth
                        onClick={(e) => e.stopPropagation()}
                      />
                      <TextField
                        label={t("Length (mm)")}
                        type="number"
                        size="small"
                        value={
                          materialDetails[material.categoryKey]?.length || ""
                        }
                        onChange={(e) =>
                          handleDetailChange(
                            material.categoryKey,
                            "length",
                            Number(e.target.value)
                          )
                        }
                        fullWidth
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
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
        <DialogTitle>{t("Add New Flatbed Material")}</DialogTitle>
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
              label={t("Type")}
              value={newMaterialType}
              onChange={(e) => setNewMaterialType(e.target.value)}
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 1 }}>
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
              <TextField
                label={t("Length (mm)")}
                type="number"
                value={newMaterialLength}
                onChange={(e) =>
                  setNewMaterialLength(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                fullWidth
              />
            </Box>
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

export { Step4FlatbedsSelection };
