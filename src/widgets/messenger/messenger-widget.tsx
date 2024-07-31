import {useCallback, useEffect, useState} from 'react';
import Stack from "@mui/material/Stack";
import {DialogList} from "@/widgets/messenger/components/dialogs-list";
import {QBChatNewMessage} from "quickblox";
import {useQuickBlox} from "@/widgets/messenger/use-quick-blox";
import {MessagesComponent} from "@/widgets/messenger/components/messages";
import {Avatar, Divider, IconButton, LinearProgress} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import {FONT_FAMILY} from "@/utils/font-family";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";
import {SendFileMessageButtonComponent} from "@/widgets/messenger/components/send-file-message";
import {IChatMessage} from "@/widgets/messenger/interfaces/chat-message";
import {GoMakeModal} from "@/components";
import {AddDialog} from "@/widgets/messenger/components/add-dialog";
import {EFileStatus} from "@/widgets/messenger/enums";
import {useSnackBar} from "@/hooks";


export default function MessangerWidget() {
    const [selectedDialog, setSelectedDialog] = useState<IChatDialog | null>(null);
    const [dialogs, setDialogs] = useState<IChatDialog[]>([]);
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [openAddDialogModal, setopenAddDialogModal] = useState<boolean>(false);
    const {QB, sessionUser, isChatConnected} = useQuickBlox();
    const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
    const {alertFault} = useSnackBar();

    const unreadMessages = useCallback(() => {
        return dialogs?.reduce((partialSum, dialog) => partialSum + dialog.unread_messages_count, 0);
    }, [dialogs]);

    useEffect(() => {
        if (QB && selectedDialog?._id && sessionUser.userId) {
            try {
                QB.chat.muc.join(selectedDialog.xmpp_room_jid, function (error, result) {
                });
                QB.chat.message.list({chat_dialog_id: selectedDialog?._id}, (err, messages) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('messeges', messages.items)
                        setMessages(messages.items);
                    }
                });

                QB.chat.onMessageListener = (userId, message) => {
                    if (message.dialog_id === selectedDialog?._id) {
                        console.log(message)
                        addMessage({...message, sender_id: +message.extension?.sender_id, attachments: message.extension?.attachments});
                    }
                };
            } catch (e) {

            }
            return () => {
                if (QB) QB.chat.onMessageListener = () => {
                };
            };
        }
    }, [QB, selectedDialog, sessionUser]);


    useEffect(() => {
        if (QB && isChatConnected && sessionUser?.userId) {
            if (sessionUser.userId && QB.chat.isConnected) {
                QB.chat.dialog.list({}, (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        setDialogs(res.items);
                    }
                });
            }
        }
    }, [sessionUser, QB, isChatConnected]);

    const addMessage = (message) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                ...message,
                message: message.body,
                date: new Date(message.date_sent * 1000),
            },
        ]);
    };

    const sendMessage = (msg: string) => {
        if (inputValue.trim()) {
            const message = {
                type: 'groupchat',
                body: msg,
                extension: {
                    dialog_id: selectedDialog?._id,
                    save_to_history: 1,
                    sender_id: sessionUser.userId,
                },
                markable: 1,
            };
            const dialogJid = QB.chat.helpers.getRoomJidFromDialogId(selectedDialog._id);
            message['id'] = QB.chat.send(dialogJid, message as QBChatNewMessage);
            // addMessage({
            //     ...message,
            //     message: message.body,
            //     sender_id: sessionUser?.userId,
            //     date_sent: Math.floor(Date.now() / 1000),
            // });
            setInputValue('');
            console.log(message)
        }
    };
    const uploadAndSendMessage = (file) => {
        setUploadingFiles(true)
        if (file) {
            const params = {
                name: file.name,
                file: file,
                type: file.type,
                size: file.size,
                'public': false
            };

            QB.content.createAndUpload(params, (err, res) => {
                setUploadingFiles(false)
                if (err) {
                    alertFault('try again')
                } else {
                    const attachment = {
                        id: res.uid,
                        type: res.content_type,
                        size: res.size,
                        name: res.name
                    };

                    const message = {
                        type: 'groupchat',
                        body: res.name,
                        sender_id: sessionUser.userId,

                        extension: {
                            dialog_id: selectedDialog._id,
                            attachments: [attachment],
                            save_to_history: 1,
                            sender_id: sessionUser.userId,
                            fileUrl: res.blob_object_access.params,
                            status: EFileStatus.PENDING
                        },
                        markable: 1
                    };
                    const dialogJid = QB.chat.helpers.getRoomJidFromDialogId(selectedDialog._id);
                    QB.chat.send(dialogJid, message, (error, response) => {
                    });
                }
            });
        }
    };

    const approveFile = (messageId: string) => {

        const params = {
            chat_dialog_id: selectedDialog._id,
            message: 'Updated',
            save_to_history: 1,
            extension: {
                status: '1',
            }
        };

        QB.chat.message.update(messageId, params, function(err, updatedMessage) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message extra data updated successfully', updatedMessage);
            }
        });
    }

    const getAttachmentUrl = (attachmentId: string): string => {
        return QB.content.privateUrl(attachmentId)
    }

    const addNewDialog = (dialog: IChatDialog) => {
        setDialogs(prevState => ([...prevState, dialog]));
        setopenAddDialogModal(false)
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage(inputValue);
            setInputValue('');
        }
    };
    return (
        <Stack width={'100%'} height={'100%'} style={{backgroundColor: '#FFF'}}>
            {
                sessionUser && sessionUser.userId
                    ?
                    <Stack style={{backgroundColor: '#FFF'}} direction={'row'} width={'100%'} height={'100%'}>
                        <Stack width={'40%'}>
                            <DialogList onClickAddDialog={() => setopenAddDialogModal(true)} unRead={unreadMessages()}
                                        dialogs={dialogs} selectedDialogId={selectedDialog?._id}
                                        onSelectDialog={dialog => {
                                            setSelectedDialog(dialog)
                                        }}/>
                        </Stack>
                        <Divider flexItem orientation={'vertical'}/>
                        {
                            selectedDialog &&
                            <Stack width={'100%'} padding={'24px 80px 20px 24px'} gap={'10px'}>
                                <Stack direction={'row'} gap={'16px'}>
                                    <Avatar variant={'rounded'} src={selectedDialog?.photo}/>
                                    <span style={{...FONT_FAMILY.Inter(600, 14)}}>Title</span>
                                </Stack>
                                <Divider/>
                                <Stack width={'100%'} flex={1} overflow={'auto'}>
                                    <MessagesComponent onApproveFile={approveFile} selectedDialog={selectedDialog}
                                                       onDropFile={uploadAndSendMessage}
                                                       getAttachmentUrl={getAttachmentUrl} messages={messages}
                                                       sessionUserId={sessionUser.userId}/>
                                </Stack>
                                {uploadingFiles && <LinearProgress/>}
                                <Stack direction={'row'} alignItems={'center'}>
                                    <SendFileMessageButtonComponent onSendFile={uploadAndSendMessage}/>
                                    <InputBase
                                        onKeyDown={handleKeyDown}
                                        sx={{
                                            flex: 1,
                                            borderRadius: '12px',
                                            border: '2px #E2E8F0 solid',
                                            height: '48px'
                                        }}
                                        placeholder="Type a message"
                                        onChange={(e) => setInputValue(e.target.value)}
                                        value={inputValue}/>
                                    <IconButton onClick={() => sendMessage(inputValue)} type="button"
                                                sx={{p: '10px'}}
                                                aria-label="search">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <g id="Iconsax">
                                                <path id="Vector"
                                                      d="M16.1411 2.96004L7.11109 5.96004C1.04109 7.99004 1.04109 11.3 7.11109 13.32L9.79109 14.21L10.6811 16.89C12.7011 22.96 16.0211 22.96 18.0411 16.89L21.0511 7.87004C22.3911 3.82004 20.1911 1.61004 16.1411 2.96004ZM16.4611 8.34004L12.6611 12.16C12.5111 12.31 12.3211 12.38 12.1311 12.38C11.9411 12.38 11.7511 12.31 11.6011 12.16C11.4616 12.0189 11.3834 11.8285 11.3834 11.63C11.3834 11.4316 11.4616 11.2412 11.6011 11.1L15.4011 7.28004C15.6911 6.99004 16.1711 6.99004 16.4611 7.28004C16.7511 7.57004 16.7511 8.05004 16.4611 8.34004Z"
                                                      fill="#2E3092"/>
                                            </g>
                                        </svg>
                                    </IconButton>
                                </Stack>
                            </Stack>
                        }
                        <GoMakeModal insideStyle={{width: '600px', height: 'fit-content'}}
                                     openModal={openAddDialogModal} onClose={() => setopenAddDialogModal(false)}
                                     modalTitle={'add conversation'}>
                            <AddDialog onAddDialog={addNewDialog}/>
                        </GoMakeModal>
                    </Stack>
                    :
                    <div>wait while SDK is initializing...</div>
            }
        </Stack>
    )
}