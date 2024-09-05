import Stack from "@mui/material/Stack";
import {SendFileMessageButtonComponent} from "@/widgets/messenger/components/send-file-message";
import InputBase from "@mui/material/InputBase";
import {IconButton} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

export interface IMessengerInputComponentProps {
    onSendMessage: (v: string)=>void;
    isBoardMissionsRoom: boolean;
    onSendFile: (file)=>void;
    onSendApprovalFile: (file)=>void;
}

const MessengerInputComponent = ({onSendMessage, isBoardMissionsRoom, onSendApprovalFile, onSendFile}: IMessengerInputComponentProps) => {
    const [value, setValue] = useState<string>('');
    const {t} = useTranslation();
    const {primaryColor, grayColor} = useGomakeTheme();
    const direction = t('direction');
    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            try {
                if (value) {
                 handelSendMessage();
                }
            } catch (e) {

            }
        }
    };
    const handelSendMessage = () => {
        onSendMessage(value);
        setValue('');
    }
    return <Stack style={{backgroundColor: primaryColor(100)}} borderRadius={'8px'}
                  direction={'row'} alignItems={'center'}>
        <SendFileMessageButtonComponent
            isBoardMissionsRoom={isBoardMissionsRoom}
            onSendApprovalFile={onSendApprovalFile}
            onSendFile={onSendFile}/>
        <InputBase
            onKeyDown={handleKeyDown}
            sx={{
                flex: 1,
                height: '48px'
            }}
            placeholder={t('messenger.inputPlaceHolder')}
            onChange={(e) => setValue(e.target.value)}
            value={value}/>
        <IconButton disabled={!value}
                    onClick={handelSendMessage}
                    sx={{p: '10px'}}>
            <SendIcon
                style={{
                    color: !!value ? primaryColor(500) : grayColor(500),
                    transform: `rotate(${direction === 'rtl' ? 180 : 0}deg)`,

                }}/>
        </IconButton>
    </Stack>
}

export {MessengerInputComponent}