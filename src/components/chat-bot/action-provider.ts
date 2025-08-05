import {createClientMessage, createCustomMessage} from "react-chatbot-kit";
import io from "socket.io-client";
import config from "@/config";

class ActionProvider {
    createChatBotMessage
    setState
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        //this.initSocketIo()
    }
    async initSocketIo(){
        return  new Promise((resolve, reject) => {
            const socket = io(config.api_server);
            socket.on('chatbot-socket-io', (newData:any) => {
                let message = newData.message;
                let calculationUrl = newData.calculationUrl;
                const greetingMessage = createCustomMessage(message, 'bot', {loading: false});
                this.setState(prev => ({
                    ...prev,
                    messages: [...prev.messages, greetingMessage],
                }));
                if(calculationUrl){
                    const linkMsg = createCustomMessage("",
                        "link",{loading:false,payload:{ url: calculationUrl, label: "show summery " },}
                    );
                    this.setState(prev => ({
                        ...prev,
                        messages: [...prev.messages, linkMsg],
                    }));
                }
                
            });
            socket.on('connect', () => {
                resolve(socket.id);
            });
        });
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
