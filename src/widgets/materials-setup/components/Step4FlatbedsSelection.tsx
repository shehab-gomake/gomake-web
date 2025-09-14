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
  const [materialDetails, setMaterialDetails] = useState<{
    [key: string]: { width?: number; length?: number; type?: string };
  }>({});

  const handleMaterialToggle = (material: Material, checked: boolean) => {
    if (checked) {
      const newMaterial: SelectedMaterial = {
        id: material.categoryKey,
        name: material.categoryName,
        category: "flatbeds",
        width: materialDetails[material.categoryKey]?.width,
        length: materialDetails[material.categoryKey]?.length,
        type: materialDetails[material.categoryKey]?.type,
      };
      onMaterialsChange([...selectedMaterials, newMaterial]);
    } else {
      onMaterialsChange(
        selectedMaterials.filter((m) => m.id !== material.categoryKey)
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
      if (material.id === materialId) {
        return {
          ...material,
          [field]: value,
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
        {t("Flatbeds Materials")}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        {t(
          "Select the flatbed materials you use and specify their type, width, and length."
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
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
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
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
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
                      />
                    </Box>
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

export { Step4FlatbedsSelection };
