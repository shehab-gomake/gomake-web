import config from "@/config";
import {getUserToken} from "@/services/storage-data";

class MessageParser {
    actionProvider;

    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    async parse(message) {
        try {

            const response = await fetch(config.api_server + '/v1/erp-service/chat-bot/send-msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(getUserToken() && {Authorization: "Bearer " + getUserToken()}),
                },
                body: JSON.stringify({text: message})
            });

            const result = await response.json();
            const lowerCaseMessage = message.toLowerCase();
            console.log(result);

            result.data.data.isFinished = true;
            if(result.data.data.isFinished){
                window.location.href = `products/create?clientTypeId=${result.data.data.clientTypeId}&customerId=${result.data.data.customserId}&productId=${result.data.data.productId}&isFromChatbot=true`;
                return;
            }
            this.actionProvider.greet(result.data.data.response);

        } catch (e) {

        }
    }
}

export default MessageParser;
