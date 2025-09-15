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
  IconButton,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useMaterialCategories } from "../hooks/use-material-categories";
import { useMaterialTableHeaders } from "../hooks/use-material-table-headers";

interface Material {
  categoryKey: string;
  categoryName: string;
}

interface MaterialValue {
  valueKey: string;
  value: string | number;
}

interface MaterialSize {
  index: number;
  values: MaterialValue[];
}

interface DimensionSet {
  id: string;
  width?: number;
  type?: string;
}

interface SelectedMaterial {
  materialTypeKey: string;
  categoryKey: string;
  sizes: MaterialSize[];
}

interface Step3WideFormatMaterialSelectionProps {
  selectedMaterials: SelectedMaterial[];
  onMaterialsChange: (materials: SelectedMaterial[]) => void;
}

const Step3WideFormatMaterialSelection: React.FC<
  Step3WideFormatMaterialSelectionProps
> = ({ selectedMaterials, onMaterialsChange }) => {
  const { t } = useTranslation();
  const { materials, loading } = useMaterialCategories("wideFormatMaterial");
  const { getDisplayUnit } = useMaterialTableHeaders("wideFormatMaterial");

  // Combine API materials with custom materials from selectedMaterials
  const allMaterials = React.useMemo(() => {
    const apiMaterials = materials || [];
    const customMaterials = selectedMaterials
      .filter((m) => m.materialTypeKey === "wideFormatMaterial")
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
    [key: string]: DimensionSet[];
  }>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialDimensions, setNewMaterialDimensions] = useState<
    DimensionSet[]
  >([
    {
      id: `new-dimension-${Date.now()}-0`,
      width: undefined,
      type: undefined,
    },
  ]);

  // Initialize local state from selectedMaterials only on component mount
  useEffect(() => {
    const wideFormatMaterials = selectedMaterials.filter(
      (m) => m.materialTypeKey === "wideFormatMaterial"
    );
    const dimensions: { [key: string]: DimensionSet[] } = {};

    wideFormatMaterials.forEach((material) => {
      // Only initialize if we don't already have dimensions for this material
      if (!materialDimensions[material.categoryKey]) {
        // Convert sizes array to dimension sets
        const dimensionSets: DimensionSet[] = [];

        material.sizes.forEach((size, index) => {
          const widthValue = size.values.find(
            (v) => v.valueKey === "width"
          )?.value;
          const typeValue = size.values.find(
            (v) => v.valueKey === "type"
          )?.value;

          dimensionSets.push({
            id: `dimension-${Date.now()}-${index}`,
            width: widthValue ? Number(widthValue) : undefined,
            type: typeValue ? String(typeValue) : undefined,
          });
        });

        dimensions[material.categoryKey] = dimensionSets;
      }
    });

    // Only update if we have new dimensions to add
    if (Object.keys(dimensions).length > 0) {
      setMaterialDimensions((prev) => ({ ...prev, ...dimensions }));
    }
  }, []); // Only run on mount

  // Sync selectedMaterials when materialDimensions change (but not the other way around)
  useEffect(() => {
    // Update selectedMaterials based on current materialDimensions
    const updatedMaterials = selectedMaterials.map((material) => {
      if (
        material.materialTypeKey === "wideFormatMaterial" &&
        materialDimensions[material.categoryKey]
      ) {
        const dimensionSets = materialDimensions[material.categoryKey];
        const sizes: MaterialSize[] = [];

        dimensionSets.forEach((dimSet, index) => {
          const values: MaterialValue[] = [];
          if (dimSet.type !== undefined) {
            values.push({ valueKey: "type", value: dimSet.type });
          }
          if (dimSet.width !== undefined) {
            values.push({ valueKey: "width", value: dimSet.width });
          }

          if (values.length > 0) {
            sizes.push({ index, values });
          }
        });

        return {
          ...material,
          sizes,
        };
      }
      return material;
    });

    // Only update if there are actual changes
    const hasChanges =
      JSON.stringify(updatedMaterials) !== JSON.stringify(selectedMaterials);
    if (hasChanges) {
      onMaterialsChange(updatedMaterials);
    }
  }, [materialDimensions]); // Run when materialDimensions change

  const handleMaterialToggle = (material: Material, checked: boolean) => {
    if (checked) {
      // Initialize with one empty dimension set
      const initialDimensions = [
        {
          id: `dimension-${Date.now()}-0`,
          width: undefined,
          type: undefined,
        },
      ];

      setMaterialDimensions((prev) => ({
        ...prev,
        [material.categoryKey]: initialDimensions,
      }));

      const newMaterial: SelectedMaterial = {
        materialTypeKey: "wideFormatMaterial",
        categoryKey: material.categoryKey,
        sizes: [],
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

  const handleDimensionChange = (
    materialId: string,
    dimensionId: string,
    field: "width" | "type",
    value: string | number
  ) => {
    const newDimensions = {
      ...materialDimensions,
      [materialId]: materialDimensions[materialId].map((dim) =>
        dim.id === dimensionId ? { ...dim, [field]: value } : dim
      ),
    };
    setMaterialDimensions(newDimensions);
  };

  const addDimensionSet = (materialId: string) => {
    const currentDimensions = materialDimensions[materialId] || [];
    const newDimensionSet: DimensionSet = {
      id: `dimension-${Date.now()}`,
      width: undefined,
      type: undefined,
    };

    const newDimensions = {
      ...materialDimensions,
      [materialId]: [...currentDimensions, newDimensionSet],
    };
    setMaterialDimensions(newDimensions);
  };

  const removeDimensionSet = (materialId: string, dimensionId: string) => {
    const newDimensions = {
      ...materialDimensions,
      [materialId]: materialDimensions[materialId].filter(
        (dim) => dim.id !== dimensionId
      ),
    };
    setMaterialDimensions(newDimensions);
  };

  const isMaterialSelected = (materialId: string) => {
    return selectedMaterials.some((m) => m.categoryKey === materialId);
  };

  const addNewMaterialDimensionSet = () => {
    const newDimensionSet: DimensionSet = {
      id: `new-dimension-${Date.now()}`,
      width: undefined,
      type: undefined,
    };
    setNewMaterialDimensions((prev) => [...prev, newDimensionSet]);
  };

  const removeNewMaterialDimensionSet = (dimensionId: string) => {
    setNewMaterialDimensions((prev) =>
      prev.filter((dim) => dim.id !== dimensionId)
    );
  };

  const handleNewMaterialDimensionChange = (
    dimensionId: string,
    field: "width" | "type",
    value: string | number
  ) => {
    setNewMaterialDimensions((prev) =>
      prev.map((dim) =>
        dim.id === dimensionId ? { ...dim, [field]: value } : dim
      )
    );
  };

  const handleAddNewMaterial = () => {
    if (!newMaterialName.trim()) return;

    // Convert dimension sets to sizes
    const sizes: MaterialSize[] = [];
    newMaterialDimensions.forEach((dimSet, index) => {
      const values: MaterialValue[] = [];
      if (dimSet.type !== undefined) {
        values.push({ valueKey: "type", value: dimSet.type });
      }
      if (dimSet.width !== undefined) {
        values.push({ valueKey: "width", value: dimSet.width });
      }

      if (values.length > 0) {
        sizes.push({ index, values });
      }
    });

    const newMaterial: SelectedMaterial = {
      materialTypeKey: "wideFormatMaterial",
      categoryKey: newMaterialName.trim(),
      sizes,
    };

    onMaterialsChange([...selectedMaterials, newMaterial]);

    // Update local dimensions
    setMaterialDimensions((prev) => ({
      ...prev,
      [newMaterialName.trim()]: newMaterialDimensions,
    }));

    // Reset form and close dialog
    setNewMaterialName("");
    setNewMaterialDimensions([
      {
        id: `new-dimension-${Date.now()}-0`,
        width: undefined,
        type: undefined,
      },
    ]);
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
        {t("Wide Format Material")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        {t(
          "Select the wide format materials you use and specify their type and width."
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
                    <Box
                      sx={{
                        maxHeight: "165px",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "#f1f1f1",
                          borderRadius: "3px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#c1c1c1",
                          borderRadius: "3px",
                          "&:hover": {
                            backgroundColor: "#a8a8a8",
                          },
                        },
                      }}
                    >
                      {(materialDimensions[material.categoryKey] || []).map(
                        (dimensionSet, index) => (
                          <Box key={dimensionSet.id} sx={{ mb: 1.5 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  minWidth: "60px",
                                }}
                              >
                                {t("Set")} {index + 1}:
                              </Typography>
                              {(materialDimensions[material.categoryKey] || [])
                                .length > 1 && (
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeDimensionSet(
                                      material.categoryKey,
                                      dimensionSet.id
                                    );
                                  }}
                                  sx={{
                                    p: 0.5,
                                    color: "error.main",
                                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    "&:hover": {
                                      backgroundColor: "rgba(244, 67, 54, 0.2)",
                                      color: "error.dark",
                                    },
                                  }}
                                >
                                  ✕
                                </IconButton>
                              )}
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <TextField
                                label={t("Type")}
                                size="small"
                                value={dimensionSet.type || ""}
                                onChange={(e) =>
                                  handleDimensionChange(
                                    material.categoryKey,
                                    dimensionSet.id,
                                    "type",
                                    e.target.value
                                  )
                                }
                                fullWidth
                                onClick={(e) => e.stopPropagation()}
                              />
                              <TextField
                                label={t(`Width${getDisplayUnit("width")}`)}
                                type="number"
                                size="small"
                                value={dimensionSet.width || ""}
                                onChange={(e) =>
                                  handleDimensionChange(
                                    material.categoryKey,
                                    dimensionSet.id,
                                    "width",
                                    Number(e.target.value)
                                  )
                                }
                                fullWidth
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Box>
                          </Box>
                        )
                      )}
                    </Box>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        addDimensionSet(material.categoryKey);
                      }}
                      sx={{
                        mt: 1,
                        fontSize: "0.75rem",
                        textTransform: "none",
                        color: "primary.main",
                        "&:hover": {
                          backgroundColor: "primary.light",
                          color: "white",
                        },
                      }}
                    >
                      {t("Add Dimensions")}
                    </Button>
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
        <DialogTitle>{t("Add New Wide Format Material")}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label={t("Material Name")}
              value={newMaterialName}
              onChange={(e) => setNewMaterialName(e.target.value)}
              fullWidth
              required
            />

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              {t("Dimensions")}
            </Typography>

            <Box
              sx={{
                maxHeight: "200px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#c1c1c1",
                  borderRadius: "3px",
                  "&:hover": {
                    backgroundColor: "#a8a8a8",
                  },
                },
              }}
            >
              {newMaterialDimensions.map((dimensionSet, index) => (
                <Box key={dimensionSet.id} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", minWidth: "60px" }}
                    >
                      {t("Set")} {index + 1}:
                    </Typography>
                    {newMaterialDimensions.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          removeNewMaterialDimensionSet(dimensionSet.id)
                        }
                        sx={{
                          p: 0.5,
                          color: "error.main",
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          "&:hover": {
                            backgroundColor: "rgba(244, 67, 54, 0.2)",
                            color: "error.dark",
                          },
                        }}
                      >
                        ✕
                      </IconButton>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      label={t("Type")}
                      size="small"
                      value={dimensionSet.type || ""}
                      onChange={(e) =>
                        handleNewMaterialDimensionChange(
                          dimensionSet.id,
                          "type",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                    <TextField
                      label={t(`Width${getDisplayUnit("width")}`)}
                      type="number"
                      size="small"
                      value={dimensionSet.width || ""}
                      onChange={(e) =>
                        handleNewMaterialDimensionChange(
                          dimensionSet.id,
                          "width",
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addNewMaterialDimensionSet}
              sx={{
                mt: 1,
                fontSize: "0.75rem",
                textTransform: "none",
                color: "primary.main",
                "&:hover": { backgroundColor: "primary.light", color: "white" },
              }}
            >
              {t("Add Dimensions")}
            </Button>
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

export { Step3WideFormatMaterialSelection };
