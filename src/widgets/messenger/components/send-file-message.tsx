import {ChangeEvent, useRef, useState} from "react";
import {IconButton} from "@mui/material";

interface IProps {
    onSendFile: (file) => void
}

const SendFileMessageButtonComponent = ({onSendFile}: IProps) => {
    const [file, setFile] = useState<File | null>(null);
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <g id="Iconsax">
                        <path id="Vector"
                              d="M11.9688 12V15.5C11.9688 17.43 13.5388 19 15.4688 19C17.3987 19 18.9688 17.43 18.9688 15.5V10C18.9688 6.13 15.8388 3 11.9688 3C8.09875 3 4.96875 6.13 4.96875 10V16C4.96875 19.31 7.65875 22 10.9688 22"
                              stroke="black" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </g>
                </svg>
            </IconButton>
            <input ref={ref} type="file" onChange={handleFileChange} hidden={true}/>
        </>
    );
}

export {SendFileMessageButtonComponent};