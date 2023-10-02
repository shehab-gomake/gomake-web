import { Button } from "@mui/material";
import { GarlleryIcon } from "../icons/gallery-icon";
import { useStyle } from "./style";
import React, { ChangeEvent, useState } from "react";

export const GoMakeFileFiled = () => {
    const fileInputRef = React.createRef<HTMLInputElement>();
    const [selectedFileName, setSelectedFileName] = useState("");
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
          console.log("Base64 representation:", base64Data);
        };
  
        reader.readAsDataURL(selectedFile);
      }
    };
    
    const { classes } = useStyle();
    return (
        <div style={{ width: "330px" }}>
            <div style={classes.inputContainer} >
                <div style={classes.fileInputStyle}>
                    <GarlleryIcon />
                    <label style={{color:"#9695C7"}}>
                    {selectedFileName || "Upload here"} {/* Display selected file name or default text */}

                    </label>
                    <input
                    ref={fileInputRef}
                    placeholder={"upload"}
                    onChange={handleInputChange}
                    accept=".pdf, .jpg, .png"
                    type="file"
                    style={{ display: "none" }}
                    />
                    <Button
                    variant="contained"
                    onClick={handleButtonClick}
                    style={{ backgroundColor: "#ED028C" }}
                    >
                    Upload Logo
                    </Button>
                </div>
            </div>
       </div>
    )
  };
  