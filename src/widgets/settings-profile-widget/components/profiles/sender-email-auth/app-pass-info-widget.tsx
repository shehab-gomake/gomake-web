// AppPassInfoIcon.tsx
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButtonClose from "@mui/icons-material/Close";
import { GoMakeDialog } from "@/components/dialog/dialog";

interface IAppPassInfoIconProps {
  youtubeUrl: string;
}

const AppPassInfoIcon: React.FC<IAppPassInfoIconProps> = ({ youtubeUrl }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        style={{ padding: 0, cursor: "pointer" }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>

      <GoMakeDialog
        open={open}
        onClose={handleClose}
        title="Video Guide"
        buttonText="modal.close"
      >
        <iframe
          width="100%"
          height="500"
          src={youtubeUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </GoMakeDialog>
    </>
  );
};

export { AppPassInfoIcon };
