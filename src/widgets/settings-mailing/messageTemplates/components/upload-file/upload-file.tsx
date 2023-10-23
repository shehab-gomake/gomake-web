import React, { useRef, useState } from 'react';
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import { useStyle } from './style';
import { PdfIcon } from '@/components/icons/pdf-icon';

const PdfUploadComponent = ({ onUpload }: any) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('order summary.pdf');
    const inputRef = useRef(null);
    const { classes } = useStyle();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedFile(e.target.result);
                setSelectedFileName(file.name);

            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Stack direction={"column"} alignItems={'center'} justifyContent={'center'} gap={'10px'}>
            <div style={{ display: "flex", width: "180px", height: "40px", borderRadius: "4px", alignItems: "center" }}>
                <IconButton onClick={() => inputRef.current?.click()}>
                    <PdfIcon height={19.66} width={16} />
                </IconButton>
                <label style={classes.labelStyle}>
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

        </Stack>
    );
}


export { PdfUploadComponent };
