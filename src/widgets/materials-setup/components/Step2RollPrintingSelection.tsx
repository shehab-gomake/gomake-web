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
  const { materials, loading } = useMaterialCategories("roll");
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

      <Grid container spacing={2}>
        {materials?.map((material) => (
          <Grid item xs={12} sm={6} md={4} key={material.categoryKey}>
            <Card
              sx={{
                border: isMaterialSelected(material.categoryKey)
                  ? "2px solid"
                  : "1px solid",
                borderColor: isMaterialSelected(material.categoryKey)
                  ? "primary.main"
                  : "divider",
                backgroundColor: isMaterialSelected(material.categoryKey)
                  ? "primary.light"
                  : "background.paper",
              }}
            >
              <CardContent>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isMaterialSelected(material.categoryKey)}
                      onChange={(e) =>
                        handleMaterialToggle(material, e.target.checked)
                      }
                    />
                  }
                  label={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {material.categoryName}
                    </Typography>
                  }
                />

                {isMaterialSelected(material.categoryKey) && (
                  <Box sx={{ mt: 2 }}>
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
