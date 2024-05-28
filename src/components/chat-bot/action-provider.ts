import {createCustomMessage} from "react-chatbot-kit";

class ActionProvider {
    createChatBotMessage
    setState
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
    }

    greet(msg: string) {
        const greetingMessage = createCustomMessage(msg, 'bot', {loading: false});
        this.setState(prev => ({
            ...prev,
            messages: [...prev.messages, greetingMessage],
        }));
    }
    addLoader() {
        const greetingMessage = createCustomMessage('', 'loader', {});
        this.setState(prev => ({
            ...prev,
            messages: [...prev.messages, greetingMessage],
        }));
    }

    removeLoader() {
        this.setState(prev => ({
            ...prev,
            messages: prev.messages.slice(0, -1),
        }));
    }
}

export default ActionProvider;
