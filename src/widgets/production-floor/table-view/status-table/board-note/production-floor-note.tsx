import { useState, useEffect, useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";

interface Props {
  value: string;
  onSave: (val: string, reset: () => void, closeEditing: () => void) => void;
}

export const ProductionFloorNote = ({ value, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(value);
  const { classes } = useStyle({ note });
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { GetProductionFontSizeFromPreferences } = usePrintHousePreferences();

  useEffect(() => {
    setNote(value);
  }, [value]);

  const handleSave = () => {
    onSave(note, handleCancel, () => setIsEditing(false));
  };

  const handleCancel = () => {
    setNote(value);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      // Timeout ensures this runs after focus
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = el.value.length;
      }, 0);
    }
  }, [isEditing]);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {!isEditing ? (
        <Box sx={classes.box} onClick={() => setIsEditing(true)}>
          <span
            style={{
              ...classes.span,
              fontSize: GetProductionFontSizeFromPreferences(),
            }}
          >
            {note || t("productionFloor.clickToAddNote")}
          </span>
          <EditIcon sx={classes.editIcon} />
        </Box>
      ) : (
        <Box>
          <textarea
            ref={textareaRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoFocus
            dir={dir}
            style={{
              ...classes.textArea,
              fontSize: GetProductionFontSizeFromPreferences(),
              textAlign: isRTL ? "right" : "left",
            }}
          />
          <Box sx={classes.iconsBox}>
            <IconButton size="small" onClick={handleSave}>
              <CheckIcon fontSize="small" color="success" />
            </IconButton>
            <IconButton size="small" onClick={handleCancel}>
              <CloseIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};
