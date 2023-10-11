import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { useStyle } from './style';
import { GarlleryIcon } from '../icons/gallery-icon';

export const GoMakeFileFiled = ({ selectedNameFile }) => {
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
        setImagePreview(base64Data); // Set the image preview
      };

      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(''); // Clear the image preview
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
              {selectedFileNameinGomakeFiled ? "" : 'Upload here'}
            </label></>
        )}

        <input
          ref={fileInputRef}
          placeholder={'upload'}
          onChange={handleInputChange}
          accept=".pdf, .jpg, .png"
          type="file"
          style={{ display: 'none' }}
        />
        <Button variant="contained" onClick={handleButtonClick} style={{ backgroundColor: '#ED028C' }}>
          Upload Logo
        </Button>
      </div>
    </div>
  );
};
