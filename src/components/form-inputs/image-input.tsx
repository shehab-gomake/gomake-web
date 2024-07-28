import React, { useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Button from "@mui/material/Button";
import { Avatar } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

interface IProps {
  onChange: (file: any) => void;
  value: any;
  size?: number;
}

const ImageUploadComponent = ({ onChange, value, size = 100 }: IProps) => {
  const [selectedFile, setSelectedFile] = useState(value);
  useEffect(() => {
    if (value) {
      setSelectedFile(value)
    }
  }, [value])
  const { classes } = useStyle();
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(e.target.result);
        onChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed black",
          borderRadius: "100%",
          textAlign: "center",
          boxSizing: "border-box",
        }}

        onDragOver={(e) => e.preventDefault()}
      >
        {selectedFile ? (
          <Avatar src={selectedFile} sx={{ width: 100, height: 100 }} />
        ) : (
          <CloudUploadOutlinedIcon fontSize="large" color="primary" />
        )}
      </div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png, .gif, .svg"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        ref={inputRef}
      />
      <Button variant={"contained"} onClick={() => inputRef.current?.click()} style={classes.selectBtn}>
        {t("materials.buttons.selectImage")}
      </Button>
    </Stack>
  );
};

export { ImageUploadComponent };
