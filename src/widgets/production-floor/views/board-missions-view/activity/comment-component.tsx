import {Avatar, Stack} from "@mui/material";
import {IBoardMissionsActivity} from "@/widgets/production-floor/interfaces/board-missions-activity";
import {FONT_FAMILY} from "@/utils/font-family";

const CommentComponent = ({userName, userImages, text}: IBoardMissionsActivity) => {
    return (
        <Stack  direction={'row'} gap={'12px'} alignItems={'flex-start'}>
            <Avatar src={userImages}/>
            <Stack style={{width: '100%', ...FONT_FAMILY.Inter(400, 16)}}>
                <span>{userName}</span>
                <span style={{ backgroundColor: '#F2F4F7', borderRadius: '0 8px 8px 8px', padding: '10px 14px 10px 14px'}} dangerouslySetInnerHTML={{__html: text}}></span>
            </Stack>
        </Stack>
    )
}

export {CommentComponent}