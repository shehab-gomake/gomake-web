import { useEffect, useRef, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { useStyle } from './style';
import { GarlleryIcon } from '../icons/gallery-icon';
import { useTranslation } from 'react-i18next';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';

export const GoMakeImageFiled = ({ selectedNameFile , onChange }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir = t('direction');
  const isLtr = dir === 'ltr';
  const [selectedFileNameInGoMakeFiled, setSelectedFileNameInGoMakeFiled] = useState(selectedNameFile || '');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearFile = () => {
    setSelectedFileNameInGoMakeFiled('');
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange(null); 
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
          <img src={imagePreview} style={classes.imageContainerStyle} />
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
        <div>
        <Button 
        variant="contained" 
        onClick={handleButtonClick} 
        style={{ backgroundColor: '#ED028C', height: "30px",   marginRight: isLtr ? "3px" : "0", 
          marginLeft: !isLtr ? "3px" : "0"  }}
        >
          {t("general.uploadLogo")}
        </Button>
          <IconButton  onClick={handleClearFile} sx={{ fontSize: '1rem'}}>
            <FormatColorResetIcon sx={{color:"#a1a0cc"}}/>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
