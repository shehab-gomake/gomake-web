import { Card, CardActions, CardContent, IconButton, Typography} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import {IChatMessage} from "@/widgets/messenger/interfaces/chat-message";
import {Download} from "@mui/icons-material";
import Stack from "@mui/material/Stack";

interface IProps extends IChatMessage {
    isCurrentUserSentMsg: boolean;
    onApproveFile: (msg: string) => void
}

const FileMessageComponent = ({message, attachments, _id}: IProps) => {
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
    return <Card sx={{maxWidth: 345}}>
        <CardMedia
            component="img"
            height="194"
            image={attachments[0].url}
            alt="Paella dish"
        />
        <CardContent>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
                <IconButton>
                    <Download onClick={downloadFile}/>
                </IconButton>
            </Stack>
        </CardContent>
        <CardActions>
            {/*{*/}
            {/*    status === EFileStatus.PENDING ?*/}
            {/*        <>*/}
            {/*            {*/}
            {/*                isCurrentUserSentMsg ? <span>pending</span> :*/}
            {/*                    <>*/}
            {/*                        <Button onClick={() => onApproveFile(_id)}>accept</Button>*/}
            {/*                        <Button>reject</Button>*/}
            {/*                    </>*/}
            {/*            }*/}
            {/*        </> : <span>{EFileStatus.APPROVED ? 'approved' : 'rejected'}</span>*/}
            {/*}*/}

        </CardActions>
    </Card>
}

export {FileMessageComponent}