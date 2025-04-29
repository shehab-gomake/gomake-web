import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onSave: (val: string, reset: () => void, closeEditing: () => void) => void;
}

export const ProductionFloorNote = ({ value, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(value);
  const { classes } = useStyle({ note });
  const { t } = useTranslation();

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
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {!isEditing ? (
        <Box sx={classes.box} onClick={() => setIsEditing(true)}>
          <span style={classes.span}>
            {note || t("productionFloor.clickToAddNote")}
          </span>
          <EditIcon sx={classes.editIcon} />
        </Box>
      ) : (
        <Box>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoFocus
            style={classes.textArea}
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
