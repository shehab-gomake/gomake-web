import Stack from "@mui/material/Stack";
import {DialogList} from "@/widgets/messenger/components/dialogs-list";
import {MessagesComponent} from "@/widgets/messenger/components/messages";
import {Divider, IconButton, LinearProgress} from "@mui/material";
import {GoMakeModal} from "@/components";
import {AddDialog} from "@/widgets/messenger/components/add-dialog";
import {useOpenModals} from "@/widgets/messenger/use-open-modals";
import {useMessenger} from "@/widgets/messenger/use-messenger";
import {useTranslation} from "react-i18next";
import {FIleListComponent} from "@/widgets/messenger/components/file-list-message";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {UsersNamesComponent} from "@/widgets/messenger/components/users-names-component";
import {MessengerInputComponent} from "@/widgets/messenger/components/messenger-input-component";
import {MessengerWaitingComponent} from "@/widgets/messenger/components/messenger-waiting-component";
import {DialogComponent} from "@/widgets/messenger/components/dialog-component";
import {DialogNameComponent} from "@/widgets/messenger/components/dialog-name-component";
import {ClientMessengerFooterComponent} from "@/widgets/messenger/components/client-messenger-footer-component";

interface IProps {
    userType?: EUserType;
}

export enum EUserType {
    USER,
    CLIENT
}

export default function MessengerWidget({}: IProps) {
    const {t} = useTranslation();
    const modals = useOpenModals();
    const {
        selectedDialog,
        setSelectedDialog,
        dialogs,
        messages,
        sendApprovalFileMessage,
        updateApprovalFile,
        getApprovalFileStatus,
        getAttachmentUrl,
        updatedApprovalRequestId,
        uploadingFiles,
        sendTextMessage,
        addNewDialog,
        files,
        sessionUserId,
        isChatConnected,
        users,
        sendFileMessage,
        deleteMessage,
        isMobile,
        onSelectDialog,
        pathname,
        push,
        clientId
    } = useMessenger();

    return (
        <Stack width={'100%'} height={'100%'} style={{backgroundColor: '#FFF'}} overflow={'hidden'}>
            {
                isChatConnected ?
                    (
                        !isMobile ?
                            <Stack style={{backgroundColor: '#FFF'}} direction={'row'} width={'100%'} height={'100%'}>
                                <Stack maxWidth={'350px'} width={'40%'}>
                                    <DialogList onClickAddDialog={() => modals.addDialog.open()}
                                                dialogs={dialogs} selectedDialogId={selectedDialog?._id}
                                                canAddNewDialog={!clientId}
                                                onSelectDialog={onSelectDialog}/>
                                </Stack>
                                {
                                    selectedDialog &&
                                    <DialogComponent dialogName={selectedDialog.name} users={users()}
                                                     openFilesHistoryModal={modals.filesHistory.open}
                                                     showFilesHistoryButton={files().length > 0}
                                                     uploadingFiles={uploadingFiles} messages={messages}
                                                     sessionUserId={sessionUserId} getAttachmentUrl={getAttachmentUrl}
                                                     onDropFile={sendApprovalFileMessage}
                                                     onUpdateApprovalFile={updateApprovalFile}
                                                     getApprovalStatus={getApprovalFileStatus}
                                                     updatedApprovalRequest={updatedApprovalRequestId}
                                                     onDeleteMsg={deleteMessage} onSendMessage={sendTextMessage}
                                                     isBoardMissionsRoom={selectedDialog?.data?.chatroom_type === '1'}
                                                     onSendFile={sendFileMessage}
                                                     onSendApprovalFile={sendApprovalFileMessage}/>
                                }
                                    <AddDialog openModal={modals.addDialog.isOpened} onCloseModal={modals.addDialog.close} onAddDialog={(dialog) => {
                                        addNewDialog(dialog);
                                        modals.addDialog.close();
                                    }}/>
                                <GoMakeModal insideStyle={{width: 'fit-content', height: '400px'}}
                                             openModal={modals.filesHistory.isOpened}
                                             onClose={modals.filesHistory.close}
                                             modalTitle={t('messenger.filesHistoryModalTitle')}>
                                    <Stack gap={'12px'} alignItems={'center'} padding={'10px'}>
                                        {
                                            files().map(msg =>
                                                <FIleListComponent key={'messenger-msg-list' + msg._id} {...msg}
                                                                   updatedApprovalRequest={updatedApprovalRequestId}
                                                                   isCurrentUserSentMsg={msg.sender_id === sessionUserId}
                                                                   direction={'row'}
                                                                   attachments={msg.attachments.map(attachment => {
                                                                       const url = getAttachmentUrl(attachment.id);
                                                                       return {
                                                                           ...attachment,
                                                                           imageUrl: attachment.type === 'application/pdf' ? 'https://gomake-contents.s3.eu-west-3.amazonaws.com/messanger-no-image.jpg' : url,
                                                                           downloadUrl: url
                                                                       }
                                                                   })}
                                                                   getApprovalStatus={getApprovalFileStatus}
                                                                   onUpdateApprovalFile={updateApprovalFile}/>)
                                        }
                                    </Stack>
                                </GoMakeModal>
                            </Stack> :
                            <Stack height={'100%'}>
                                {
                                    !!selectedDialog?._id ?
                                        <Stack height={'100%'} width={'100%'} padding={'16px'} gap={'10px'}>
                                            <Stack direction={'row'} gap={'5px'}>
                                                <IconButton onClick={() => {
                                                    setSelectedDialog(null);
                                                    push({pathname, query: {clientId}}, undefined, {shallow: true})
                                                }
                                                }>
                                                    <ArrowBackIosIcon/>
                                                </IconButton>
                                                <Stack>
                                                    <DialogNameComponent dialogName={selectedDialog.name}/>
                                                    <UsersNamesComponent users={users()}/>
                                                </Stack>

                                            </Stack>
                                            <Divider/>
                                            <Stack width={'100%'} flex={1} overflow={'auto'}>
                                                <MessagesComponent onDeleteMsg={deleteMessage}
                                                                   updatedApprovalRequest={updatedApprovalRequestId}
                                                                   getApprovalStatus={getApprovalFileStatus}
                                                                   onUpdateApprovalFile={updateApprovalFile}
                                                                   selectedDialog={selectedDialog}
                                                                   onDropFile={sendApprovalFileMessage}
                                                                   getAttachmentUrl={getAttachmentUrl}
                                                                   messages={messages}
                                                                   sessionUserId={sessionUserId}/>
                                            </Stack>
                                            {uploadingFiles && <LinearProgress/>}
                                            <MessengerInputComponent
                                                isBoardMissionsRoom={selectedDialog?.data?.chatroom_type === '1'}
                                                onSendMessage={sendTextMessage}
                                                onSendFile={sendFileMessage}
                                                onSendApprovalFile={sendApprovalFileMessage}/>
                                        </Stack> :
                                        <DialogList canAddNewDialog={false} isMobile={true} onClickAddDialog={() => modals.addDialog.open()}
                                                    dialogs={dialogs} selectedDialogId={selectedDialog?._id}
                                                    onSelectDialog={dialog => {
                                                        push({pathname, query: {clientId, dialogId: dialog._id}})
                                                    }}/>
                                }
                            </Stack>
                    )
                    :
                    <MessengerWaitingComponent/>
            }
            {!!clientId && <ClientMessengerFooterComponent/>}
        </Stack>
    )
}