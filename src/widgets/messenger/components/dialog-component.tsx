import Stack from "@mui/material/Stack";
import {UsersNamesComponent} from "@/widgets/messenger/components/users-names-component";
import {PrimaryButton} from "@/components/button/primary-button";
import {FilesHistoryIcon} from "@/widgets/messenger/components/icons/files-history-icon";
import {Divider, LinearProgress} from "@mui/material";
import {IMessengerMessagesComponentProps, MessagesComponent} from "@/widgets/messenger/components/messages";
import {
    IMessengerInputComponentProps,
    MessengerInputComponent
} from "@/widgets/messenger/components/messenger-input-component";
import {useTranslation} from "react-i18next";
import {DialogNameComponent} from "@/widgets/messenger/components/dialog-name-component";

interface IProps {
    dialogName: string;
    users: string[];
    openFilesHistoryModal: () => void;
    showFilesHistoryButton: boolean;
    uploadingFiles: boolean;
}

const DialogComponent = ({
                             dialogName,
                             users,
                             openFilesHistoryModal,
                             showFilesHistoryButton,
                             onDeleteMsg,
                             selectedDialog,
                             onDropFile,
                             onSendFile,
                             onSendApprovalFile,
                             onUpdateApprovalFile,
                             getApprovalStatus,
                             onSendMessage,
                             messages,
                             updatedApprovalRequest,
                             sessionUserId,
                             getAttachmentUrl,
                             isBoardMissionsRoom,
                             uploadingFiles,
                         }: IProps & IMessengerMessagesComponentProps & IMessengerInputComponentProps) => {
    const {t} = useTranslation();
    return <Stack width={'100%'} padding={'24px 20px'} gap={'10px'}>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Stack direction={'row'} gap={'16px'}>
                <Stack>
                    <DialogNameComponent dialogName={dialogName}/>
                    <UsersNamesComponent users={users}/>
                </Stack>
            </Stack>
            {showFilesHistoryButton &&
                <PrimaryButton onClick={openFilesHistoryModal} startIcon={
                    <FilesHistoryIcon/>}>{t('messenger.filesHistory')}</PrimaryButton>}
        </Stack>
        <Divider/>
        <Stack width={'100%'} flex={1} overflow={'auto'}>
            <MessagesComponent onDeleteMsg={onDeleteMsg}
                               updatedApprovalRequest={updatedApprovalRequest}
                               getApprovalStatus={getApprovalStatus}
                               onUpdateApprovalFile={onUpdateApprovalFile}
                               selectedDialog={selectedDialog}
                               onDropFile={onDropFile}
                               getAttachmentUrl={getAttachmentUrl} messages={messages}
                               sessionUserId={sessionUserId}/>
        </Stack>
        {uploadingFiles && <LinearProgress/>}
        <MessengerInputComponent isBoardMissionsRoom={isBoardMissionsRoom}
                                 onSendMessage={onSendMessage}
                                 onSendFile={onSendFile}
                                 onSendApprovalFile={onSendApprovalFile}/>
    </Stack>
}
export {DialogComponent}