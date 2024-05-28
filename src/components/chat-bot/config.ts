import {createChatBotMessage} from 'react-chatbot-kit';
import {useTranslation} from "react-i18next";
import IConfig from "react-chatbot-kit/src/interfaces/IConfig";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {LoadingMsgComponent} from "@/components/chat-bot/loading-msg-component";

const useChatConfig = (userAvatar: () => JSX.Element, botAvatar: () => JSX.Element) => {
    const {t} = useTranslation();
    const chatbotConfig: IConfig = {
        botName: t('chatBot.chatTitle'),
        initialMessages: [createChatBotMessage(t(`chatBot.welcomeMsg`), {loading: true})],
        customMessages: {
            loader: LoadingMsgComponent
        },
        customComponents: {
            userAvatar: userAvatar,
            botAvatar: botAvatar,
        }
    }
    const  clearChat = async () =>  {
        debugger
        const response = await fetch(config.api_server + '/v1/erp-service/chat-bot/clear-chat', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(getUserToken() && {Authorization: "Bearer " + getUserToken()}),
            },
        });
    }
    return {
        chatbotConfig,
        clearChat
    }
}

export {useChatConfig};
