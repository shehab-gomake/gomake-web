import { Button } from "@mui/material";
import { GarlleryIcon } from "../icons/gallery-icon";
import { useStyle } from "./style";
import React, { ChangeEvent, useEffect, useState } from "react";

export const GoMakeFileFiled = ({selectedNameFile}) => {
    console.log("selectedNameFile in GoMakeFileFiled component : " + selectedNameFile);

    const fileInputRef = React.createRef<HTMLInputElement>();
    const [selectedFileNameinGomakeFiled, setselectedFileNameinGomakeFiled] = useState(selectedNameFile);
    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
    useEffect(() => {
      setselectedFileNameinGomakeFiled(selectedNameFile || "");
    }, [selectedNameFile]);
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      setselectedFileNameinGomakeFiled(selectedFile.name);
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
        };
  
        reader.readAsDataURL(selectedFile);
      }
    };
  
    const { classes } = useStyle();
    return (
       
            <div style={classes.inputContainer} >
                <div style={classes.fileInputStyle}>
                  { selectedFileNameinGomakeFiled ? "" :   <GarlleryIcon /> }
                    <label style={{color:"#9695C7",overflow:"hidden"}}>
                        {selectedFileNameinGomakeFiled || "Upload here"} 
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
    )
  };
  