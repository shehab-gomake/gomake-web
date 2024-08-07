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
    onUpdateApprovalFile: (requestId: string, updatedStatus: string, senderId: number) => void;
    getApprovalStatus: (id: string) => Promise<unknown>;
    direction: 'column' | 'row';
    updatedApprovalRequest: { approvalRequestId: string, newStatus: EFileStatus };
}


const FileMessageComponent = ({
                                  message,
                                  attachments,
                                  isCurrentUserSentMsg,
                                  onUpdateApprovalFile,
                                  _id,
                                  approval_Request_id,
                                  getApprovalStatus,
                                  sender_id,
                                  direction,
                                  updatedApprovalRequest
                              }: IProps) => {
    const [status, setStatus] = useState<EFileStatus>(EFileStatus.PENDING);
    const {successColor, errorColor, primaryColor, grayColor} = useGomakeTheme();

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
        onUpdateApprovalFile(approval_Request_id, newStatus, sender_id);
        setStatus(newStatus)

    }

    useEffect(() => {
        if (!status) {
            getApprovalStatus(approval_Request_id)
                .then(s => {
                    setStatus(s as EFileStatus)
                })
        }
    }, []);

    useEffect(() => {
        if (!!updatedApprovalRequest) {
            if (updatedApprovalRequest.approvalRequestId == approval_Request_id) {
                setStatus(updatedApprovalRequest.newStatus);
            }
        }
    }, [updatedApprovalRequest])

    return <Card sx={{
        maxWidth: direction === 'column' ? 400 : 600,
        width: 600,
        display: 'flex',
        flexDirection: direction,
        alignItems: direction === 'row' ? 'center' : 'start',
        padding: direction === 'row' ? '16px' : 0,
        border: `${status === EFileStatus.PENDING ? primaryColor(200) : status === EFileStatus.APPROVED ? successColor(400) : errorColor(600)} solid ${direction === 'row' ? '1px' : 0}`,

    }}>
        <CardMedia
            component="img"
            style={{
                width: direction === 'row' && 'auto',
            }}
            height={direction === 'row' ? '50' : "194"}
            image={attachments[0].url}
            alt=""
        />
        <CardContent>
            <Stack direction={direction === 'row' ? 'column' : 'row'} gap={'5px'}
                   alignItems={direction === 'row' ? 'start' : 'center'} justifyContent={'space-between'}>
                <Typography variant="h5" style={{...FONT_FAMILY.Inter(500, 14), color: grayColor(700)}}>
                    {message}
                </Typography>
                <IconButton style={{padding: direction === 'row' && 0}}>
                    <Download onClick={downloadFile}/>
                </IconButton>
            </Stack>
        </CardContent>
        <CardActions style={{display: 'flex', justifyContent: 'flex-end', flex: 1}}>
            {
                status === EFileStatus.PENDING ?
                    <>
                        {
                            isCurrentUserSentMsg ? <FileStatusNameComponent status={status}/> :
                                <>
                                    <Button variant={'contained'} style={{backgroundColor: successColor(400)}}
                                            onClick={() => onUpdateStatus(EFileStatus.APPROVED)}>Approve</Button>
                                    <Button variant={'contained'} style={{backgroundColor: errorColor(600)}}
                                            onClick={() => onUpdateStatus(EFileStatus.REJECTED)}>reject</Button>
                                </>
                        }
                    </> : <FileStatusNameComponent status={status}/>
            }

        </CardActions>
    </Card>
}

export {FileMessageComponent}