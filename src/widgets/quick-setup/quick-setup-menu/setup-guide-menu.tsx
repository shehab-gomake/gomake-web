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
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useStyle } from "./style";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import { useSetupGuideMenu } from "./use-quick-setup-menu";
import { ModalControls } from "@/hooks/use-modal";
import { StepStatus } from "@/store/print-house-setup-state-state";

interface SetupGuideMenuProps {
  handleOpenModal: () => void;
}

export const SetupGuideMenu = ({ handleOpenModal }: SetupGuideMenuProps) => {
  const {
    t,
    isRtl,
    isOpen,
    isExpanded,
    openVerifyBusiness,
    progressValue,
    toggleExpand,
    handleToggleVerifyBusiness,

    productsSetupStatus,
    renderStepStatusIcon,
  } = useSetupGuideMenu();
  const { classes } = useStyle(isRtl);

  if (!isOpen) return null;

  return (
    <Card sx={classes.mainContainer}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle1" fontWeight="bold" color="#333333">
          {t("quickSetup.setupGuide")}
        </Typography>
        <Box onClick={toggleExpand} sx={{ cursor: "pointer" }}>
          {isExpanded ? (
            <CloseFullscreenRoundedIcon fontSize="small" />
          ) : (
            <OpenInFullRoundedIcon fontSize="small" />
          )}
        </Box>
      </Box>
      <Box mb={3}>
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
            {/* Step 1 */}
            <ListItemButton
              onClick={
                productsSetupStatus !== StepStatus.DONE
                  ? handleOpenModal
                  : undefined
              }
              sx={{
                borderRadius: "8px",
                mb: 1,
                cursor:
                  productsSetupStatus === StepStatus.DONE
                    ? "default"
                    : "pointer",
                pointerEvents:
                  productsSetupStatus === StepStatus.DONE ? "none" : "auto",
                opacity: 1,
              }}
            >
              <ListItemText
                primary="Set up products" //!here
                primaryTypographyProps={{ color: "#333333", fontSize: "14px" }}
              />
              {renderStepStatusIcon(productsSetupStatus)}
            </ListItemButton>

            {/* Step 2 */}
            <ListItem button sx={{ borderRadius: "8px", mb: 1 }}>
              <ListItemText
                primary="Test Connect"
                primaryTypographyProps={{ color: "#333333", fontSize: "14px" }}
              />
              {renderStepStatusIcon(0)}
            </ListItem>

            {/* Step 3 - expandable */}
            <ListItem
              button
              onClick={handleToggleVerifyBusiness}
              sx={{ borderRadius: "8px", mb: 1 }}
            >
              <ListItemText
                primary="Verify your business"
                primaryTypographyProps={{ color: "#333333", fontSize: "14px" }}
              />
              {openVerifyBusiness ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openVerifyBusiness} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                <ListItem sx={{ pl: 0 }}>
                  <Checkbox size="small" sx={classes.checkBox} />
                  <ListItemText
                    primary="Verify your email"
                    primaryTypographyProps={{
                      fontSize: "13px",
                      color: "#333333",
                    }}
                  />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <Checkbox size="small" sx={classes.checkBox} />
                  <ListItemText
                    primary="Complete your profile"
                    primaryTypographyProps={{
                      fontSize: "13px",
                      color: "#333333",
                    }}
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>

          <Divider sx={{ my: 3 }} />
          <Button variant="contained" fullWidth sx={classes.btnStyle}>
            GO LIVE
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body2" color="textSecondary">
            Next: Create a recurring product
          </Typography>
        </>
      )}
    </Card>
  );
};
