import { useState, useEffect } from "react";
import { GoMakeModal } from "@/components";
import { useTranslation } from "react-i18next";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { CreateTicketRequest } from "@/services/api-service/tickets/tickets-api";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketRequest) => Promise<void>;
}

export const CreateTicketModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateTicketModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateTicketRequest>({
    title: "",
    description: "",
    priority: "medium",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: "", description: "", priority: "medium" });
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", description: "", priority: "medium" });
    }
  }, [isOpen]);

  return (
    <GoMakeModal
      openModal={isOpen}
      modalTitle={t("tickets.createTicket")}
      onClose={onClose}
      insideStyle={{ width: 600 }}
    >
      <Stack direction="column" spacing={2} sx={{ padding: "20px" }}>
        <TextField
          label={t("tickets.title")}
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          fullWidth
        />

        <TextField
          label={t("tickets.description")}
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          fullWidth
        />

        <TextField
          select
          label={t("tickets.priority")}
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
          fullWidth
        >
          <MenuItem value="low">{t("tickets.priorityLow")}</MenuItem>
          <MenuItem value="medium">{t("tickets.priorityMedium")}</MenuItem>
          <MenuItem value="high">{t("tickets.priorityHigh")}</MenuItem>
          <MenuItem value="urgent">{t("tickets.priorityUrgent")}</MenuItem>
        </TextField>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onClose} variant="outlined">
            {t("materials.buttons.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || submitting}
          >
            {submitting ? t("tickets.creating") : t("tickets.create")}
          </Button>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

