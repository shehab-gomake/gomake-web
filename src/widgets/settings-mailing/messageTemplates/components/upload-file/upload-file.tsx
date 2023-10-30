import React, { useRef, useState } from 'react';
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import { useStyle } from './style';
import { PdfIcon } from '@/components/icons/pdf-icon';
import { useRecoilState } from 'recoil';
import { smsTemplateState } from '@/widgets/settings-mailing/states/state';
import { ISMSTemplate } from '../../interfaces/interface';

interface IProps {
    onUpload: boolean;
    fileName?: string;
}

const PdfUploadComponent = ({ onUpload , fileName="order summary.pdf" }: IProps) => {
    const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
    const [selectedFileName, setSelectedFileName] = useState(state?.attachment );
    const inputRef = useRef(null);
    const { classes } = useStyle();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedFileName(file.name);
                setState({ ...state, fileBase64: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Stack direction={"column"} alignItems={'center'} justifyContent={'center'} gap={'10px'}>
            <div style={{ display: "flex", width: "180px", overflow: "hidden", height: "40px", borderRadius: "4px", alignItems: "center" }}>
                {onUpload ? (
                    <IconButton onClick={() => inputRef.current?.click()}>
                        <PdfIcon />
                    </IconButton>
                ) : <span style={{ margin: "10px" }} >
                    <PdfIcon />
                </span>}
                <label style={classes.labelStyle}>
                    {selectedFileName && selectedFileName!="" ? selectedFileName : fileName}
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