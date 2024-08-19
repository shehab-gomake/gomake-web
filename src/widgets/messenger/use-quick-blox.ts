import {useInitQuickBlox} from "@/widgets/messenger/use-init-quick-blox";
import {useSnackBar} from "@/hooks";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";
import {QBChatNewMessage, QBSystemMessage} from "quickblox";
import {EFileStatus} from "@/widgets/messenger/enums";

const useQuickBlox = () => {
    const {QB, sessionUser, isChatConnected} = useInitQuickBlox();
    const {alertFaultGetData, alertSuccessAdded, alertFaultUpdate} = useSnackBar();
    const APPROVAL_REQUEST_CLASS_NAME = 'ApprovalRequest';
    //listeners
    const listenToNewMessages = (listener: (userId, message) => void) => {
        if (isChatConnected) {
            QB.chat.onMessageListener = listener
        }
    }
    const listenToDialogsUpdates = (listener: (v) => void) => {
        if (isChatConnected) {
            QB.chat.onDialogUpdateListener  = listener
        }
    }

    const listenToSystemMessages = (listener: (message) => void) => {

        QB.chat.onSystemMessageListener = listener
    }

    const destroyListeners = () => {
        QB.chat.onMessageListener = () => {
        }
        QB.chat.onSystemMessageListener = () => {
        }
    };

    //Dialogs
    const getChatDialogs = (): Promise<IChatDialog[]> => {
        return new Promise((resolve, reject) => {
            QB?.chat.dialog.list({}, (err, res) => {
                if (err) {
                    alertFaultGetData();
                    reject([]);
                } else {
                    resolve(res.items);
                }
            });
        });
    }
    //Dialog
    const joinToDialog = (roomJid: string) => {
        QB.chat.muc.join(roomJid, function () {
        });
    };
    const getRoomJidFromDialogId = (dialogId: string): string => {
        return QB.chat.helpers.getRoomJidFromDialogId(dialogId)
    }
    const getDialogMessages = (dialogId: string) => {
        return new Promise((resolve, reject) => {
            QB.chat.message.list({chat_dialog_id: dialogId}, (err, result) => {
                if (err) {
                    alertFaultGetData();
                    reject([])
                } else {
                    resolve(result.items);
                    alertSuccessAdded();
                }
            });
        })
    }

    //Messages
    const sendMessage = (dialogId: string, message: QBChatNewMessage): Promise<string> => {
        return new Promise((resolve, reject) => {
            const roomJid = getRoomJidFromDialogId(dialogId);
            QB.chat.send(roomJid, message, (e, r) => {
                if (e) {
                    reject(e);
                } else {
                    resolve(r)
                }
            })
        })
    }

    //Messages Files
    const uploadFile = (params): Promise<{ uid: string; content_type: string; size: number; name: string }> => {
        return new Promise((resolve, reject) => {
            QB.content.createAndUpload(params, (err, res) => {
                if (err) {
                    reject(err);
                    alertFaultUpdate();
                } else {
                    resolve(res)
                }
            });
        })
    }

    const getAttachmentUrl = (attachmentId: string): string => {
        return QB.content.privateUrl(attachmentId)
    }


    //System messages

    const sendSystemMessage = (senderId: number, message: { extension: QBSystemMessage['extension'] }) => {
        QB.chat.sendSystemMessage(senderId, message);
    }


    //Data
    const createNewApprovalRequestObj = (): Promise<{ _id: string }> => {
        const OPTIONS = {
            status: EFileStatus.PENDING,
            permissions: {
                "update": {
                    "access": "open"
                }
            }
        }
        return new Promise((resolve, reject) => {
            QB.data.create(APPROVAL_REQUEST_CLASS_NAME, OPTIONS, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    const getApprovalFileStatus = (id): Promise<{ status: EFileStatus }> => {
        return new Promise((resolve, reject) => {
            QB.data.list(APPROVAL_REQUEST_CLASS_NAME, {_id: id}, (error, response) => {
                if (error) {
                    alertFaultGetData();
                    reject(error)
                } else {
                    const item = response.items.find(item => item._id === id);
                    resolve(item);
                }
            });
        });
    };

    const dialogs = {
        getDialogs: getChatDialogs,
        getMessages: getDialogMessages,
        join: joinToDialog,
        getRoomJid: getRoomJidFromDialogId
    };
    const listeners = {
        onMessage: listenToNewMessages,
        onSystemMessage: listenToSystemMessages,
        destroy: destroyListeners,
        onDialogUpdate: listenToDialogsUpdates
    };
    const customObj = {
        create: createNewApprovalRequestObj,
        getData: getApprovalFileStatus
    };
    const messages = {
        send: sendMessage,
        uploadFile,
        getAttachmentUrl

    }
    const systemMessage = {
        send: sendSystemMessage
    }

    return {
        listeners,
        dialogs,
        customObj,
        messages,
        systemMessage,
        sessionUser,
        isChatConnected
    }
}

export {useQuickBlox}