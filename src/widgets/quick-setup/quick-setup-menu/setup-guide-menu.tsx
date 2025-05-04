import {
  Box,
  Card,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Button,
  Checkbox,
  Divider,
  ListItemButton,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useStyle } from "./style";
import { useSetupGuideMenu } from "./use-quick-setup-menu";
import { ModalControls } from "@/hooks/use-modal";
import { SetupStep, StepStatus } from "@/store/print-house-setup-state-state";
import { CloseMenu, ExpandMenu, ShrinkMenu } from "./components/icons";

interface SetupGuideMenuProps {
  handleOpenModal: () => void;
  handleOpenResetPassword: () => void;
}

export const SetupGuideMenu = ({
  handleOpenModal,
  handleOpenResetPassword,
}: SetupGuideMenuProps) => {
  const {
    t,
    isRtl,
    isOpen,
    isExpanded,
    progressValue,
    toggleExpand,
    productsSetupStatus,
    renderStepStatusIcon,
    setShowGuideMenu,
    showGuideMenuState,
    resetPasswordStatus,
  } = useSetupGuideMenu();
  const { classes } = useStyle(isRtl);

  const steps = [
    {
      key: SetupStep.RESET_PASSWORD,
      label: t("quickSetup.resetButton"),
      onClick: handleOpenResetPassword,
      status: resetPasswordStatus,
    },
    {
      key: SetupStep.PRODUCTS_SETUPS,
      label: t("quickSetup.setUpProducts"),
      onClick:
        productsSetupStatus !== StepStatus.DONE ? handleOpenModal : undefined,
      status: productsSetupStatus,
    },
    {
      key: "connectStripe",
      label: t("Connect to stripe"),
      status: StepStatus.NOT_YET,
    },
  ];

  if (!isOpen) return null;

  return showGuideMenuState ? (
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
          {/* FULL menu */}
          <List dense disablePadding>
            {steps.map(({ key, label, onClick, status }) => (
              <ListItemButton
                key={key}
                onClick={onClick}
                sx={{
                  borderRadius: "8px",
                  cursor:
                    status === StepStatus.DONE &&
                    key !== SetupStep.RESET_PASSWORD
                      ? "default"
                      : "pointer",
                  pointerEvents:
                    status === StepStatus.DONE &&
                    key !== SetupStep.RESET_PASSWORD
                      ? "none"
                      : "auto",
                  opacity: 1,
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={classes.listItemText}
                />
                {renderStepStatusIcon(status)}
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          <Button variant="contained" fullWidth sx={classes.btnStyle}>
            GO LIVE
          </Button>
        </>
      ) : (
        <>
          <Typography
            variant="body2"
            sx={{ color: "#6B6B6B", fontSize: "13px", mt: 1 }}
          >{`Next : ${
            steps?.find((step) => step?.status !== StepStatus.DONE)?.label
          }`}</Typography>
        </>
      )}
    </Card>
  ) : (
    <Box sx={classes.secondGuide} onClick={() => setShowGuideMenu(true)}>
      <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
        {t("quickSetup.setupGuide")}
      </Typography>
      <CircularProgress
        variant="determinate"
        value={progressValue}
        size={20}
        thickness={7}
        sx={classes.circularProgress}
      />
    </Box>
  );
};
