import {ChangeEvent, useRef, useState} from "react";
import {IconButton} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
interface IProps {
    onSendFile: (file) => void
}

const SendFileMessageButtonComponent = ({onSendFile}: IProps) => {
    const [, setFile] = useState<File | null>(null);
    const {primaryColor} = useGomakeTheme();
    const ref = useRef(null);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            onSendFile(event.target.files[0]);
        }
    };

    const onClick = () => {
        if (ref && ref.current) {
            ref.current.click();
        }
    }


    return (
        <>
            <IconButton onClick={onClick}>
               <GifBoxOutlinedIcon fontSize={'large'} style={{color: primaryColor(500)}} />
            </IconButton>
            <input ref={ref} type="file" onChange={handleFileChange} hidden={true}/>
        </>
    );
}

export {SendFileMessageButtonComponent};