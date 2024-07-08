import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { useStyle } from './style';
import { GarlleryIcon } from '../icons/gallery-icon';
import { useTranslation } from 'react-i18next';

export const GoMakeImageFiled = ({ selectedNameFile , onChange}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [selectedFileNameInGoMakeFiled, setSelectedFileNameInGoMakeFiled] = useState(selectedNameFile || '');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setSelectedFileNameInGoMakeFiled(selectedNameFile || '');
    setImagePreview(selectedNameFile);
  }, [selectedNameFile]);

 
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFileNameInGoMakeFiled(file?.name);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div style={classes.inputContainer}>
      <div style={classes.fileInputStyle}>
        {imagePreview ||  selectedFileNameInGoMakeFiled ? (
          <img src={imagePreview}  style={{ width:"fit-content" , height:"fit-content" ,  maxHeight: '35px' , maxWidth: '100px', display:"flex", alignItems:"center"}} />
        ) : (
          <><GarlleryIcon /><label
              style={{
                color: '#9695C7',
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
                textOverflow: 'ellipsis',
              }}
            >
              {selectedFileNameInGoMakeFiled ? "" : t("general.uploadHere")}
            </label></>
        )}
        <input
          ref={fileInputRef}
          placeholder={t("general.upload")}
          onChange={handleFileSelect}
          accept=".jpg, .jpeg, .png, .gif, .svg, .pdf"
          type="file"
          style={{ display: 'none' }}
        />
        <Button variant="contained" onClick={handleButtonClick} style={{ backgroundColor: '#ED028C', height:"30px"}}>{t("general.uploadLogo")}</Button>
      </div>
    </div>
  );
};
