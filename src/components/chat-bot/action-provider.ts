class ActionProvider {
    createChatBotMessage
    setState
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
    }

    greet(msg: string) {
        const greetingMessage = this.createChatBotMessage(msg);
        this.setState(prev => ({
            ...prev,
            messages: [...prev.messages, greetingMessage],
        }));
    }
}

export default ActionProvider;
