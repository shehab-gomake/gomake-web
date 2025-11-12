import {
  Box,
  Card,
  Typography,
  LinearProgress,
  List,
  ListItemText,
  Collapse,
  Button,
  Divider,
  ListItemButton,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useStyle } from "./style";
import { useSetupGuideMenu } from "./use-quick-setup-menu";
import { SetupStep, StepStatus } from "@/store/print-house-setup-state-state";
import { CloseMenu, ExpandMenu, ShrinkMenu } from "../compoennets/icons";
import { useEffect } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useTicketChatbot } from "@/components/ticket-chatbot";
import { useTheme } from "@/contexts/theme";

interface SetupGuideMenuProps {
  handleOpenModal: () => void;
  handleOpenResetPassword: () => void;
  handleOpenDemoVideo: () => void;
  updatePrintHouseSetupSteps: (
    step: SetupStep,
    status?: StepStatus
  ) => Promise<void>;
}

export const SetupGuideMenu = ({
  handleOpenModal,
  handleOpenResetPassword,
  updatePrintHouseSetupSteps,
  handleOpenDemoVideo,
}: SetupGuideMenuProps) => {
  const {
    t,
    isRtl,
    isOpen,
    isExpanded,
    progressValue,
    toggleExpand,
    renderStepStatusIcon,
    setShowGuideMenu,
    showGuideMenuState,
    steps,
    toggleGroup,
    expandedGroups,
    setExpandedGroups,
    getAllGroupKeys,
    findNextStepLabel,
    findNextStep,
    // Customer/Supplier modal states and handlers
    openCustomerModal,
    openSupplierModal,
    customer,
    supplier,
    setCustomer,
    setSupplier,
    handleCloseCustomerModal,
    handleCloseSupplierModal,
    onCustomerAdd,
    onSupplierAdd,
  } = useSetupGuideMenu({
    handleOpenModal,
    handleOpenResetPassword,
    updatePrintHouseSetupSteps,
    handleOpenDemoVideo,
  });

  // Check FrontDesk permission for header spacing calculation
  const { CheckPermission } = useUserPermission();
  const hasFrontDeskPermission = CheckPermission(Permissions.SHOW_FRONT_DESK);

  // Check if chatbot is open to adjust button position
  const { isOpen: isChatbotOpen } = useTicketChatbot();

  // Check if HP theme is active
  const { currentTheme } = useTheme();
  const isHpClient = currentTheme === "hp-client";

  const { classes } = useStyle(
    isRtl,
    hasFrontDeskPermission,
    isChatbotOpen,
    isHpClient
  );
  const nextStep = findNextStep(steps);

  useEffect(() => {
    const stored = localStorage.getItem("gomake_expandedGroups");
    if (stored) {
      setExpandedGroups(JSON.parse(stored));
    } else {
      const initialGroups = getAllGroupKeys(steps).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedGroups(initialGroups);
    }
  }, []);

  const renderSteps = (stepList) =>
    stepList.map((step) => {
      const isGroup = "children" in step;

      if (isGroup) {
        const isGroupExpanded = expandedGroups[step.key] ?? true;

        return (
          <Box key={step.key}>
            <ListItemButton onClick={() => toggleGroup(step.key)}>
              <ListItemText
                primary={step.label}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "14px",
                  textAlign: isRtl ? ("right" as "right") : ("left" as "left"),
                }}
              />

              {isGroupExpanded ? (
                <ExpandLess sx={{ fontSize: "20px" }} />
              ) : (
                <ExpandMore sx={{ fontSize: "20px" }} />
              )}
            </ListItemButton>
            <Collapse in={isGroupExpanded} timeout="auto" unmountOnExit>
              <List disablePadding component="div">
                {renderSteps(step.children)}
              </List>
            </Collapse>
          </Box>
        );
      }

      // Single step (leaf)
      return (
        <ListItemButton
          key={step.key}
          onClick={step.onClick}
          sx={{
            borderRadius: "8px",
            cursor:
              step.status === StepStatus.DONE &&
              step.key === SetupStep.SETUP_YOUR_MACHINES
                ? "default"
                : "pointer",
            pointerEvents:
              step.status === StepStatus.DONE &&
              step.key === SetupStep.SETUP_YOUR_MACHINES
                ? "none"
                : "auto",
            py: "2px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {renderStepStatusIcon(step.status)}
            <ListItemText
              primary={step.label}
              primaryTypographyProps={classes.listItemText}
            />
          </Box>
        </ListItemButton>
      );
    });

  if (!isOpen) return null;

  return (
    <>
      {showGuideMenuState ? (
        <Card
          sx={{
            ...classes.mainContainer,
            fontFamily: "Inter, Roboto, sans-serif",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="600"
              sx={{ color: "#000", fontSize: "14px" }}
            >
              {t("quickSetup.setupGuide")}
            </Typography>
            <Box gap={1}>
              <IconButton onClick={toggleExpand} sx={{ p: 0.5, color: "#999" }}>
                {isExpanded ? <ShrinkMenu /> : <ExpandMenu />}
              </IconButton>
              <IconButton
                onClick={() => setShowGuideMenu(false)}
                sx={{ p: 0.5, color: "#999" }}
              >
                <CloseMenu />
              </IconButton>
            </Box>
          </Box>
          <Box mb={2}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={classes.linearProgress}
            />
          </Box>
          {isExpanded ? (
            <>
              <List dense disablePadding>
                {renderSteps(steps)}
              </List>
              <Divider sx={{ my: 2 }} />
              {/* <Button variant="contained" fullWidth sx={classes.btnStyle}>
            {t("quickSetup.ready")}
          </Button> */}
              <Button
                variant="contained"
                fullWidth
                sx={classes.btnStyle}
                onClick={() => {
                  if (nextStep?.onClick) {
                    nextStep.onClick();
                  } else {
                    setShowGuideMenu(false);
                  }
                }}
              >
                {nextStep
                  ? `${t("quickSetup.next")} : ${nextStep.label}`
                  : t("quickSetup.ready")}
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{ color: "#6B6B6B", fontSize: "13px", mt: 1 }}
              >
                {`${t("sales.documentDeliveries.next")} : ${
                  findNextStepLabel(steps) || "-"
                }`}
              </Typography>
            </>
          )}
        </Card>
      ) : (
        <Box sx={classes.secondGuide} onClick={() => setShowGuideMenu(true)}>
          <Typography
            sx={
              isHpClient
                ? classes.hpSetupGuideText
                : { fontSize: "14px", fontWeight: 500 }
            }
          >
            {t("quickSetup.setupGuide")}
          </Typography>
          {!isHpClient && (
            <CircularProgress
              variant="determinate"
              value={progressValue}
              size={20}
              thickness={7}
              sx={classes.circularProgress}
            />
          )}
        </Box>
      )}

      {/* Customer Modal */}
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Add}
        codeFlag={false}
        typeClient={CLIENT_TYPE.CUSTOMER}
        onCustomerAdd={onCustomerAdd}
        openModal={openCustomerModal}
        onClose={handleCloseCustomerModal}
        customer={customer}
        setCustomer={setCustomer}
      />

      {/* Supplier Modal */}
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Add}
        codeFlag={false}
        typeClient={CLIENT_TYPE.SUPPLIER}
        onCustomerAdd={onSupplierAdd}
        openModal={openSupplierModal}
        onClose={handleCloseSupplierModal}
        customer={supplier}
        setCustomer={setSupplier}
      />
    </>
  );
};
