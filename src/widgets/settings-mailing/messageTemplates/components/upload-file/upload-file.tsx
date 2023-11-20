import React, { useRef, useState } from 'react';
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import { useStyle } from './style';
import { useRecoilState } from 'recoil';
import { smsTemplateState } from '@/widgets/settings-mailing/states/state';
import { ISMSTemplate } from '../../interfaces/interface';
import { useTranslation } from 'react-i18next';
import { AddNewButton } from '@/components/button/add-new-button';
import { FileIcon } from '@/components/icons/file-icon';

interface IProps {
    onUpload: boolean;
    fileName?: string;
}


const PdfUploadComponent = ({ onUpload, fileName }: IProps) => {
    const { t } = useTranslation();
    const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
    const [selectedFileName, setSelectedFileName] = useState(t("mailingSettings.noAttachment"));
    const inputRef = useRef(null);
    const { classes } = useStyle();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedFileName("attachment.pdf");
                setState({ ...state, fileBase64: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Stack direction={"row"} alignItems={'center'} justifyContent={'center'} gap={'10px'}>
            {(!onUpload || ( fileName || selectedFileName != t("mailingSettings.noAttachment"))) && <Stack direction={"row"} gap={'10px'} boxShadow={onUpload ? "0px 1px 10px rgba(0, 0, 0, 0.08)" : "none"} borderRadius={"4px"} alignItems={"center"} justifyContent={"center"} width={"170px"} height={"40px"}>
                <IconButton style={classes.IconButtonStyle}>
                    <FileIcon></FileIcon>
                </IconButton>
                <label style={classes.labelStyle}>
                    {fileName != null ? "attachment.pdf" : selectedFileName}
                </label>
            </Stack>}
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                ref={inputRef}
            />
            {onUpload && <AddNewButton onClick={() => inputRef.current?.click()} label={t("mailingSettings.addNewAttachment")}></AddNewButton>}
        </Stack>
    );
}


export { PdfUploadComponent };