import React, { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import { PrimaryButton } from "@/components/button/primary-button";
import { IFileUploadComponentProps } from "@/widgets/settings-profile-widget/components/upload-file/interface";
import { Avatar } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const FileUploadComponent = ({ onUpload }: IFileUploadComponentProps) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { primaryColor } = useGomakeTheme();
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(e.target.result);
      };
      reader?.readAsDataURL(file);
    } else {
      setSelectedFile(null);
    }
    file?.dataTransfer?.setData("text/plain", "/new-profile-image");
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      return;
    }
    onUpload(selectedFile);
  };

  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={"10px"}
    >
      <div
        style={{
          width: "200px",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed black",
          borderRadius: "100%",
          textAlign: "center",
          boxSizing: "border-box",
        }}
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {selectedFile ? (
          <Avatar src={selectedFile} sx={{ width: 180, height: 180 }} />
        ) : (
          <CloudUploadOutlinedIcon
            fontSize={"large"}
            style={{ color: primaryColor(500) }}
          />
        )}
      </div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png, .gif"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        ref={inputRef}
      />
      <PrimaryButton
        variant={"contained"}
        onClick={() => inputRef.current?.click()}
        style={{ width: "fit-content" }}
      >
        {t("usersSettings.selectFile")}
      </PrimaryButton>
      <PrimaryButton
        color={"success"}
        variant={"contained"}
        onClick={handleUpload}
        disabled={selectedFile === null ? true : false}
        style={{ width: "fit-content" }}
      >
        {t("usersSettings.uploadFile")}
      </PrimaryButton>
    </Stack>
  );
};

export { FileUploadComponent };
