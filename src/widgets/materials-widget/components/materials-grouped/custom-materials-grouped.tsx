import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useMaterialsGrouped } from "./use-materials-grouped";
import { PrimaryButton } from "@/components/button/primary-button";
import { EditIcon } from "@/icons/edit-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import i18n from "i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useState } from "react";
import { Filter2Icon } from "@/icons/filter2-icon";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { useThemeComponent } from "@/contexts/theme/useThemeComponent";

interface ICustomMaterialsGroupedProps {
  isAdmin: boolean;
}

// Base component for default theme
const BaseMaterialsGrouped = ({ isAdmin }: ICustomMaterialsGroupedProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const isRTL = i18n.dir() === "rtl";
  const router = useRouter();

  const {
    categoriesWithMaterials,
    onFilterChange,
    loading,
    filter,
    filterStatus,
    setFilterStatus,
    filterStatusList,
    toggleMaterialTypeActive,
  } = useMaterialsGrouped(isAdmin);

  const [collapsedCategories, setCollapsedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditMaterial = (materialTypeKey: string) => {
    const basePath = isAdmin ? "/materials-admin" : "/materials";
    router.push(`${basePath}/${materialTypeKey}`);
  };

  const handleToggleActive = async (materialTypeKey: string) => {
    await toggleMaterialTypeActive(materialTypeKey);
  };

  const getCategoryName = (categoryKey: string | null) => {
    if (!categoryKey) return "Uncategorized";
    return categoryKey;
  };

  const getCategoryColor = (category: any, index: number) => {
    // First check if categoryColor is provided in the data
    if (category.categoryColor) {
      return category.categoryColor;
    }

    // If no categoryColor provided, use index-based colors
    const defaultColors = [
      "#2196F3", // Blue
      "#4CAF50", // Green
      "#FF9800", // Orange
      "#9C27B0", // Purple
      "#F44336", // Red
      "#00BCD4", // Cyan
      "#8BC34A", // Light Green
      "#FFC107", // Amber
      "#E91E63", // Pink
      "#795548", // Brown
      "#607D8B", // Blue Grey
      "#9E9E9E", // Grey
    ];

    return defaultColors[index % defaultColors.length];
  };

  if (loading) {
    return (
      <div style={classes.mainContainer}>
        <Typography>{t("machineAttributes.loadingMaterials")}</Typography>
      </div>
    );
  }

  return (
    <div style={classes.mainContainer}>
      <HeaderTitleWithSearch
        title={isAdmin ? t("tabs.materialsAdmin") : t("tabs.materials")}
        onChange={onFilterChange}
        children={
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              onClick={handleClick}
            >
              <Filter2Icon />
              {t("navigationButtons.filterByStatus")}: {filterStatus?.label}
            </div>
            <SecondaryButton
              style={{
                height: "40px",
                minWidth: "120px",
                width: "fit-content",
              }}
              onClick={() => {
                const uri = `/products/profits?actionId=5f3e9084-6724-4358-9f94-8c63019c8894&actionName=Raw materials`;
                window.open(uri, "_blank");
              }}
            >
              {t("navigationButtons.manageProfits")}
            </SecondaryButton>
          </div>
        }
      />
      <div style={{ width: "100%" }} data-tour={"materialsTable"}>
        {categoriesWithMaterials.length === 0 ? (
          <Box>
            <Typography
              variant="h6"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              {filter
                ? t("machineAttributes.noSearchResults")
                : t("machineAttributes.noMaterialsFound")}
            </Typography>
            <Typography
              variant="body2"
              style={{
                textAlign: "center",
                marginTop: "0.5rem",
                color: "gray",
              }}
            >
              {filter
                ? t("machineAttributes.tryDifferentSearch")
                : t("machineAttributes.noMaterialsInSystem")}
            </Typography>
          </Box>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {categoriesWithMaterials.map((category, index) => (
              <Card
                key={category.categoryKey || "uncategorized"}
                style={{
                  borderLeft: isRTL
                    ? "none"
                    : `4px solid ${getCategoryColor(category, index)}`,
                  borderRight: isRTL
                    ? `4px solid ${getCategoryColor(category, index)}`
                    : "none",
                }}
              >
                <CardContent style={{ padding: "0.75rem" }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "18px",
                          color: "#666",
                          padding: "4px",
                          userSelect: "none",
                        }}
                        onClick={() => {
                          setCollapsedCategories((prev) => ({
                            ...prev,
                            [category.categoryKey || "uncategorized"]:
                              !prev[category.categoryKey || "uncategorized"],
                          }));
                        }}
                      >
                        {collapsedCategories[
                          category.categoryKey || "uncategorized"
                        ]
                          ? "▶"
                          : "▼"}
                      </span>
                      <Box
                        sx={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: getCategoryColor(category, index),
                          marginRight: "8px",
                        }}
                      />
                      <Typography variant="h6" component="h3">
                        {getCategoryName(category.categoryKey)}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${category.data.length} ${t("tabs.materials")}`}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  {!collapsedCategories[
                    category.categoryKey || "uncategorized"
                  ] && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={0.5}
                        flex={1}
                      >
                        {category.data.map((material) => (
                          <Box
                            key={material.materialTypeKey}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            p={0.5}
                            sx={{
                              backgroundColor: "rgba(0,0,0,0.02)",
                              borderRadius: 1,
                              border: "1px solid rgba(0,0,0,0.1)",
                              transition: "all 0.3s ease-in-out",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.12)",
                                border: "1px solid rgba(25, 118, 210, 0.3)",
                                transform: isRTL ? "translateX(-4px)" : "translateX(4px)",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                              },
                            }}
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              flex={1}
                            >
                              <Typography
                                variant="body1"
                                style={{
                                  fontWeight: 600,
                                  color: material.isActive
                                    ? "#000000"
                                    : "#999999",
                                  fontSize: "1rem",
                                  textDecoration: material.isActive
                                    ? "none"
                                    : "line-through",
                                }}
                              >
                                {material.materialTypeName}
                              </Typography>
                              <Chip
                                label={
                                  material.isActive
                                    ? t("navigationButtons.active")
                                    : t("navigationButtons.inactive")
                                }
                                size="small"
                                color={
                                  material.isActive ? "success" : "default"
                                }
                                variant="outlined"
                              />
                            </Box>
                            <PermissionCheck
                              userPermission={Permissions.EDIT_MATERIAL}
                            >
                              <Box display="flex" gap={1}>
                                <PrimaryButton
                                  data-tour={
                                    material.materialTypeKey === "sheets"
                                      ? "editMaterials"
                                      : undefined
                                  }
                                  startIcon={
                                    <EditIcon
                                      color={primaryColor(500)}
                                      width={16}
                                      height={16}
                                    />
                                  }
                                  onClick={() =>
                                    handleEditMaterial(material.materialTypeKey)
                                  }
                                  variant={"text"}
                                  size="small"
                                >
                                  {t("machineAttributes.edit")}
                                </PrimaryButton>

                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={material.isActive}
                                      onChange={() =>
                                        handleToggleActive(
                                          material.materialTypeKey
                                        )
                                      }
                                      color="primary"
                                      size="small"
                                    />
                                  }
                                  label=""
                                  sx={{ margin: 0 }}
                                />
                              </Box>
                            </PermissionCheck>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        {filterStatusList.map((status) => (
          <MenuItem
            key={status.value}
            onClick={() => {
              setFilterStatus(status);
              handleClose();
            }}
            selected={filterStatus.value === status.value}
          >
            {status.label}
          </MenuItem>
        ))}
      </GoMakeMenu>
    </div>
  );
};

// Theme-aware wrapper - uses HP component when hp-client theme is active
const CustomMaterialsGrouped = (props: ICustomMaterialsGroupedProps) => {
  const ThemedMaterialsGrouped = useThemeComponent(
    "MaterialsGrouped",
    BaseMaterialsGrouped
  );
  return <ThemedMaterialsGrouped {...props} />;
};

export { CustomMaterialsGrouped };
