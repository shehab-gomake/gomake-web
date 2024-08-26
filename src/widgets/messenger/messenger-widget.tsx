import Stack from "@mui/material/Stack";
import {DialogList} from "@/widgets/messenger/components/dialogs-list";
import {MessagesComponent} from "@/widgets/messenger/components/messages";
import {CircularProgress, Divider, IconButton, LinearProgress} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import {FONT_FAMILY} from "@/utils/font-family";
import {SendFileMessageButtonComponent} from "@/widgets/messenger/components/send-file-message";
import {GoMakeModal} from "@/components";
import {AddDialog} from "@/widgets/messenger/components/add-dialog";
import {PrimaryButton} from "@/components/button/primary-button";
import {useOpenModals} from "@/widgets/messenger/use-open-modals";
import {useMessenger} from "@/widgets/messenger/use-messenger";
import {FilesHistoryIcon} from "@/widgets/messenger/components/icons/files-history-icon";
import {useTranslation} from "react-i18next";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import SendIcon from '@mui/icons-material/Send';
import {FIleListComponent} from "@/widgets/messenger/components/file-list-message";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface IProps {
    userType?: EUserType;
}

export enum EUserType {
    USER,
    CLIENT
}

export default function MessengerWidget({userType}: IProps) {
    const {t} = useTranslation();
    const {primaryColor} = useGomakeTheme();
    const modals = useOpenModals();
    const {
        unreadMessages,
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
        handleKeyDown,
        inputValue,
        setInputValue,
        sendTextMessage,
        addNewDialog,
        files,
        sessionUserId,
        isChatConnected,
        users,
        sendFileMessage,
        deleteMessage,
        isMobile
    } = useMessenger();

    return (
        <Stack width={'100%'} height={'100%'} style={{backgroundColor: '#FFF'}} overflow={'hidden'}>
            {
                isChatConnected ?
                    (
                        !isMobile() ?
                            <Stack style={{backgroundColor: '#FFF'}} direction={'row'} width={'100%'} height={'100%'}>
                                <Stack maxWidth={'350px'} width={'40%'}>
                                    <DialogList onClickAddDialog={() => modals.addDialog.open()}
                                                unRead={unreadMessages()}
                                                dialogs={dialogs} selectedDialogId={selectedDialog?._id}
                                                onSelectDialog={dialog => {
                                                    setSelectedDialog(dialog)
                                                }}/>
                                </Stack>
                                {
                                    selectedDialog &&
                                    <Stack width={'100%'} padding={'24px 20px'} gap={'10px'}>
                                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                            <Stack direction={'row'} gap={'16px'}>
                                                {/*<Avatar variant={'rounded'} src={selectedDialog?.photo}/>*/}
                                                <Stack>
                                                    <span
                                                        style={{...FONT_FAMILY.Inter(600, 16)}}>{selectedDialog.name}</span>
                                                    <Stack>
                                                        {
                                                            users()?.map((user, index) => <Stack style={{
                                                                ...FONT_FAMILY.Outfit(500, 13),
                                                                fontStyle: 'italic',
                                                                color: primaryColor(300)
                                                            }}>
                                                                <span>{user}</span>
                                                                {index + 1 < users.length && <span>,</span>}
                                                            </Stack>)
                                                        }
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            {files().length > 0 &&
                                                <PrimaryButton onClick={modals.filesHistory.open} startIcon={
                                                    <FilesHistoryIcon/>}>{t('messenger.filesHistory')}</PrimaryButton>}
                                        </Stack>
                                        <Divider/>
                                        <Stack width={'100%'} flex={1} overflow={'auto'}>
                                            <MessagesComponent onDeleteMsg={deleteMessage}
                                                               updatedApprovalRequest={updatedApprovalRequestId}
                                                               getApprovalStatus={getApprovalFileStatus}
                                                               onUpdateApprovalFile={updateApprovalFile}
                                                               selectedDialog={selectedDialog}
                                                               onDropFile={sendApprovalFileMessage}
                                                               getAttachmentUrl={getAttachmentUrl} messages={messages}
                                                               sessionUserId={sessionUserId}/>
                                        </Stack>
                                        {uploadingFiles && <LinearProgress/>}
                                        <Stack style={{backgroundColor: primaryColor(100)}} borderRadius={'8px'}
                                               direction={'row'} alignItems={'center'}>
                                            <SendFileMessageButtonComponent
                                                isBoardMissionsRoom={selectedDialog?.data?.chatroom_type === '1'}
                                                onSendApprovalFile={sendApprovalFileMessage}
                                                onSendFile={sendFileMessage}/>
                                            <InputBase
                                                onKeyDown={handleKeyDown}
                                                sx={{
                                                    flex: 1,
                                                    height: '48px'
                                                }}
                                                placeholder={t('messenger.inputPlaceHolder')}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                value={inputValue}/>
                                            <IconButton onClick={() => sendTextMessage(inputValue)} sx={{p: '10px'}}>
                                                <SendIcon style={{color: primaryColor(500)}}/>
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                }
                                <GoMakeModal insideStyle={{width: '600px', height: 'fit-content'}}
                                             openModal={modals.addDialog.isOpened} onClose={modals.addDialog.close}
                                             modalTitle={t('messenger.addDialogModalTitle')}>
                                    <AddDialog onAddDialog={(dialog) => {
                                        addNewDialog(dialog);
                                        modals.addDialog.close();
                                    }}/>
                                </GoMakeModal>
                                <GoMakeModal insideStyle={{width: 'fit-content', height: '400px'}}
                                             openModal={modals.filesHistory.isOpened}
                                             onClose={modals.filesHistory.close}
                                             modalTitle={t('messenger.filesHistoryModalTitle')}>
                                    <Stack gap={'12px'} alignItems={'center'} padding={'10px'}>
                                        {
                                            files().map(msg =>
                                                <FIleListComponent {...msg}
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
                                                <IconButton onClick={() => setSelectedDialog(null)}>
                                                    <ArrowBackIosIcon/>
                                                </IconButton>
                                                <Stack>
                                                    <span
                                                        style={{...FONT_FAMILY.Inter(600, 16)}}>{selectedDialog.name}</span>
                                                    <Stack direction={'row'}>
                                                        {
                                                            users()?.map((user, index) => <Stack style={{
                                                                ...FONT_FAMILY.Outfit(500, 13),
                                                                fontStyle: 'italic',
                                                                color: primaryColor(300)
                                                            }}>
                                                                <span>{user}</span>
                                                                {index + 1 < users.length && <span>,</span>}
                                                            </Stack>)
                                                        }
                                                    </Stack>
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
                                            <Stack style={{backgroundColor: primaryColor(100)}} borderRadius={'8px'}
                                                   direction={'row'} alignItems={'center'}>
                                                <SendFileMessageButtonComponent
                                                    isBoardMissionsRoom={selectedDialog?.data?.chatroom_type === '1'}
                                                    onSendApprovalFile={sendApprovalFileMessage}
                                                    onSendFile={sendFileMessage}/>
                                                <InputBase
                                                    onKeyDown={handleKeyDown}
                                                    sx={{
                                                        flex: 1,
                                                        height: '48px'
                                                    }}
                                                    placeholder={t('messenger.inputPlaceHolder')}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    value={inputValue}/>
                                                <IconButton onClick={() => sendTextMessage(inputValue)}
                                                            sx={{p: '10px'}}>
                                                    <SendIcon style={{color: primaryColor(500)}}/>
                                                </IconButton>
                                            </Stack>
                                        </Stack> :
                                        <DialogList isMobile={true} onClickAddDialog={() => modals.addDialog.open()}
                                                    unRead={unreadMessages()}
                                                    dialogs={dialogs} selectedDialogId={selectedDialog?._id}
                                                    onSelectDialog={dialog => {
                                                        setSelectedDialog(dialog)
                                                    }}/>
                                }
                            </Stack>
                    )
                    :
                    <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                        <span>{t('messenger.waitingMessage')}</span>
                        <CircularProgress/>
                    </Stack>
            }
        </Stack>
    )
}