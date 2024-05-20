import Chatbot from "react-chatbot-kit";
import MessageParser from "@/components/chat-bot/message-parser";
import ActionProvider from "@/components/chat-bot/action-provider";
import 'react-chatbot-kit/build/main.css';
import {useState} from "react";
import {Avatar, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useChatConfig} from "@/components/chat-bot/config";
import {useRecoilValue} from "recoil";
import {userProfileState} from "@/store/user-profile";

const ChatBotComponent = () => {
    const [open, setOpen] = useState<boolean>(false);
    const userProfile = useRecoilValue(userProfileState);
    const userAvatar = ()=><Avatar src={userProfile.imagePath}/>
    const botAvatar = () => <Avatar src={"https://gomake-contents.s3.eu-west-3.amazonaws.com/chatbot_icon.png"}/>
    const {config} = useChatConfig(userAvatar, botAvatar);
    const toggleChat = () => {
        setOpen(!open);
    }
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px'
        }}>
            {
                open && <div>
                    <Chatbot
                        config={config}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                    />
                </div>
            }
            <IconButton style={{width: '50px', height: '50px',}} onClick={toggleChat}>
                {open ? <CloseIcon /> :
                    <img src="https://gomake-contents.s3.eu-west-3.amazonaws.com/chatbot_icon.png" alt="Chat"
                         style={{width: '50px', height: '50px',}}/>
                }</IconButton>
        </div>
    )
}

export {ChatBotComponent}