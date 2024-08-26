import Stack from "@mui/material/Stack";
import {TextMessageComponent} from "@/widgets/messenger/components/text-message";
import {Avatar} from "@mui/material";
import {userProfileState} from "@/store/user-profile";
import {useRecoilState} from "recoil";
import {IChatMessage} from "@/widgets/messenger/interfaces/chat-message";
import {FileCardMessageComponent} from "@/widgets/messenger/components/file-card-message";
import {useEffect, useRef, useState} from "react";
import {useDrop} from "react-dnd";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";
import {EFileStatus} from "@/widgets/messenger/enums";
import {QuoteApprovalMessageComponent} from "@/widgets/messenger/components/qoute-approval-message";
import {FONT_FAMILY} from "@/utils/font-family";

interface IProps {
    messages: IChatMessage[];
    sessionUserId: number;
    selectedDialog?: IChatDialog;
    getAttachmentUrl: (attachmentId) => string;
    onDropFile: (file) => void;
    onUpdateApprovalFile: (requestId: string, updatedStatus: string, senderId: number, type: number) => void;
    getApprovalStatus: (id: string) => Promise<unknown>;
    updatedApprovalRequest: { approvalRequestId: string, newStatus: EFileStatus };
    onDeleteMsg: (messageId: string) => void;
}

const MessagesComponent = ({
                               messages,
                               sessionUserId,
                               getAttachmentUrl,
                               onDropFile,
                               onUpdateApprovalFile,
                               getApprovalStatus,
                               updatedApprovalRequest,
                               onDeleteMsg
                           }: IProps) => {
    const [user] = useRecoilState(userProfileState);
    const dropRef = useRef(null);
    const lastMessageRef = useRef(null);
    const [isOver, setIsOver] = useState<boolean>();
    const [, drop] = useDrop(() => ({
        accept: 'file',
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [messages, sessionUserId]);
    drop(dropRef);
    useEffect(() => {
        const handleDrop = (event) => {
            event.preventDefault();
            const files = [...event.dataTransfer.files];
            onDropFile(files[0]);
            setIsOver(false)


        };

        const handleDragOver = () => {
            setIsOver(true)
        };
        const handleDragOLeave = () => {
            setIsOver(false)
        };

        const dropZone = dropRef.current;
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragOLeave);
        dropZone.addEventListener('drop', handleDrop);

        return () => {
            dropZone.removeEventListener('dragover', handleDragOver);
            dropZone.removeEventListener('dragleave', handleDragOLeave);
            dropZone.removeEventListener('drop', handleDrop);
        };
    }, []);

    useEffect(() => {
        if (lastMessageRef?.current) {
            lastMessageRef.current.scrollIntoView({behavior: 'smooth', block: 'end'});
        }
    }, [messages])
    return (
        <Stack ref={dropRef}
               height={'100%'} width={'100%'} gap={'10px'} style={{backgroundColor: isOver ? '#00000033' : '#FFF'}}
               overflow={'auto'}>
            {
                messages.map((msg, index) =>
                    <Stack key={msg._id} ref={index + 1 === messages.length ? lastMessageRef : null} maxWidth={'50%'}
                           direction={msg.sender_id === sessionUserId ? 'row-reverse' : 'row'}
                           gap={'10px'} alignItems={'start'}
                           alignSelf={msg.sender_id === sessionUserId ? 'flex-end' : 'flex-start'}>
                        {
                            (index === 0 || index > 0 && msg.sender_id !== messages[index - 1].sender_id) ?
                                <Avatar variant={'circular'}
                                        style={{backgroundColor: msg.sender_id === sessionUserId ? user?.avatarBackGroundColor : '', ...FONT_FAMILY.Lexend(500, 18)}}
                                        src={msg.sender_id === sessionUserId ? user?.imagePath : msg.userMetaData?.profileImage}>
                                    {msg.sender_id === sessionUserId && !user.imagePath ? user.avatarInitials?.toUpperCase() : msg.userMetaData?.avatarInitials?.toUpperCase()}
                                </Avatar> :
                                <Stack minWidth={'40px'} width={'40px'} height={'40px'}/>
                        }
                        {
                            msg?.attachments?.length > 0 ? <FileCardMessageComponent {...msg}
                                                                                   onDeleteMessage={onDeleteMsg}
                                                                                   updatedApprovalRequest={updatedApprovalRequest}
                                                                                   direction={'column'}
                                                                                   onUpdateApprovalFile={onUpdateApprovalFile}
                                                                                   isCurrentUserSentMsg={msg.sender_id === sessionUserId}
                                                                                   getApprovalStatus={getApprovalStatus}
                                                                                   attachments={msg.attachments.map(attachment => {
                                                                                       const attachmentUrl = getAttachmentUrl(attachment.id);
                                                                                       return {
                                                                                           ...attachment,
                                                                                           imageUrl: attachment.type === 'application/pdf' ? 'https://gomake-contents.s3.eu-west-3.amazonaws.com/messanger-no-image.jpg' : attachmentUrl,
                                                                                           downloadUrl: attachmentUrl
                                                                                       }
                                                                                   })}/> :

                                msg?.quote_approval_Request_id ?
                                    <QuoteApprovalMessageComponent {...msg}
                                                                   isCurrentUserSentMsg={msg.sender_id === sessionUserId}
                                                                   getApprovalStatus={getApprovalStatus}
                                                                   updatedApprovalRequest={updatedApprovalRequest}
                                                                   onUpdateApprovalQouteMessageStatus={onUpdateApprovalFile}/> :
                                    <TextMessageComponent message={msg} sessionUserId={sessionUserId}/>

                        }
                    </Stack>)
            }
        </Stack>
    );
}

export {MessagesComponent}