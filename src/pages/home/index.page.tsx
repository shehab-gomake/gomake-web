import {CustomerAuthLayout} from "@/layouts";
import {HomePageComponentForAdmin} from "@/pages-components/admin/home/home";
import {useEffect, useState} from "react";

export default function Home() {
    return (
        <CustomerAuthLayout>
            <HomePageComponentForAdmin isAdmin={false}/>
        </CustomerAuthLayout>
    );
}

export const CustomChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };
    return (
        <>
            <button onClick={toggleChat} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, border: 0 }}>
                <img src="/Go-01.svg" alt="Chat" style={{ width: '50px', height: '50px', }} />
            </button>
            {
              isOpen &&    <df-messenger
                    location="europe-west3"
                    project-id="extended-legend-421710"
                    agent-id="6e4422f6-82ba-4960-99d7-0b4685406eae"
                    language-code="en"
                    max-query-length="-1"
                    style={{ display: 'block', position: 'fixed', bottom: '80px', right: '16px', zIndex: 999 }}>
                    <df-messenger-chat chat-title="go bot"/>
                </df-messenger>
            }
        </>
    );
};