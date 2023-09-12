import React, {useRef, useState} from 'react';
import axios from 'axios';
import Stack from "@mui/material/Stack";
import {useGomakeAxios} from "@/hooks";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Button from "@mui/material/Button";
import {useCompanyProfile} from "@/hooks/use-company-profile";

const FileUploadComponent = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);
    const {callApi} = useGomakeAxios();
    const {} = useCompanyProfile();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        file?.dataTransfer?.setData('text/plain', '/new-profile-image')
        setSelectedFile(file);
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

    const handleUpload = async () => {
        try {
            if (!selectedFile) {
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);

                const response = await axios.post(`http://gomake-central-api.eu-west-3.elasticbeanstalk.com/api/PrintHouses/UploadPrintHouseImageFiles?printHouseLogoType=1`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'PrintHouseID': '4be15613-2e58-4c25-8f6c-fbb32a9d7797'
                    },
                });
                console.log('File uploaded successfully:', response.data);
            } catch (error) {
                // Handle any upload errors here.
                console.error('Error uploading file:', error);
            }
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
                    <div style={{
                        backgroundImage: `url(${selectedFile})`,
                        width: 180,
                        height: 180,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        borderRadius: '100%'
                    }}></div>
                    // <img style={{borderRadius: '100%', verticalAlign: 'middle'}} width={180} height={180} src={selectedFile}/>
                    : <CloudUploadOutlinedIcon fontSize={'large'} color={'primary'}/>}
            </div>
            <input
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={handleFileSelect}
                style={{display: 'none'}}
                ref={inputRef}
            />
            <Button variant={"contained"} onClick={() => inputRef.current?.click()}>Select File</Button>
            <Button color={"success"} variant={"contained"} onClick={handleUpload}>Upload</Button>
        </Stack>
    );
}

export {FileUploadComponent};