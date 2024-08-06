import {useQuickBlox} from "@/widgets/messenger/use-quick-blox";
import {useCallback, useEffect, useState} from "react";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";
import {IChatMessage} from "@/widgets/messenger/interfaces/chat-message";
import {EFileStatus} from "@/widgets/messenger/enums";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {getUsersMetaDataApi, updateApprovalFileApi} from "@/services/api-service/chat/quick-blox-chat-endpoints";
import {QBChatNewMessage} from "quickblox";

const useMessenger = () => {
    const [selectedDialog, setSelectedDialog] = useState<IChatDialog | null>(null);
    const [dialogs, setDialogs] = useState<IChatDialog[]>([]);
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
    const [updatedApprovalRequestId, setUpdatedApprovalRequestId] = useState<{ approvalRequestId: string, newStatus: EFileStatus }>();
    const [usersMetaData, setUsersMetaDta] = useState([]);
    const {alertFaultUpdate} = useSnackBar();
    const unreadMessages = useCallback(() => {
        return dialogs?.reduce((partialSum, dialog) => partialSum + dialog.unread_messages_count, 0);
    }, [dialogs]);

    const files = useCallback(() => {
        return messages.filter(msg => !!msg.approval_Request_id);
    }, [messages])
    const {callApi} = useGomakeAxios();
    const messenger = useQuickBlox();

    const getUsersMetaDta = async (userIds: string[]) => {
        const callBack = res => {
            if (res.success) {
                setUsersMetaDta(res.data);
            } else {

            }
        }
        await getUsersMetaDataApi(callApi, callBack, {userIds});
    };

    const getDialogMessages = async () => {
        const messages = await messenger.dialogs.getMessages(selectedDialog._id);
        setMessages(messages as IChatMessage[]);
    }

    const getDialogs = async () => {
        const dialogs = await messenger.dialogs.getDialogs();
        setDialogs(dialogs)
    }

    const onMessage = (userId, message) => {
        if (message.dialog_id === selectedDialog?._id) {
            setMessages(prevState => ([
                ...prevState,
                {
                    ...message,
                    sender_id: +message.extension?.sender_id,
                    attachments: message.extension?.attachments,
                    approval_Request_id: message.extension?.approval_Request_id,
                    message: message.body,
                    date: new Date(message.date_sent * 1000),
                }
            ]))
        }
    };

    const onSystemMessage = (systemMessage) => {
        setUpdatedApprovalRequestId({
            approvalRequestId: systemMessage.extension.approval_request_id,
            newStatus: systemMessage.extension.newStatus
        });
    };

    const sendTextMessage = async (text: string) => {
        const message = {
            type: 'groupchat',
            body: text,
            extension: {
                dialog_id: selectedDialog?._id,
                save_to_history: 1,
                sender_id: messenger.sessionUser.userId,
            },
            markable: 1,
        };
        await messenger.messages.send(selectedDialog._id, message as QBChatNewMessage)
    };


    const sendApprovalFileMessage = async (file) => {
        try {
            setUploadingFiles(true);
            const fileParams = {
                name: file.name,
                file: file,
                type: file.type,
                size: file.size,
                'public': false
            };
            const approvalRequestObj = await messenger.customObj.create();
            const uploadedFile = await messenger.messages.uploadFile(fileParams);
            if (uploadedFile.uid) {
                setUploadingFiles(false)
            }
            const attachment = {
                id: uploadedFile?.uid,
                type: uploadedFile?.content_type,
                size: uploadedFile?.size,
                name: uploadedFile?.name,
            };

            const message = {
                type: 'groupchat',
                body: uploadedFile.name,
                extension: {
                    dialog_id: selectedDialog._id,
                    attachments: [attachment],
                    save_to_history: 1,
                    sender_id: messenger.sessionUser.userId,
                    approval_Request_id: approvalRequestObj._id,
                },
                markable: 1
            };
            await messenger.messages.send(selectedDialog._id, message as QBChatNewMessage);
        } catch (e) {
            alertFaultUpdate();
        }
    }

    const sendSystemMessage = async (senderId: number, updatedApprovalRequestId: string, newStatus: EFileStatus) => {
        try {
            const message = {
                extension: {
                    save_to_history: 0, // Save this message to the chat history
                    dialog_id: selectedDialog._id,
                    approval_request_id: updatedApprovalRequestId,
                    newStatus: newStatus
                }
            };
            await messenger.systemMessage.send(senderId, message);
        } catch (e) {
            if (e.name === "ChatNotConnectedError") {
                alertFaultUpdate();
            }
        }

    }
    const updateApprovalFile = async (requestId: string, updatedStatus: string, senderId: number) => {
        const callBack = res => {
            if (res.success) {
                sendSystemMessage(senderId, requestId, res.data.status);
            } else {

            }
        };

        await updateApprovalFileApi(callApi, callBack, {
            requestId,
            updatedStatus,
            messageId: '',
            chatDialogId: selectedDialog._id,
            SenderUserId: senderId
        })
    }

    const getAttachmentUrl = (attachmentId: string): string => {
        return messenger.messages.getAttachmentUrl(attachmentId)
    }
    const addNewDialog = (dialog: IChatDialog) => {
        setDialogs(prevState => ([...prevState, dialog]));
    }
    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            try {
                if (inputValue) {
                    await sendTextMessage(inputValue.trim());
                    setInputValue('');
                }
            } catch (e) {

            }
        }
    };

    const getApprovalFileStatus = async (id: string) => {
        try {
            const approvalRequestId = await messenger.customObj.getData(id);
            return approvalRequestId.status
        } catch (e) {

        }
    }
    useEffect(() => {
        if (messenger.isChatConnected) {
            getDialogs().then();
        }
    }, [messenger.isChatConnected])

    useEffect(() => {
        //get join dialog and get messages
        if (selectedDialog?._id && messenger.sessionUser.userId) {
            try {
                if (messenger.isChatConnected) {
                    //join to dialog
                    messenger.dialogs.join(selectedDialog.xmpp_room_jid);
                    //get users meta data
                    getUsersMetaDta(selectedDialog.occupants_ids?.map(id => id.toString())).then();
                    //get dialog messages
                    getDialogMessages().then();
                    //add listeners
                    messenger.listeners.onMessage(onMessage);
                    messenger.listeners.onSystemMessage(onSystemMessage);
                }

            } catch (e) {

            }
        }
        return () => {
            if (messenger.isChatConnected) {
                messenger.listeners.destroy();
            }
        }

    }, [selectedDialog, messenger.isChatConnected]);

    return {
        selectedDialog,
        setSelectedDialog,
        dialogs,
        messages,
        unreadMessages,
        updateApprovalFile,
        getApprovalFileStatus,
        sendApprovalFileMessage,
        getAttachmentUrl,
        updatedApprovalRequestId,
        uploadingFiles,
        handleKeyDown,
        inputValue,
        setInputValue,
        sendTextMessage,
        addNewDialog,
        files,
        isChatConnected: messenger.isChatConnected,
        sessionUserId: messenger?.sessionUser?.userId
    }
}

export {useMessenger};