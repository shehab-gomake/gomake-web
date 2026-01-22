import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { useMaterialsGrouped } from "@/widgets/materials-widget/components/materials-grouped/use-materials-grouped";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { Typography, Box, styled, Switch, TextField, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import { PenIcon } from "../../icons/PenIcon";
import { HpSearchIcon } from "../../icons/HpSearchIcon";

// HP Client styled components - Header Section
const HpHeaderContainer = styled(Box)({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  // padding: "16px 24px 16px",
  width: "100%",
  borderBottom: "1px solid #E0E0E0",
  borderRadius: "0px",
  flexShrink: 0,
  alignSelf: "stretch",
  flexGrow: 0,
  backgroundColor: "#FFFFFF",
});

const HpHeaderRow = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0px",
  width: "100%",
  height: "48px",
  borderRadius: "0px",
  alignSelf: "stretch",
  flexGrow: 0,
  paddingLeft: 20,
  paddingRight: 20,
  marginBottom: 16,
});

const HpPageTitle = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "40px",
  lineHeight: "48px",
  color: "#1A1A1A",
});

const HpHeaderActions = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0px",
  gap: "16px",
  borderRadius: "0px",
});

const HpFilterContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0px",
  gap: "8px",
  borderRadius: "0px",
  cursor: "pointer",
});

const HpFilterLabel = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "18px",
  color: "#A3A3A3",
});

const HpFilterValue = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "21px",
  color: "#1A1A1A",
});

const HpManageButton = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "21px",
  color: "#024AD8",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
});

const HpSearchInput = styled(TextField)({
  width: "200px",
  "& .MuiOutlinedInput-root": {
    height: "36px",
    padding: "4px 12px 4px 12px",
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    fontFamily: "'Forma DJR UI', sans-serif",
    fontSize: "16px",
    lineHeight: "19px",
    "& fieldset": {
      border: "1px solid #FFFFFF",
    },
    "&:hover fieldset": {
      border: "1px solid #E0E0E0",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #024AD8",
    },
    "& input": {
      padding: 0,
      "&::placeholder": {
        color: "#A3A3A3",
        opacity: 1,
        fontFamily: "'Forma DJR UI', sans-serif",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "19px",
      },
    },
  },
});

// HP Client styled components - Category Cards
const HpContainer = styled(Box)({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  // padding: "1px",
  width: "100%",
  background: "#FFFFFF",
  border: "1px solid #E0E0E0",
  borderRadius: "12px",
  alignSelf: "stretch",
  flexGrow: 0,
});

const HpCategoryHeader = styled(Box)<{ isCollapsed?: boolean }>(({ isCollapsed }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0px 16px",
  width: "100%",
  height: "48px",
  borderRadius: "0px",
  alignSelf: "stretch",
  flexGrow: 0,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(2, 74, 216, 0.04)",
    borderRadius: isCollapsed ? "8px" : "0px",
  },
}));

const HpCategoryInfo = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0px",
  gap: "12px",
  borderRadius: "0px",
  flexGrow: 0,
});

const HpCategoryTitle = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "21px",
  color: "#1A1A1A",
});

const HpMaterialsBadge = styled(Box)({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "2px 8px",
  gap: "4px",
  background: "#024AD8",
  borderRadius: "8px",
  flexGrow: 0,
});

const HpBadgeText = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "18px",
  color: "#FFFFFF",
});

const HpMaterialsContainer = styled(Box)({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "1px 0px 0px",
  width: "100%",
  borderTop: "1px solid #E0E0E0",
  borderRadius: "0px",
  alignSelf: "stretch",
  flexGrow: 0,
});

const HpMaterialItem = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0px 16px",
  width: "100%",
  height: "56px",
  borderRadius: "0px",
  alignSelf: "stretch",
  flexGrow: 0,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: "4px",
  },
});

const HpMaterialInfo = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0px",
  gap: "12px",
  borderRadius: "0px",
  flexGrow: 0,
});

const HpMaterialName = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "21px",
  color: "#1A1A1A",
});

const HpActiveBadge = styled(Box)({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "2px 8px",
  gap: "4px",
  background: "rgba(0, 132, 61, 0.1)",
  border: "1px solid rgba(0, 132, 61, 0.2)",
  borderRadius: "8px",
  flexGrow: 0,
});

const HpActiveText = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "18px",
  color: "#00843D",
});

const HpInactiveBadge = styled(Box)({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "2px 8px",
  gap: "4px",
  background: "rgba(0, 0, 0, 0.05)",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  flexGrow: 0,
});

const HpInactiveText = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "18px",
  color: "#666666",
});

const HpActionsContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0px",
  gap: "16px",
  borderRadius: "0px",
  flexGrow: 0,
});

const HpEditButton = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "0px 4px",
  gap: "8px",
  height: "32px",
  borderRadius: "8px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(2, 74, 216, 0.08)",
  },
});

const HpEditText = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "21px",
  color: "#024AD8",
});

const HpSwitch = styled(Switch)({
  width: 32,
  height: 18.4,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 1.2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(14px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#024AD8",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
    backgroundColor: "#FFFFFF",
  },
  "& .MuiSwitch-track": {
    borderRadius: 16777720,
    backgroundColor: "#E0E0E0",
    opacity: 1,
  },
});

interface IHpMaterialsGroupedProps {
  isAdmin: boolean;
}

const HpMaterialsGrouped = ({ isAdmin }: IHpMaterialsGroupedProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const router = useRouter();
  const isRTL = t("direction") === "rtl";

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

  if (loading) {
    return (
      <div style={{...classes.mainContainer, padding: "16px 20px"} }>
        <Typography
          sx={{
            fontFamily: "'Forma DJR UI', sans-serif",
            fontSize: "14px",
            color: "#1A1A1A",
          }}
        >
          {t("machineAttributes.loadingMaterials")}
        </Typography>
      </div>
    );
  }

  return (
    <div
      style={{
        ...classes.mainContainer,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Fixed Header Section */}
      <HpHeaderContainer>
        <HpHeaderRow>
          {/* Page Title */}
          <HpPageTitle>
            {isAdmin ? t("tabs.materialsAdmin") : t("tabs.materials")}
          </HpPageTitle>
          {/* Header Actions */}
          <HpHeaderActions>
            {/* Filter by Status */}
            <HpFilterContainer onClick={handleClick}>
              <HpFilterLabel>{t("navigationButtons.filterByStatus")}:</HpFilterLabel>
              <HpFilterValue>{filterStatus?.label}</HpFilterValue>
            </HpFilterContainer>
            {/* Manage Profits Button */}
            <HpManageButton
              onClick={() => {
                const uri = `/products/profits?actionId=5f3e9084-6724-4358-9f94-8c63019c8894&actionName=Raw materials`;
                window.open(uri, "_blank");
              }}
            >
              {t("navigationButtons.manageProfits")}
            </HpManageButton>

            {/* Search Input */}
            <HpSearchInput
              placeholder={t("header.search")}
              onChange={(e) => onFilterChange(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment 
                    position="start"
                    sx={{
                      margin:"0px 3px"
                    }}
                  >
                    <HpSearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </HpHeaderActions>
        </HpHeaderRow>
      </HpHeaderContainer>

      {/* Scrollable Content Section */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px 20px",
        }}
        className="custom-scrollbar"
        data-tour={"materialsTable"}
      >
        {categoriesWithMaterials.length === 0 ? (
          <HpContainer
            sx={{
              padding: "24px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Forma DJR UI', sans-serif",
                fontSize: "16px",
                fontWeight: 500,
                color: "#1A1A1A",
                textAlign: "center",
              }}
            >
              {filter
                ? t("machineAttributes.noSearchResults")
                : t("machineAttributes.noMaterialsFound")}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Forma DJR UI', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#666666",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              {filter
                ? t("machineAttributes.tryDifferentSearch")
                : t("machineAttributes.noMaterialsInSystem")}
            </Typography>
          </HpContainer>
        ) : (
          categoriesWithMaterials.map((category) => {
            const categoryKey = category.categoryKey || "uncategorized";
            const isCollapsed = collapsedCategories[categoryKey];

            return (
              <HpContainer key={categoryKey}>
                {/* Category Header */}
                <HpCategoryHeader
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    setCollapsedCategories((prev) => ({
                      ...prev,
                      [categoryKey]: !prev[categoryKey],
                    }));
                  }}
                >
                  <HpCategoryInfo>
                    {isCollapsed ? (
                      <KeyboardArrowRightIcon
                        sx={{ width: 20, height: 20, color: "#1A1A1A" }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ width: 20, height: 20, color: "#1A1A1A" }}
                      />
                    )}
                    <HpCategoryTitle>
                      {getCategoryName(category.categoryKey)}
                    </HpCategoryTitle>
                  </HpCategoryInfo>
                  <HpMaterialsBadge>
                    <HpBadgeText>
                      {category.data.length} {t("tabs.materials")}
                    </HpBadgeText>
                  </HpMaterialsBadge>
                </HpCategoryHeader>

                {/* Materials List */}
                {!isCollapsed && (
                  <HpMaterialsContainer>
                    {category.data.map((material) => (
                      <HpMaterialItem key={material.materialTypeKey}>
                        <HpMaterialInfo>
                          <HpMaterialName
                            sx={{
                              color: material.isActive ? "#1A1A1A" : "#999999",
                              textDecoration: material.isActive
                                ? "none"
                                : "line-through",
                            }}
                          >
                            {material.materialTypeName}
                          </HpMaterialName>
                          {material.isActive ? (
                            <HpActiveBadge>
                              <HpActiveText>
                                {t("navigationButtons.active")}
                              </HpActiveText>
                            </HpActiveBadge>
                          ) : (
                            <HpInactiveBadge>
                              <HpInactiveText>
                                {t("navigationButtons.inactive")}
                              </HpInactiveText>
                            </HpInactiveBadge>
                          )}
                        </HpMaterialInfo>
                        <PermissionCheck
                          userPermission={Permissions.EDIT_MATERIAL}
                        >
                          <HpActionsContainer>
                            <HpEditButton
                              data-tour={
                                material.materialTypeKey === "sheets"
                                  ? "editMaterials"
                                  : undefined
                              }
                              onClick={() =>
                                handleEditMaterial(material.materialTypeKey)
                              }
                            >
                              <PenIcon />
                              <HpEditText>
                                {t("machineAttributes.edit")}
                              </HpEditText>
                            </HpEditButton>
                            <HpSwitch
                              checked={material.isActive}
                              onChange={() =>
                                handleToggleActive(material.materialTypeKey)
                              }
                            />
                          </HpActionsContainer>
                        </PermissionCheck>
                      </HpMaterialItem>
                    ))}
                  </HpMaterialsContainer>
                )}
              </HpContainer>
            );
          })
        )}
      </div>

      <GoMakeMenu handleClose={handleClose} open={Boolean(anchorEl)} anchorEl={anchorEl}>
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

export { HpMaterialsGrouped };
