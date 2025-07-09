import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Typography,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import { ChangeType, ILastVersionState } from "@/store/last-version-state";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import BugReportIcon from "@mui/icons-material/BugReport";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";

interface WhatsNewModalProps {
  open: boolean;
  onClose: () => void;
  version: ILastVersionState | null;
}

const changeTypeMeta = {
  [ChangeType.BugFix]: {
    label: "bugFixes",
    icon: <BugReportIcon color="error" />,
  },
  [ChangeType.Improvement]: {
    label: "improvements",
    icon: <UpgradeIcon color="success" />,
  },
  [ChangeType.Feature]: {
    label: "newFeatures",
    icon: <NewReleasesIcon color="primary" />,
  },
};

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  open,
  onClose,
  version,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isLTR = dir === "ltr";

  const renderSection = (type: ChangeType) => {
    const filtered = version?.changes?.filter((c) => c.type === type);
    if (!filtered?.length) return null;

    const { label, icon } = changeTypeMeta[type];

    return (
      <Box mb={2} key={type}>
        <Box
          display="flex"
          alignItems="center"
          {...(isLTR ? { mb: 1 } : { mt: 1 })}
        >
          {icon}
          <Typography
            variant="h6"
            fontWeight="bold"
            {...(isLTR ? { ml: 1 } : { mr: 1 })}
          >
            {t(`header.${label}`)}
          </Typography>
        </Box>
        <Box
          sx={{
            maxHeight: "125px",
            overflowY: "auto",
            ...(isLTR ? { pl: 1 } : { pr: 1 }),
          }}
          className="custom-scroller"
        >
          <List dense>
            {filtered.map((change) => (
              <ListItem key={change.id} disableGutters>
                <Typography
                  variant="body2"
                  dir={dir}
                  sx={{ display: "inline" }}
                >
                  <strong style={{ direction: "ltr", unicodeBidi: "isolate" }}>
                    {change.title}
                  </strong>
                  {" : "}
                  {change.name}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      // PaperProps={{
      //   sx: { maxHeight: "70vh", overflowY: "auto" },
      // }}
    >
      <DialogTitle
        id="go-make-dialog-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {`${t("header.whatsNewLabel")} ${`(v${version?.versionNumber})`}`}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {Object.values(ChangeType)
          .filter((v) => !isNaN(Number(v)))
          .map((type) => renderSection(Number(type)))}
      </DialogContent>
    </Dialog>
  );
};
