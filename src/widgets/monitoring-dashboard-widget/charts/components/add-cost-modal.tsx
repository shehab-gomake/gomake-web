import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type AddCostModalProps = {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  type: "actual" | "target" | null;
};

const AddCostModal = ({
  open,
  onClose,
  value,
  onChange,
  onSubmit,
  type,
}: AddCostModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {type === "actual"
          ? t("dashboard.addActualCost")
          : t("dashboard.addTargetCost")}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t("dashboard.enterAmount")}
          type="number"
          fullWidth
          variant="outlined"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          InputLabelProps={{
            shrink: true,
            style: { color: "#2e3092" },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#2e3092",
          }}
        >
          {t("modal.cancel")}
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#2e3092",
            "&:hover": {
              backgroundColor: "#24257a",
            },
          }}
        >
          {t("navigationButtons.add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCostModal;
