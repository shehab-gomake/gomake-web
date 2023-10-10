import { Stack } from "@mui/material";
import { ChangeEvent, useState } from "react";
import React from "react";
import { PDFIcon } from "../icons/PDFicon";
import { PictureAsPdfOutlined } from "@mui/icons-material";


const UploadFileInput = ({selectedNameFile}) => {
    const fileInputRef = React.createRef<HTMLInputElement>();
    const [selectedFileName, setSelectedFileName] = useState(selectedNameFile);
    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      setSelectedFileName(selectedFile.name);
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
        };
  
        reader.readAsDataURL(selectedFile);
      }
    };
    
  

    return (   
            <Stack style={{
                borderRadius: "4px",
                height:" 40px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
                color:" #8283BE",backgroundColor:"#FFFFFF",padding:10}} direction={'row'}>
                <PictureAsPdfOutlined style={{marginLeft:10}} />
                    <label style={{color:"#9695C7",marginLeft:30}}>
                    {selectedFileName || "Upload here"}
                    </label>
                    <input
                    ref={fileInputRef}
                    placeholder={"upload"}
                    onChange={handleInputChange}
                    accept=".pdf, .jpg, .png"
                    type="file"
                    style={{ display: "none" }}
                    />
            </Stack>
      
    );
};

export {UploadFileInput };
  