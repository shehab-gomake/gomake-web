import {PrimaryButton} from "@/components/button/primary-button";
import {Paper} from "@mui/material";
import {useState} from "react";
import {ArrowDownIcon} from "@/icons";

const DocumentsButton = () => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <div style={{position: 'relative'}}>
            <PrimaryButton onClick={()=>setOpen(!open)} variant={'contained'} endIcon={<ArrowDownIcon fill={'#FFF'}/>}>Documents</PrimaryButton>
            {
                !!open && <Paper sx={{position: 'absolute', right: 0, top: '110%'}}>
                </Paper>
            }
        </div>
    );
}

export {DocumentsButton}