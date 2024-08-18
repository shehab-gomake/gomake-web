import {Button, Card, CardActions, CardContent, IconButton, Typography} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import {IChatMessage} from "@/widgets/messenger/interfaces/chat-message";
import {EFileStatus} from "@/widgets/messenger/enums";
import {Download} from "@mui/icons-material";
import Stack from "@mui/material/Stack";
import {useEffect, useState} from "react";
import {FileStatusNameComponent} from "@/widgets/messenger/components/file-status-name-component";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";

interface IProps extends IChatMessage {
    isCurrentUserSentMsg: boolean;
    onUpdateApprovalFile: (requestId: string, updatedStatus: string, senderId: number, type: number) => void;
    getApprovalStatus: (id: string) => Promise<unknown>;
    direction: 'column' | 'row';
    updatedApprovalRequest: { approvalRequestId: string, newStatus: EFileStatus };
}


const FileCardMessageComponent = ({
                                      message,
                                      attachments,
                                      isCurrentUserSentMsg,
                                      onUpdateApprovalFile,
                                      _id,
                                      file_approval_Request_id,
                                      getApprovalStatus,
                                      sender_id,
                                      direction,
                                      updatedApprovalRequest
                                  }: IProps) => {
    const [status, setStatus] = useState<EFileStatus>(EFileStatus.PENDING);
    const {successColor, errorColor, primaryColor, grayColor, secondColor} = useGomakeTheme();

    const downloadFile = async () => {
        try {
            const response = await fetch(attachments[0].url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = urlBlob;
            a.download = message;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };

    const onUpdateStatus = (newStatus: EFileStatus) => {
        onUpdateApprovalFile(file_approval_Request_id, newStatus, sender_id, 11);
        setStatus(newStatus)

    }

    useEffect(() => {
        getApprovalStatus(file_approval_Request_id)
            .then(s => {
                setStatus(s as EFileStatus)
            })

    }, []);

    useEffect(() => {
        if (!!updatedApprovalRequest) {
            if (updatedApprovalRequest.approvalRequestId == file_approval_Request_id) {
                setStatus(updatedApprovalRequest.newStatus);
            }
        }
    }, [updatedApprovalRequest])

    return <Stack sx={{
        width: 165,
        height: '240px',
        position: 'relative',
        border: 0
    }}>
        <CardMedia
            component="img"
            style={{borderRadius: '10px'}}
            height={"165px"}
            image={attachments[0].url}
            alt=""
        />
        {/*<CardContent>*/}
        {/*    <Stack direction={direction === 'row' ? 'column' : 'row'} gap={'5px'}*/}
        {/*           alignItems={direction === 'row' ? 'start' : 'center'} justifyContent={'space-between'}>*/}
        {/*        <Typography variant="h5" style={{...FONT_FAMILY.Inter(500, 14), color: grayColor(700)}}>*/}
        {/*            {message}*/}
        {/*        </Typography>*/}
        {/*        <IconButton style={{padding: direction === 'row' && 0}}>*/}
        {/*            <Download onClick={downloadFile}/>*/}
        {/*        </IconButton>*/}
        {/*    </Stack>*/}
        {/*</CardContent>*/}
        <Stack gap={'5px'}
               style={{position: 'absolute', top: '40%', left: '-20px', right: '-20px', border: 0, display: 'static'}}>
            <Button variant={'contained'} style={{backgroundColor: '#00AEEF'}}
                    onClick={downloadFile}>Download</Button>
            {
                status === EFileStatus.PENDING ?
                    <Stack width={'100%'} gap={'5px'}>
                        {
                            isCurrentUserSentMsg ? <FileStatusNameComponent status={status}/> :
                                <>
                                    <Button variant={'contained'} style={{backgroundColor: primaryColor(400)}}
                                            onClick={() => onUpdateStatus(EFileStatus.APPROVED)}>Approve</Button>
                                    <Button variant={'contained'} style={{backgroundColor: secondColor(400)}}
                                            onClick={() => onUpdateStatus(EFileStatus.REJECTED)}>reject</Button>
                                </>
                        }
                    </Stack> : <FileStatusNameComponent status={status}/>
            }
        </Stack>
    </Stack>
}

export {FileCardMessageComponent}