import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Checkbox,
  TextField,
  FormControlLabel,
} from "@mui/material";
import { useMaterialCategories } from "../hooks/use-material-categories";

interface Material {
  categoryKey: string;
  categoryName: string;
}

interface SelectedMaterial {
  id: string;
  name: string;
  category: string;
  width?: number;
  length?: number;
  type?: string;
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
  const [materialDimensions, setMaterialDimensions] = useState<{
    [key: string]: { width?: number };
  }>({});

  const handleMaterialToggle = (material: Material, checked: boolean) => {
    if (checked) {
      const newMaterial: SelectedMaterial = {
        id: material.categoryKey,
        name: material.categoryName,
        category: "roll-printing",
        width: materialDimensions[material.categoryKey]?.width,
      };
      onMaterialsChange([...selectedMaterials, newMaterial]);
    } else {
      onMaterialsChange(
        selectedMaterials.filter((m) => m.id !== material.categoryKey)
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
      if (material.id === materialId) {
        return {
          ...material,
          width: value,
        };
      }
      return material;
    });
    onMaterialsChange(updatedMaterials);
  };

  const isMaterialSelected = (materialId: string) => {
    return selectedMaterials.some((m) => m.id === materialId);
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
        {materials?.map((material) => (
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
    </Box>
  );
};

export { Step2RollPrintingSelection };
