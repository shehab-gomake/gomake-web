import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import Stack from "@mui/material/Stack";
import { useRef, useState } from "react";
import { AddNewButton } from "@/components/button/add-new-button";
import { IconButton } from "@mui/material";
import { FileIcon } from "@/components/icons/file-icon";

interface IProps {
  onUpload: boolean;
  onFileSelect: (fileBase64: string) => void;
}

const JiraImageUpload = ({ onUpload, onFileSelect }: IProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle(onUpload);
  const [fileName, setFileName] = useState(t("mailingSettings.noAttachment") || "");
  const [isAttachment, setIsAttachment] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect1 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    let reader = new FileReader();

    if (file) {
      setFileName(file.name);
      reader.onload = async (e) => {
        setIsAttachment(true);
        const fileBase64 = e.target.result as string;
        onFileSelect(fileBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Stack style={classes.attachmentContainer}>
      {(!onUpload || fileName || isAttachment) && (
        <Stack style={classes.attachmentStyle}>
          <IconButton style={classes.IconButtonStyle}>
            <FileIcon></FileIcon>
          </IconButton>
          <label style={classes.labelStyle}>{isAttachment ? fileName : t("mailingSettings.noAttachment")}</label>
        </Stack>
      )}
      <input
        type="file"
        accept=".jpg, .jpeg, .png, .gif, .svg"
        onChange={handleFileSelect1}
        style={{ display: "none" }}
        ref={inputRef}
      />
      {onUpload && (
        <AddNewButton onClick={() => inputRef.current?.click()} label={t("mailingSettings.addNewAttachment")}></AddNewButton>
      )}
    </Stack>
  );
};

export { JiraImageUpload };
