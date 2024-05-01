import {PrimaryButton} from "@/components/button/primary-button";
import {MenuItem, Paper} from "@mui/material";
import {useRef, useState} from "react";
import {useRouter} from "next/router";
import {useUploadFiles} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/use-upload-files";
import {useRecoilState} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";

const MoreActionsButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const {query, replace, pathname} = useRouter();
    const fileInputRef = useRef(null);
    const {handleFileUpload} = useUploadFiles();
    const [companyProfile] = useRecoilState(printHouseProfile);
    const handleClose = () => {
        setOpen(false);
    };

    const onClickUpdateFile = () => {
        replace({pathname: pathname, query: {...query, step: 'files'}}, undefined, {shallow: true}).then();
        if (fileInputRef) {
            fileInputRef.current?.click();
        }
        handleClose();
    }

    const handleFileSelect = (e) => {
        [...e.target.files]?.forEach(async (file) => {
            console.log(file);
            await handleFileUpload(file)
        });
    };

    return (
        <div style={{position: 'relative'}}>
            <PrimaryButton onClick={() => setOpen(!open)} variant={'contained'}
                           sx={{width: '40px', height: '40px', padding: 0}}>...</PrimaryButton>
            {
                !!open && <Paper sx={{position: 'absolute', right: 0, top: '110%'}}>
                    {!!companyProfile.filesApiAddress && <MenuItem onClick={onClickUpdateFile}>upload file</MenuItem>}
                </Paper>
            }
            <input type={'file'} multiple value={''} onChange={handleFileSelect} hidden={true} ref={fileInputRef}/>
        </div>
    );
}

export {MoreActionsButton}