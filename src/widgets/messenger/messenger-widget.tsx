import Stack from "@mui/material/Stack";
import {DialogList} from "@/widgets/messenger/components/dialogs-list";
import {MessagesComponent} from "@/widgets/messenger/components/messages";
import {CircularProgress, Divider, IconButton, LinearProgress} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import {FONT_FAMILY} from "@/utils/font-family";
import {SendFileMessageButtonComponent} from "@/widgets/messenger/components/send-file-message";
import {GoMakeModal} from "@/components";
import {AddDialog} from "@/widgets/messenger/components/add-dialog";
import {FileMessageComponent} from "@/widgets/messenger/components/file-message";
import {PrimaryButton} from "@/components/button/primary-button";
import {useOpenModals} from "@/widgets/messenger/use-open-modals";
import {useMessenger} from "@/widgets/messenger/use-messenger";
import {FilesHistoryIcon} from "@/widgets/messenger/components/icons/files-history-icon";
import {SendMessageIcon} from "@/widgets/messenger/components/icons/send-message-icon";
import {useTranslation} from "react-i18next";


export default function MessangerWidget() {
    const {t} = useTranslation();
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
        getAttachmentUrl, updatedApprovalRequestId,
        uploadingFiles,
        handleKeyDown,
        inputValue, setInputValue,
        sendTextMessage, addNewDialog, files, sessionUserId, isChatConnected
    } = useMessenger();

    return (
        <Stack width={'100%'} height={'100%'} style={{backgroundColor: '#FFF'}}>
            {
                isChatConnected
                    ?
                    <Stack style={{backgroundColor: '#FFF'}} direction={'row'} width={'100%'} height={'100%'}>
                        <Stack width={'40%'}>
                            <DialogList onClickAddDialog={() => modals.addDialog.open()} unRead={unreadMessages()}
                                        dialogs={dialogs} selectedDialogId={selectedDialog?._id}
                                        onSelectDialog={dialog => {
                                            setSelectedDialog(dialog)
                                        }}/>
                        </Stack>
                        <Divider flexItem orientation={'vertical'}/>
                        {
                            selectedDialog &&
                            <Stack width={'100%'} padding={'24px 80px 20px 24px'} gap={'10px'}>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Stack direction={'row'} gap={'16px'}>
                                        {/*<Avatar variant={'rounded'} src={selectedDialog?.photo}/>*/}
                                        <span style={{...FONT_FAMILY.Inter(600, 14)}}>{selectedDialog.name}</span>
                                    </Stack>
                                    <PrimaryButton onClick={modals.filesHistory.open} startIcon={<FilesHistoryIcon/>}>{t('messenger.filesHistory')}</PrimaryButton>
                                </Stack>
                                <Divider/>
                                <Stack width={'100%'} flex={1} overflow={'auto'}>
                                    <MessagesComponent updatedApprovalRequest={updatedApprovalRequestId}
                                                       getApprovalStatus={getApprovalFileStatus}
                                                       onUpdateApprovalFile={updateApprovalFile}
                                                       selectedDialog={selectedDialog}
                                                       onDropFile={sendApprovalFileMessage}
                                                       getAttachmentUrl={getAttachmentUrl} messages={messages}
                                                       sessionUserId={sessionUserId}/>
                                </Stack>
                                {uploadingFiles && <LinearProgress/>}
                                <Stack direction={'row'} alignItems={'center'}>
                                    <SendFileMessageButtonComponent onSendFile={sendApprovalFileMessage}/>
                                    <InputBase
                                        onKeyDown={handleKeyDown}
                                        sx={{
                                            flex: 1,
                                            borderRadius: '12px',
                                            border: '2px #E2E8F0 solid',
                                            height: '48px'
                                        }}
                                        placeholder={t('messenger.inputPlaceHolder')}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        value={inputValue}/>
                                    <IconButton onClick={() => sendTextMessage(inputValue)} sx={{p: '10px'}}>
                                        <SendMessageIcon/>
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
                                     openModal={modals.filesHistory.isOpened} onClose={modals.filesHistory.close}
                                     modalTitle={t('messenger.filesHistoryModalTitle')}>
                            <Stack gap={'12px'} alignItems={'center'} padding={'10px'}>
                                {
                                    files().map(msg =>
                                        <FileMessageComponent {...msg}
                                                              updatedApprovalRequest={updatedApprovalRequestId}
                                                              isCurrentUserSentMsg={msg.sender_id === sessionUserId}
                                                              direction={'row'}
                                                              attachments={msg.attachments.map(attachment => ({
                                                                  ...attachment,
                                                                  url: getAttachmentUrl(attachment.id)
                                                              }))}
                                                              getApprovalStatus={getApprovalFileStatus}
                                                              onUpdateApprovalFile={updateApprovalFile}/>)
                                }
                            </Stack>

                        </GoMakeModal>
                    </Stack>
                    :
                    <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                        <span>{t('messenger.waitingMessage')}</span>
                        <CircularProgress/>
                    </Stack>
            }
        </Stack>
    )
}