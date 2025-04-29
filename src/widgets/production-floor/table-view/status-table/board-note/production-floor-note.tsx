// // components/ProductionFloorNote.tsx
// import { useState, useEffect } from "react";

// interface Props {
//   value: string;
//   onSave: (val: string) => void;
// }

// export const ProductionFloorNote = ({ value, onSave }: Props) => {
//   const [note, setNote] = useState(value);
//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     setNote(value); // Sync when parent value changes
//   }, [value]);

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newValue = e.target.value;
//     setNote(newValue);

//     // Debounce saving
//     if (timer) clearTimeout(timer);
//     const newTimer = setTimeout(() => {
//       onSave(newValue);
//     }, 1000); // Delay request by 1s
//     setTimer(newTimer);
//   };

//   return (
//     <textarea
//       value={note}
//       onChange={handleChange}
//       style={{
//         border: "1px solid #D1D1D1",
//         borderRadius: 6,
//         padding: 6,
//         height: "40px",
//         width: "100%",
//         fontSize: 12,
//         background: "#fff",
//         resize: "none",
//         outline: "none",
//         boxShadow: "none",
//       }}
//     />
//   );
// };

import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onSave: (val: string) => void;
}

export const ProductionFloorNote = ({ value, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(value);
  const { classes } = useStyle({ note });
  const { t } = useTranslation();

  useEffect(() => {
    setNote(value); // Sync if parent value changes
  }, [value]);

  const handleSave = () => {
    onSave(note);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNote(value);
    setIsEditing(false);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {!isEditing ? (
        <Box sx={classes.box} onClick={() => setIsEditing(true)}>
          <span>{note || t("productionFloor.clickToAddNote")}</span>
          {/* <Tooltip title={t("productionFloor.editNote")}> */}
          <EditIcon sx={classes.editIcon} />
          {/* </Tooltip> */}
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
