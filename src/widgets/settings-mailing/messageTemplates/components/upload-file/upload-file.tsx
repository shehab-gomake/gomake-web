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
}
const PdfUploadComponent = ({ onUpload }: IProps) => {
    const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
    //const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(state?.attachment ? state?.attachment : 'order summary.pdf');

    const inputRef = useRef(null);
    const { classes } = useStyle();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // setSelectedFile(e.target.result);
                setSelectedFileName(file.name);
                setState({ ...state, fileBase64: e.target.result });

            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Stack direction={"column"} alignItems={'center'} justifyContent={'center'} gap={'10px'}>
            <div style={{ display: "flex", width: "180px", height: "40px", borderRadius: "4px", alignItems: "center" }}>
                {onUpload ? (
                    <IconButton onClick={() => inputRef.current?.click()}>
                        <PdfIcon height={19.66} width={16} />
                    </IconButton>
                ) : <span style={{ margin: "10px" }} >
                    <PdfIcon height={19.66} width={16} />
                </span>}
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