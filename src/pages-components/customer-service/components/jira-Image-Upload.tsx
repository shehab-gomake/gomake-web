import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { AddNewButton } from "@/components/button/add-new-button";
import { FileIcon } from "@/components/icons/file-icon";
import { Close as ResetIcon } from "@mui/icons-material";

interface IProps {
  onUpload: boolean;
  onFileSelect: (file: File | null) => void;
}

const JiraImageUpload = forwardRef(
  ({ onUpload, onFileSelect }: IProps, ref) => {
    const { t } = useTranslation();
    const { classes } = useStyle(onUpload);
    const [fileName, setFileName] = useState(
      t("mailingSettings.noAttachment") || ""
    );
    const [isAttachment, setIsAttachment] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];

      if (selectedFile) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setIsAttachment(true);
        onFileSelect(selectedFile);
      }
    };

    const resetAttachment = () => {
      setFileName(t("mailingSettings.noAttachment") || "");
      setIsAttachment(false);
      setFile(null);
      onFileSelect(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    useImperativeHandle(ref, () => ({
      resetAttachment,
    }));

    return (
      <Stack style={classes.attachmentContainer}>
        {onUpload && (
          <AddNewButton
            onClick={() => inputRef.current?.click()}
            label={t("mailingSettings.addNewAttachment")}
          />
        )}
        {(!onUpload || fileName) && isAttachment && (
          <Stack
            style={classes.attachmentStyle}
            direction="row"
            alignItems="center"
          >
            <IconButton style={classes.IconButtonStyle}>
              <FileIcon />
            </IconButton>
            <label style={classes.labelStyle}>
              {isAttachment
                ? fileName.length > 30
                  ? fileName.slice(0, 27) + "..."
                  : fileName
                : t("mailingSettings.noAttachment")}
            </label>
            {isAttachment && (
              <IconButton
                style={classes.resetIconStyle}
                onClick={resetAttachment}
                title={t("mailingSettings.resetAttachment")}
              >
                <ResetIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        )}
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .gif, .svg"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          ref={inputRef}
        />
      </Stack>
    );
  }
);

export { JiraImageUpload };
