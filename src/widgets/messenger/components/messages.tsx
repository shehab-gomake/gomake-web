import Stack from "@mui/material/Stack";
import {TextMessageComponent} from "@/widgets/messenger/components/text-message";
import {Avatar} from "@mui/material";
import {userProfileState} from "@/store/user-profile";
import {useRecoilState} from "recoil";
import {IChatMessage} from "@/widgets/messenger/interfaces/chat-message";
import {FileMessageComponent} from "@/widgets/messenger/components/file-message";
import {useEffect, useRef, useState} from "react";
import {useDrop} from "react-dnd";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";
import {EFileStatus} from "@/widgets/messenger/enums";

interface IProps {
    messages: IChatMessage[];
    sessionUserId: number;
    selectedDialog?: IChatDialog;
    getAttachmentUrl: (attachmentId) => string;
    onDropFile: (file) => void;
    onUpdateApprovalFile: (requestId: string, updatedStatus: string) => void;
    getApprovalStatus: (id: string) => EFileStatus;
}

const MessagesComponent = ({
                               messages,
                               sessionUserId,
                               selectedDialog,
                               getAttachmentUrl,
                               onDropFile,
                               onUpdateApprovalFile,
                               getApprovalStatus
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
            console.log('use', item);
            console.log(item)
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
            console.log(files)
            onDropFile(files[0]);
            setIsOver(false)


        };

        const handleDragOver = (event) => {
            setIsOver(true)
        };
        const handleDragOLeave = (event) => {
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
                    <Stack ref={index + 1 === messages.length ? lastMessageRef : null} maxWidth={'50%'}
                           direction={msg.sender_id === sessionUserId ? 'row-reverse' : 'row'}
                           gap={'10px'} alignItems={'center'}
                           alignSelf={msg.sender_id === sessionUserId ? 'flex-end' : 'flex-start'}>
                        {
                            (index === 0 || index > 0 && msg.sender_id !== messages[index - 1].sender_id) ?
                                <Avatar variant={'rounded'} style={{
                                    backgroundColor: msg.sender_id === sessionUserId ? user?.avatarBackGroundColor : '',
                                }}
                                        src={msg.sender_id === sessionUserId ? user?.imagePath : selectedDialog?.photo}>{msg.sender_id === sessionUserId && !user.imagePath ? user.avatarInitials?.toUpperCase() : undefined}</Avatar> :
                                <Stack minWidth={'40px'} width={'40px'} height={'40px'}/>
                        }
                        {
                            msg.attachments?.length > 0 ? <FileMessageComponent onUpdateApprovalFile={onUpdateApprovalFile} {...msg}
                                                                                isCurrentUserSentMsg={msg.sender_id === sessionUserId}
                                                                                status={getApprovalStatus(msg.approval_Request_id)}
                                                                                attachments={msg.attachments.map(attachment => ({
                                                                                    ...attachment,
                                                                                    url: getAttachmentUrl(attachment.id)
                                                                                }))}/> :
                                <TextMessageComponent message={msg} sessionUserId={sessionUserId}/>
                        }
                    </Stack>)
            }
        </Stack>
    );
}

export {MessagesComponent}