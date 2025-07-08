import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { ChangeType, ILastVersionState } from "@/store/last-version-state";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import BugReportIcon from "@mui/icons-material/BugReport";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { useTranslation } from "react-i18next";

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
  const renderSection = (type: ChangeType) => {
    const filtered = version?.changes?.filter((c) => c.type === type);
    if (!filtered?.length) return null;

    const { label, icon } = changeTypeMeta[type];

    return (
      <Box mb={2} key={type}>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="h6" fontWeight="bold" ml={1}>
            {t(`header.${label}`)}
          </Typography>
        </Box>
        <List dense>
          {filtered.map((change) => (
            <ListItem key={change.id} disableGutters>
              <Typography variant="body2">{change.name}</Typography>
            </ListItem>
          ))}
        </List>
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
      PaperProps={{
        sx: { maxHeight: "70vh", overflowY: "auto" },
      }}
    >
      <DialogTitle>{`${t(
        "header.whatsNewLabel"
      )} ${`(v${version?.versionNumber})`}`}</DialogTitle>
      <DialogContent className={`custom-scroller`}>
        {Object.values(ChangeType)
          .filter((v) => !isNaN(Number(v)))
          .map((type) => renderSection(Number(type)))}
      </DialogContent>
    </Dialog>
  );
};
