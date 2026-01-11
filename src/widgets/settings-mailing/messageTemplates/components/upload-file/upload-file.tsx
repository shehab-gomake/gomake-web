import { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import { Button, IconButton } from "@mui/material";
import { useStyle } from "./style";
import { useRecoilState } from "recoil";
import { smsTemplateState } from "@/widgets/settings-mailing/states/state";
import { ISMSTemplate } from "../../interfaces/interface";
import { useTranslation } from "react-i18next";
import { AddNewButton } from "@/components/button/add-new-button";
import { FileIcon } from "@/components/icons/file-icon";
import { DeleteIcon } from "@/pages-components/quotes/more-circle/icons/delete";

interface IProps {
  onUpload: boolean;
  fileName?: string;
}

const PdfUploadComponent = ({ onUpload, fileName }: IProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle(onUpload);
  const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
  const [isAttachment, setIsAttachment] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIsAttachment(true);
        setState({ ...state, fileBase64: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setIsAttachment(false);
    setState({ ...state, fileBase64: null, attachment: null });
  };

  return (
    <Stack style={classes.attachmentContainer}>
      {(!onUpload || fileName || isAttachment) && (
        <Stack style={classes.attachmentStyle}>
          <IconButton style={classes.IconButtonStyle}>
            <FileIcon />
          </IconButton>
          <label style={classes.labelStyle}>
            {!!fileName
              ? "attachment.pdf"
              : isAttachment
              ? "attachment.pdf"
              : t("mailingSettings.noAttachment")}
          </label>
        </Stack>
      )}
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        ref={inputRef}
      />

      {onUpload && !isAttachment && !state?.attachment && (
        <AddNewButton
          onClick={() => inputRef.current?.click()}
          label={t("mailingSettings.addNewAttachment")}
        />
      )}

      {onUpload && (isAttachment || state?.attachment) && (
        <Button
          sx={classes.removeBtn}
          startIcon={<DeleteIcon color={"#f44336"} />}
          variant={"text"}
          onClick={handleRemove}
        >
          {t("mailingSettings.removeAttachment")}
        </Button>
      )}
    </Stack>
  );
};

export { PdfUploadComponent };
