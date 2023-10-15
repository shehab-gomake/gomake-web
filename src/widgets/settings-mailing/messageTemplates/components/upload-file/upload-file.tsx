import React, { useRef, useState } from 'react';
import { PdfIcon } from '@/components/icons/pdf-icon';
import { IconButton } from '@mui/material';
import { useStyle } from './style';

const UploadFileInput = () => {
    const { classes } = useStyle();
    const inputRef = useRef(null);
    const [selectedFileName, setSelectedFileName] = useState('order summary.pdf');

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
        } else {
            setSelectedFileName('order summary.pdf');
        }
    };

    const openFileSelector = () => {
        inputRef.current.click();
    };

    return (
        <div style={classes.pdfCellStyle}>
            <IconButton onClick={openFileSelector}>
                <PdfIcon height={19.66} width={16} />
            </IconButton>
            <label style={classes.pdfLabelStyle}>
                {selectedFileName}
            </label>
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                ref={inputRef}
            />
        </div>
    );
};

export { UploadFileInput };