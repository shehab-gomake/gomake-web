import {Button, Card, CardActions, CardContent, IconButton, Link, Typography} from "@mui/material";
import {IChatMessage} from "@/widgets/messenger/interfaces/chat-message";
import {EFileStatus} from "@/widgets/messenger/enums";
import Stack from "@mui/material/Stack";
import {useEffect, useState} from "react";
import {FileStatusNameComponent} from "@/widgets/messenger/components/file-status-name-component";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";
import {useTranslation} from "react-i18next";

interface IProps extends IChatMessage {
    isCurrentUserSentMsg: boolean;
    onUpdateApprovalQouteMessageStatus: (requestId: string, updatedStatus: string, senderId: number, type: number) => void;
    getApprovalStatus: (id: string) => Promise<unknown>;
    updatedApprovalRequest: { approvalRequestId: string, newStatus: EFileStatus };
}


const QuoteApprovalMessageComponent = ({
                                  message,
                                  isCurrentUserSentMsg,
                                  onUpdateApprovalQouteMessageStatus,
                                  _id,
                                  quote_approval_Request_id,
                                  getApprovalStatus,
                                  sender_id,
                                  updatedApprovalRequest
                              }: IProps) => {
    const [status, setStatus] = useState<EFileStatus>(EFileStatus.PENDING);
    const {successColor, errorColor, grayColor, primaryColor, secondColor} = useGomakeTheme();
    const {t} = useTranslation();

    const onUpdateStatus = (newStatus: EFileStatus) => {
        onUpdateApprovalQouteMessageStatus(quote_approval_Request_id, newStatus, sender_id, 0);
        setStatus(newStatus)

    }

    useEffect(() => {
        getApprovalStatus(quote_approval_Request_id)
            .then(s => {
                setStatus(s as EFileStatus)
            })

    }, []);

    useEffect(() => {
        if (!!updatedApprovalRequest) {
            if (updatedApprovalRequest.approvalRequestId == quote_approval_Request_id) {
                setStatus(updatedApprovalRequest.newStatus);
            }
        }
    }, [updatedApprovalRequest])

    return <Card sx={{
        width: 300,
    }}>
        <CardContent>
            <Stack gap={'5px'} justifyContent={'space-between'}>
                <Link href={`/quotes?quoteNumber=${message}`} style={{...FONT_FAMILY.Inter(500, 14), color: grayColor(700)}}>
                    {`${t('messenger.quoteMessage')} ${message}`}
                </Link>
            </Stack>
        </CardContent>
        <CardActions style={{display: 'flex', justifyContent: 'flex-end', flex: 1}}>
            {
                true ?
                    <>
                        {
                            isCurrentUserSentMsg ? <FileStatusNameComponent status={status}/> :
                                <>
                                    <Button variant={'contained'} style={{backgroundColor: primaryColor(400)}}
                                            onClick={() => onUpdateStatus(EFileStatus.APPROVED)}>Approve</Button>
                                    <Button variant={'contained'} style={{backgroundColor: secondColor(600)}}
                                            onClick={() => onUpdateStatus(EFileStatus.REJECTED)}>reject</Button>
                                </>
                        }
                    </> : <FileStatusNameComponent status={status}/>
            }

        </CardActions>
    </Card>
}

export {QuoteApprovalMessageComponent}