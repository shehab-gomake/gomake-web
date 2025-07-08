import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { lastVersionState } from "@/store/last-version-state";

interface WhatsNewModalProps {
  open: boolean;
  onClose: () => void;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  open,
  onClose,
}) => {
  const version = useRecoilValue(lastVersionState);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>What's New (v{version?.versionNumber})</DialogTitle>
      <DialogContent>
        <List>
          {version?.changes.map((change) => (
            <ListItem key={change.id}>
              <Typography>
                <strong>{change.title}</strong>: {change.name}
              </Typography>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
