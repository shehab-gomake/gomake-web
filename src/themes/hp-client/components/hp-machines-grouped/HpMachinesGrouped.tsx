import { useCustomerMachinesGrouped } from "@/widgets/machines/customer/use-customer-machines-grouped";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { Typography, Box, styled, TextField, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { GoMakeModal } from "@/components";
import { AddMachineModal } from "@/widgets/machines/customer/add-machine-modal";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { PenIcon } from "../../icons/PenIcon";
import { HpSearchIcon } from "../../icons/HpSearchIcon";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PrimaryButton } from "@/components/button/primary-button";
import { DeleteIcon } from "@/pages-components/quotes/more-circle/icons/delete";
import { useStyle } from "./style";

// HP Client styled components - Header Section
const HpHeaderContainer = styled(Box)({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
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

const HpAddButton = styled(PrimaryButton)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "21px",
  height: "36px",
  borderRadius: "8px",
  width: "fit-content",
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
  height: "54px",
  borderRadius: "12px",
  alignSelf: "stretch",
  flexGrow: 0,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(2, 74, 216, 0.04)",
    borderBottomLeftRadius: isCollapsed ? "12px" : "0px",
    borderBottomRightRadius: isCollapsed ? "12px" : "0px",
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
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1A1A1A",
});

const HpMachinesBadge = styled(Box)({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "2px 8px",
  gap: "4px",
  background: "#FFFFFF",
  borderRadius: "8px",
  flexGrow: 0,
  
});

const HpBadgeText = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "24px",
  color: "#024AD8",
});

const HpMachinesContainer = styled(Box)({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "0px",
  width: "100%",
  background: "#FFFFFF",
  borderRadius: "12px",
  alignSelf: "stretch",
  flexGrow: 0,
});

const HpMachineItem = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0px 16px",
  width: "100%",
  height: "57px",
  borderBottom: "1px solid #E0E0E0",
  borderRadius: "0px",
  alignSelf: "stretch",
  flexGrow: 0,
  "&:last-child": {
    borderBottom: "none",
  },
});

const HpMachineName = styled(Typography)({
  fontFamily: "'Forma DJR UI', sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1A1A1A",
});

const HpActionsContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0px",
  gap: "8px",
  borderRadius: "0px",
  flexGrow: 0,
});

const HpEditButton = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "0px",
  gap: "8px",
  width: "71.94px",
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

const HpDeleteButton = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "0px",
  width: "36px",
  height: "32px",
  borderRadius: "8px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(204, 44, 0, 0.08)",
  },
});

const HpMachinesGrouped = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const router = useRouter();

  const {
    categoriesWithMachines,
    onFilterChange,
    loading,
    filter,
    allAdminMachines,
    loadAdminMachines,
    refreshMachines,
  } = useCustomerMachinesGrouped();

  const [openAddMachineModal, setOpenAddMachineModal] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<{
    [key: string]: boolean;
  }>({});

  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<any>(null);


  // API and alert hooks
  const { callApi } = useGomakeAxios();
  const { alertSuccessDelete, alertFaultDelete } = useSnackBar();



  const handleEditMachine = (categoryId: string, machineId: string) => {
    router.push(`/machines/category/${categoryId}?machineId=${machineId}`);
  };

  const handleDeleteMachine = (machine: any) => {
    setMachineToDelete(machine);
    setDeleteModalOpen(true);
  };

  const confirmDeleteMachine = async () => {
    if (machineToDelete) {
      try {
        // Call the delete API directly with the machine ID
        const response = await callApi("POST", `/v1/delete-machine`, {
          id: machineToDelete.id,
        });

        if (response?.success) {
          alertSuccessDelete();
          setDeleteModalOpen(false);
          setMachineToDelete(null);

          // Refresh the machines list to reflect the deletion
          await refreshMachines();
        } else {
          alertFaultDelete();
        }
      } catch (error) {
        console.error("Error deleting machine:", error);
        alertFaultDelete();
      }
    }
  };

  if (loading) {
    return (
      <div style={classes.loadingContainer}>
        <Typography sx={classes.loadingText}>
          {t("machineAttributes.loadingMachines")}
        </Typography>
      </div>
    );
  }

  return (
    <div style={classes.mainContainer}>
      {/* Fixed Header Section */}
      <HpHeaderContainer>
        <HpHeaderRow>
          {/* Page Title */}
          <HpPageTitle>{t("machineAttributes.machines")}</HpPageTitle>

          {/* Header Actions */}
          <HpHeaderActions>
       

            {/* Search Input */}
            <HpSearchInput
              placeholder={t("header.search")}
              onChange={(e) => onFilterChange(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={classes.searchInputAdornment}
                  >
                    <HpSearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={classes.searchInputDirection}
            />
                 {/* Add Machine Button */}
                 <HpAddButton
              onClick={() => setOpenAddMachineModal(true)}
              variant={"contained"}
            >
              {t("tabs.addMachine")}
            </HpAddButton>
          </HpHeaderActions>
        </HpHeaderRow>
      </HpHeaderContainer>

      {/* Scrollable Content Section */}
      <div
        style={classes.scrollableContent}
        className="custom-scrollbar"
        data-tour={"machinesTable"}
      >
        {categoriesWithMachines.length === 0 ? (
          <HpContainer sx={classes.emptyStateContainer}>
            <Typography sx={classes.emptyStateTitle}>
              {filter
                ? t("machineAttributes.noSearchResults")
                : t("machineAttributes.noMachinesFound")}
            </Typography>
            <Typography sx={classes.emptyStateSubtitle}>
              {filter
                ? t("machineAttributes.tryDifferentSearch")
                : t("machineAttributes.noMachinesInSystem")}
            </Typography>
          </HpContainer>
        ) : (
          categoriesWithMachines.map((category) => {
            const categoryKey = category.id;
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
                        sx={{ width: 16, height: 16, color: "#A3A3A3" }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ width: 16, height: 16, color: "#A3A3A3" }}
                      />
                    )}
                    <HpCategoryTitle>{t(category.name)}</HpCategoryTitle>
                  </HpCategoryInfo>
                  <HpMachinesBadge>
                    <HpBadgeText>
                      {category.machines.length} {t("machineAttributes.machines")}
                    </HpBadgeText>
                  </HpMachinesBadge>
                </HpCategoryHeader>

                {/* Machines List */}
                {!isCollapsed && (
                  <HpMachinesContainer>
                    {category.machines.map((machine, index) => (
                      <HpMachineItem
                        key={machine.id}
                        sx={classes.machineItemBorderBottom(
                          index === category.machines.length - 1
                        )}
                      >
                        <HpMachineName>{machine.nickName}</HpMachineName>
                        <PermissionCheck
                          userPermission={Permissions.EDIT_MACHINE}
                        >
                          <HpActionsContainer>
                            <HpEditButton
                              data-tour={
                                category.id === "digital-printing"
                                  ? "editDigitalPrinting"
                                  : undefined
                              }
                              onClick={() =>
                                handleEditMachine(category.id, machine.id)
                              }
                            >
                              <PenIcon />
                              <HpEditText>
                                {t("machineAttributes.edit")}
                              </HpEditText>
                            </HpEditButton>
                            <HpDeleteButton
                              onClick={() => handleDeleteMachine(machine)}
                            >
                              <DeleteIcon color="#CC2C00" width={16} height={16} />
                            </HpDeleteButton>
                          </HpActionsContainer>
                        </PermissionCheck>
                      </HpMachineItem>
                    ))}
                  </HpMachinesContainer>
                )}
              </HpContainer>
            );
          })
        )}
      </div>

      <GoMakeModal
        insideStyle={classes.addMachineModalStyle}
        openModal={openAddMachineModal}
        onClose={() => setOpenAddMachineModal(false)}
        modalTitle={t("tabs.addMachine")}
      >
        <AddMachineModal
          closeModal={() => setOpenAddMachineModal(false)}
          allAdminMachines={allAdminMachines}
          loadAdminMachines={loadAdminMachines}
        />
      </GoMakeModal>

      {/* Delete Confirmation Modal */}
      <GoMakeModal
        openModal={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        insideStyle={classes.deleteModalStyle}
      >
        <Box sx={classes.deleteModalContainer}>
          {/* Trash Icon */}
          <Box sx={classes.deleteModalIconContainer}>
            <DeleteIcon color="#CC2C00" width={48} height={48} />
          </Box>

          {/* Title */}
          <Typography variant="h6" sx={classes.deleteModalTitle}>
            {t("machineAttributes.deleteMachine")}
          </Typography>

          {/* Message */}
          <Typography variant="body2" sx={classes.deleteModalMessage}>
            {t("machineAttributes.deleteMachineConfirmation", {
              machineName:
                machineToDelete?.nickName ||
                machineToDelete?.name ||
                "this machine",
            })}
            <br />
            {t("machineAttributes.deleteMachineWarning")}
          </Typography>

          {/* Action Buttons */}
          <Box sx={classes.deleteModalActions}>
            <SecondaryButton
              onClick={() => setDeleteModalOpen(false)}
              variant="outlined"
              sx={classes.cancelButton}
            >
              {t("navigationButtons.cancel")}
            </SecondaryButton>
            <SecondaryButton
              onClick={confirmDeleteMachine}
              variant="contained"
              sx={classes.deleteButton}
            >
              {t("machineAttributes.delete")}
            </SecondaryButton>
          </Box>
        </Box>
      </GoMakeModal>
    </div>
  );
};

export { HpMachinesGrouped };
