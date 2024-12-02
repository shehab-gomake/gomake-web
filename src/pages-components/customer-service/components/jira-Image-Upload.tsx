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
import { Close as ResetIcon } from "@mui/icons-material"; // Add Reset Icon

interface IProps {
  onUpload: boolean;
  onFileSelect: (fileBase64: string) => void;
}

const JiraImageUpload = forwardRef(
  ({ onUpload, onFileSelect }: IProps, ref) => {
    const { t } = useTranslation();
    const { classes } = useStyle(onUpload);
    const [fileName, setFileName] = useState(
      t("mailingSettings.noAttachment") || ""
    );
    const [isAttachment, setIsAttachment] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const resetAttachment = () => {
      setFileName(t("mailingSettings.noAttachment") || "");
      setIsAttachment(false);
      onFileSelect("");
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
        {(!onUpload || fileName || isAttachment) && (
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
