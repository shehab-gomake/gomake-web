import {createChatBotMessage} from 'react-chatbot-kit';
import {useTranslation} from "react-i18next";
import IConfig from "react-chatbot-kit/src/interfaces/IConfig";

const useChatConfig = (userAvatar: () => JSX.Element, botAvatar: () => JSX.Element) => {
    const {t} = useTranslation();
    const config: IConfig = {
        botName: t('chatBot.chatTitle'),
        initialMessages: [createChatBotMessage(t(`chatBot.welcomeMsg`), {loading: true})],
        customComponents: {
            userAvatar: userAvatar,
            botAvatar: botAvatar,
}
    }
    return {
        config
    }
}

export {useChatConfig};
