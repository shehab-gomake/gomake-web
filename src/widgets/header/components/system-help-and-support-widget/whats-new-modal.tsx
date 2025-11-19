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
  CircularProgress,
} from "@mui/material";
import { ChangeType, ILastVersionState } from "@/store/last-version-state";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import BugReportIcon from "@mui/icons-material/BugReport";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";
import { useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { getLastDeployedVersionApi } from "@/services/api-service/gomake-versioning/gomake-versioning-endpoint";

interface WhatsNewModalProps {
  open: boolean;
  onClose: () => void;
  version: ILastVersionState | null;
}

interface DeployedVersionTask {
  id: number;
  taskId: string;
  title: string;
  description?: string;
}

interface DeployedVersionResponse {
  id: number;
  name: string;
  description?: string;
  deployedAt: string;
  createdAt: string;
  tasks: {
    bug: DeployedVersionTask[];
    feature: DeployedVersionTask[];
    quality: DeployedVersionTask[];
  };
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
  const { callApi } = useGomakeAxios();
  const dir: "rtl" | "ltr" = t("direction");
  const isLTR = dir === "ltr";
  const [deployedVersion, setDeployedVersion] = useState<DeployedVersionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayVersion, setDisplayVersion] = useState<ILastVersionState | null>(null);

  // Fetch deployed version data when modal opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      getLastDeployedVersionApi(callApi, (res) => {
        setLoading(false);
        if (res.success && res.data) {
          const data: DeployedVersionResponse = res.data;
          setDeployedVersion(data);
          
          // Transform backend data to frontend format
          const changes: Array<{ id: string; title: string; name: string; type: ChangeType }> = [];
          
          // Map bug tasks to BugFix (1)
          data.tasks.bug.forEach((task) => {
            changes.push({
              id: task.id.toString(),
              title: task.taskId,
              name: task.title,
              type: ChangeType.BugFix,
            });
          });
          
          // Map quality tasks to Improvement (2)
          data.tasks.quality.forEach((task) => {
            changes.push({
              id: task.id.toString(),
              title: task.taskId,
              name: task.title,
              type: ChangeType.Improvement,
            });
          });
          
          // Map feature tasks to Feature (3)
          data.tasks.feature.forEach((task) => {
            changes.push({
              id: task.id.toString(),
              title: task.taskId,
              name: task.title,
              type: ChangeType.Feature,
            });
          });
          
          // Extract version number from name (remove 'v' prefix if present)
          const versionNumber = data.name.replace(/^v/i, '');
          
          setDisplayVersion({
            id: data.id.toString(),
            versionNumber: versionNumber,
            creationDate: data.deployedAt,
            changes: changes,
            isShowWhatsNewBadge: false,
            whatsNewBadgeCount: 0,
          });
        } else {
          // Fallback to old version data if new endpoint fails
          setDisplayVersion(version);
        }
      });
    } else {
      // Reset state when modal closes
      setDeployedVersion(null);
      setDisplayVersion(null);
    }
  }, [open, callApi, version]);

  const renderSection = (type: ChangeType) => {
    const filtered = displayVersion?.changes?.filter((c) => c.type === type);
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
        <List dense>
          {filtered.map((change) => (
            <ListItem key={change.id} disableGutters>
              <Typography variant="body2" dir={dir} sx={{ display: "inline" }}>
                <strong style={{ direction: "ltr", unicodeBidi: "isolate" }}>
                  {change.title}
                </strong>
                {" : "}
                {change.name}
              </Typography>
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
      <DialogTitle
        id="go-make-dialog-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {`${t("header.whatsNewLabel")} ${displayVersion ? `(v${displayVersion.versionNumber})` : version ? `(v${version.versionNumber})` : ''}`}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="custom-scroller">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : displayVersion?.changes && displayVersion.changes.length > 0 ? (
          Object.values(ChangeType)
            .filter((v) => !isNaN(Number(v)))
            .map((type) => renderSection(Number(type)))
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            {t("header.noChangesAvailable") || "No changes available for this version."}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};
