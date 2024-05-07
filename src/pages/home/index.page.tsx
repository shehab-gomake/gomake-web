import {CustomerAuthLayout} from "@/layouts";
import {HomePageComponentForAdmin} from "@/pages-components/admin/home/home";
import {useState} from "react";
import {IconButton} from "@mui/material";

export default function Home() {
    return (
        <CustomerAuthLayout>
            <HomePageComponentForAdmin isAdmin={false}/>
        </CustomerAuthLayout>
    );
}

export const CustomChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <IconButton onClick={toggleChat} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, border: 0 }}>
                <img src="https://gomake-contents.s3.eu-west-3.amazonaws.com/chatbot_icon.png" alt="Chat" style={{ width: '50px', height: '50px', }} />
            </IconButton>
            {
              isOpen && <df-messenger
                    location="europe-west3"
                    projectId="extended-legend-421710"
                    agent-id="6e4422f6-82ba-4960-99d7-0b4685406eae"
                    language-code="en"
                    max-query-length="-1"
                    style={{ display: 'block', position: 'fixed' as 'fixed', bottom: '80px', right: '16px', zIndex: 999, height: '500px', width: '300px' }}>
                    <df-messenger-chat chat-title="go bot"/>
                </df-messenger>
            }
        </>
    );
};