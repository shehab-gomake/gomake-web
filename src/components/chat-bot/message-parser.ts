import config from "@/config";
import {getUserToken} from "@/services/storage-data";

class MessageParser {
    actionProvider;

    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    async parse(message) {
        try {
            this.actionProvider.addLoader();
            const response = await fetch(config.api_server + '/v1/erp-service/chat-bot/send-msg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(getUserToken() && {Authorization: "Bearer " + getUserToken()}),
                },
                body: JSON.stringify({text: message})
            });

            const result = await response.json();
            if(result.data.data.isFinished){
                window.location.href = `products/create?clientTypeId=${result.data.data.clientTypeId}&customerId=${result.data.data.customserId}&productId=${result.data.data.productId}&isFromChatbot=true`;
                return;
            }
            this.actionProvider.removeLoader();
            this.actionProvider.greet(result.data.data.response);

        } catch (e) {

        }
    }
}

export default MessageParser;
