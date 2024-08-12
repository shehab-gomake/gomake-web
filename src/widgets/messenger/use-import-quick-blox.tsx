import {QBConfig} from "@/widgets/messenger/QB-config";

let qbInstance = null;

const getQBInstance = async () => {
    if (!qbInstance) {
        const QuickBlox = (await import('quickblox')).default;

        QuickBlox.init(QBConfig.credentials.appId, QBConfig.credentials.authKey, QBConfig.credentials.authSecret, QBConfig.credentials.accountKey, {debug: true});

        qbInstance = QuickBlox;
    }

    return qbInstance;
};

export {getQBInstance}