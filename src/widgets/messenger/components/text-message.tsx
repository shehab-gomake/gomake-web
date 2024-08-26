import Stack from "@mui/material/Stack";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";

interface IProps {
  sessionUserId: number;
  message: {
    sender_id: number;
    message: string;
  }
}
const TextMessageComponent = ({sessionUserId, message}: IProps) => {
    const {primaryColor} = useGomakeTheme();
  return <Stack borderRadius={message.sender_id === sessionUserId ? '16px 16px 0px 16px' : '16px 16px 16px 0px'}  width={'fit-content'} padding={'10px 20px'}
                style={{
                  backgroundColor: message.sender_id === sessionUserId ? primaryColor(300) : '#F5F5F5',
                  color: message.sender_id === sessionUserId ? '#FBFBFD' : '#141414',
                    ...FONT_FAMILY.Lexend(400, 14)
                }}>
    <span style={{padding: '8px'}}>{message.message}</span>
  </Stack>
}

export {TextMessageComponent}