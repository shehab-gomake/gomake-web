import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { useStyle } from './style';
import { GarlleryIcon } from '../icons/gallery-icon';
import { useTranslation } from 'react-i18next';

export const GoMakeFileFiled = ({ selectedNameFile }) => {
  const {t} = useTranslation();
  const [selectedFileNameinGomakeFiled, setselectedFileNameinGomakeFiled] = useState(
    selectedNameFile || ''
  );
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);


  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setselectedFileNameinGomakeFiled(selectedNameFile || '');
    setImagePreview(selectedNameFile);
  }, [selectedNameFile]);

  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setselectedFileNameinGomakeFiled(selectedFile.name);

    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setImagePreview(base64Data);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(''); 
    }
  };

  const { classes } = useStyle();

  return (
    <div style={classes.inputContainer}>
      <div style={classes.fileInputStyle}>
        {imagePreview ||  selectedFileNameinGomakeFiled ? (
          <img src={imagePreview}  style={{ maxWidth: '100px', maxHeight: '100px' , display:"flex", alignItems:"center"}} />
        ) : (
          <><GarlleryIcon /><label
              style={{
                color: '#9695C7',
                overflow: 'hidden',
                whiteSpace: 'pre-wrap',
                textOverflow: 'ellipsis',
              }}
            >
              {selectedFileNameinGomakeFiled ? "" : t("general.uploadHere")}
            </label></>
        )}
        <input
          ref={fileInputRef}
          placeholder={t("general.upload")}
          onChange={handleInputChange}
          accept=".pdf, .jpg, .png"
          type="file"
          style={{ display: 'none' }}
        />
        <Button variant="contained" onClick={handleButtonClick} style={{ backgroundColor: '#ED028C' }}>{t("general.uploadLogo")}</Button>
      </div>
    </div>
  );
};
