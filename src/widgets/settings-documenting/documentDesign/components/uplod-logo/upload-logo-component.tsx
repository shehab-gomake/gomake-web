import React, {useRef, useState} from 'react';
import Stack from "@mui/material/Stack";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import Button from "@mui/material/Button";
import {IFileUploadComponentProps} from "@/widgets/settings-profile-widget/components/upload-file/interface";
import {Avatar} from "@mui/material";
import {useTranslation} from "react-i18next";

const LogoUploadComponent = ({onUpload}: IFileUploadComponentProps) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);
    const {t} = useTranslation();
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedFile(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedFile(e.target.result);
            };
            reader?.readAsDataURL(file);
        } else {
            setSelectedFile(null)
        }
        file?.dataTransfer?.setData('text/plain', '/new-profile-image')
        setSelectedFile(file);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            return;
        }
        onUpload(selectedFile);
    }


    return (
        <Stack direction={"column"} alignItems={'center'} justifyContent={'center'} gap={'10px'}>
            <div style={{
                width: '200px',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed black',
                borderRadius: "100%",
                textAlign: 'center',
                boxSizing: 'border-box',

            }}
                 onDrop={handleFileDrop}
                 onDragOver={(e) => e.preventDefault()}
            >
                {selectedFile ?
                    <Avatar src={selectedFile} sx={{width: 180, height: 180}}/>
                    : <CloudUploadOutlinedIcon fontSize={'large'} color={'primary'}/>}
            </div>
            <input
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={handleFileSelect}
                style={{display: 'none'}}
                ref={inputRef}
            />
            <Button variant={"contained"} onClick={() => inputRef.current?.click()}>{t('usersSettings.selectFile')}</Button>
            <Button color={"success"} variant={"contained"} onClick={handleUpload}>{t('usersSettings.uploadFile')}</Button>
        </Stack>
    );
}


export { LogoUploadComponent };
