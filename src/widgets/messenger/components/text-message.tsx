import Stack from "@mui/material/Stack";

interface IProps {
  sessionUserId: number;
  message: {
    sender_id: number;
    message: string;
  }
}
const TextMessageComponent = ({sessionUserId, message}: IProps) => {
  return <Stack borderRadius={'12px'}  width={'fit-content'}
                style={{
                  backgroundColor: message.sender_id === sessionUserId ? '#2E3092' : '#F1F1F1',
                  color: message.sender_id === sessionUserId ? '#FFF' : '#000000',
                }}>
    <span style={{padding: '8px'}}>{message.message}</span>
  </Stack>
}

export {TextMessageComponent}