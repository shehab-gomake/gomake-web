import React, { useRef, useState } from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import { useGomakeAxios } from "@/hooks";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Button from "@mui/material/Button";

const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const { callApi } = useGomakeAxios();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      // Handle any upload errors here.
      console.error("Error uploading file:", error);
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
          width: "200px",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed black",
          borderRadius: "100%",
          textAlign: "center",
        }}
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {selectedFile ? (
          <p>Selected file: {selectedFile.name}</p>
        ) : (
          <CloudUploadOutlinedIcon fontSize={"large"} color={"primary"} />
        )}
      </div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png, .gif"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        ref={inputRef}
      />
      <Button variant={"contained"} onClick={() => inputRef.current?.click()}>
        Select File
      </Button>
      <Button color={"success"} variant={"contained"} onClick={handleUpload}>
        Upload
      </Button>
    </Stack>
  );
};

export { FileUploadComponent };
