import {useQuickBlox} from "@/widgets/messenger/use-quick-blox";
import {useCallback, useEffect, useState} from "react";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";
import {IChatMessage, IUserMetaData} from "@/widgets/messenger/interfaces/chat-message";
import {EFileStatus} from "@/widgets/messenger/enums";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {
    getUsersMetaDataApi,
    sendMessengerNotificationApi,
    updateApprovalRequestApi
} from "@/services/api-service/chat/quick-blox-chat-endpoints";
import {QBChatNewMessage} from "quickblox";
import {useRouter} from "next/router";
import {useMediaQuery} from "@mui/material";
import {useRecoilState} from "recoil";
import {unreadMessagesCountState} from "@/store/unread-messages-count";
import {messengerMobileViewState} from "@/widgets/messenger/state";
import {useMessengerSocketIo} from "@/hooks/socket-io/use-messenger-socket-io";

const useMessenger = () => {
    const [selectedDialog, setSelectedDialog] = useState<IChatDialog | null>(null);
    const [dialogs, setDialogs] = useState<IChatDialog[]>([]);
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
    const [updatedApprovalRequestId, setUpdatedApprovalRequestId] = useState<{ approvalRequestId: string, newStatus: EFileStatus }>();
    const [usersMetaData, setUsersMetaDta] = useState<IUserMetaData[]>([]);
    const {updateState, setUpdateState} = useMessengerSocketIo();
    const {alertFaultUpdate, alertFaultGetData, alertFaultDelete} = useSnackBar();
    const {query, pathname, push} = useRouter();
    const {dialogId, clientId} = query;
    const mobileMediaQuery = useMediaQuery('(max-width:800px)');
    const [, setUnreadMessagesCount] = useRecoilState(unreadMessagesCountState);
    const [isMobile, setIsMobile] = useRecoilState(messengerMobileViewState);


    useEffect(() => {
        setIsMobile(!!clientId && mobileMediaQuery);
    }, [clientId, mobileMediaQuery]);


    const getUnreadMessagesCount = (dialogs) => {
        return dialogs?.reduce((partialSum, dialog) => partialSum + dialog.unread_messages_count, 0);
    }

    const files = useCallback(() => {
        return messages.filter(msg => !!msg.file_approval_Request_id);
    }, [messages]);

    const getUsersNames = useCallback(() => {
        return usersMetaData
            ?.filter(user => +user.userId !== messenger.sessionUser.userId)
            .map(user => user.fullName)
    }, [usersMetaData]);
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
        let dialogs = await messenger.dialogs.getDialogs();
        dialogs = dialogs?.map(dialog => ({
            ...dialog,
            unread_messages_count: selectedDialog?._id === dialog._id ? 0 : dialog.unread_messages_count,
            users: dialog?.occupants_ids?.map((userId, index) => ({
                id: userId,
                name: dialog?.data?.users?.length > 0 ? dialog?.data?.users[index] : ''
            }))
                ?.filter(user => user.id === messenger.sessionUser.userId)
        }))
        setDialogs(dialogs);
        setUnreadMessagesCount(getUnreadMessagesCount(dialogs))
    }

    const onMessage = (userId, message) => {
        getDialogs().then();
        if (message.dialog_id === selectedDialog?._id) {
            setMessages(prevState => ([
                ...prevState,
                {
                    ...message,
                    _id: message.id,
                    sender_id: +message.extension?.sender_id,
                    attachments: message.extension?.attachments,
                    file_approval_Request_id: message.extension?.file_approval_Request_id,
                    quote_approval_Request_id: message.extension?.qoute_approval_Request_id,
                    message: message.body,
                    date_sent: +message?.extension.date_sent,
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

    const sendMessage = async (message: QBChatNewMessage, isApproval?: boolean) => {
        try {
            await sendMessengerNotificationApi(callApi, () => {
            }, {
                dialogId: selectedDialog._id,
                documentType: !!isApproval ? 11 : 1,
                users: selectedDialog.occupants_ids.map(a => a.toString()),
            })
            await messenger.messages.send(selectedDialog._id, message as QBChatNewMessage);
        } catch (e) {
            alertFaultUpdate();
        }

    }

    const deleteMessage = async (messageId: string) => {
        try {
            await messenger.messages.delete(messageId);
            setMessages(prevState => prevState.filter(msg => msg._id !== messageId));
        } catch (e) {
            alertFaultDelete()
        }

    }
    const sendTextMessage = async (text: string) => {
        try {
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
            setInputValue('');
            await sendMessage(message as QBChatNewMessage, false)
        } catch (e) {
            alertFaultUpdate();
        }
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
                    file_approval_Request_id: approvalRequestObj._id,
                },
                markable: 1
            };
            // await sendMessengerNotificationApi(callApi, () => {
            // }, selectedDialog.occupants_ids.map(a => a.toString()))
            // await messenger.messages.send(selectedDialog._id, message as QBChatNewMessage);
            await sendMessage(message as QBChatNewMessage, true);
        } catch (e) {
            alertFaultUpdate();
        }
    }

    const sendFileMessage = async (file) => {
        try {
            setUploadingFiles(true);
            const fileParams = {
                name: file.name,
                file: file,
                type: file.type,
                size: file.size,
                'public': false
            };
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
                },
                markable: 1
            };
            // await sendMessengerNotificationApi(callApi, () => {
            // }, selectedDialog.occupants_ids.map(a => a.toString()))
            // await messenger.messages.send(selectedDialog._id, message as QBChatNewMessage);
            await sendMessage(message as QBChatNewMessage, false)
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
    const updateApprovalRequest = async (requestId: string, updatedStatus: string, senderId: number, type: number) => {
        const callBack = res => {
            if (res.success) {
                sendSystemMessage(senderId, requestId, res.data.status);
            } else {
                alertFaultUpdate();

            }
        };

        await updateApprovalRequestApi(callApi, callBack, {
            requestId,
            updatedStatus,
            messageId: 'message id',
            chatDialogId: selectedDialog._id,
            senderUserId: senderId,
            documentType: type,
            token: messenger.sessionUser.password
        })
    }

    const getAttachmentUrl = (attachmentId: string): string => {
        return messenger.messages.getAttachmentUrl(attachmentId)
    }
    const addNewDialog = (dialog: IChatDialog) => {
        setDialogs(prevState => ([...prevState, dialog]));
        setSelectedDialog(dialog);
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
            alertFaultGetData();
        }
    }

    const onSelectDialog = dialog => {
        !!clientId ? push({pathname, query: {clientId, dialogId: dialog._id}}) :
            push(`${pathname}?dialogId=${dialog._id}`).then();
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
                    getDialogMessages().then(() => getDialogs());
                    //add listeners
                    messenger.listeners.onMessage(onMessage);
                    messenger.listeners.onSystemMessage(onSystemMessage);
                }

            } catch (e) {
                alertFaultGetData();
            }
        }
        return () => {
            if (messenger.isChatConnected) {
                messenger.listeners.destroy();
            }
        }

    }, [selectedDialog, messenger.isChatConnected]);

    useEffect(() => {
        if (usersMetaData.length > 0 && messages.length > 0 && !messages.some(msg => !!msg.userMetaData)) {
            setMessages(prevState => prevState.map(msg => ({
                ...msg,
                userMetaData: usersMetaData?.find(user => +user.userId === msg.sender_id)
            })));
        }
    }, [usersMetaData, messages])

    useEffect(() => {
        if (!dialogId) {
            setSelectedDialog(null);
        } else if (!!dialogId && selectedDialog?._id !== dialogId) {
            const dialog = dialogs?.find(dialog => dialog._id === dialogId);
            setSelectedDialog(dialog);
        }
    }, [dialogId, dialogs, selectedDialog]);


    useEffect(() => {
        if (updateState && messenger.isChatConnected) {
            getDialogs().then();
            setUpdateState(false);
        }
    }, [updateState, messenger])


    return {
        selectedDialog,
        setSelectedDialog,
        dialogs,
        messages,
        updateApprovalFile: updateApprovalRequest,
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
        sessionUserId: messenger?.sessionUser?.userId,
        users: getUsersNames,
        sendFileMessage,
        deleteMessage,
        isMobile,
        getDialogs,
        onSelectDialog,
        pathname,
        push,
        clientId,
    }
}

export {useMessenger};