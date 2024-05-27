import {CircularProgress, IconButton, Stack} from "@mui/material";
import {DeleteIcon} from "@/components/icons/delete-icon";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";
import {
    useBoardMissionsNotes
} from "@/widgets/production-floor/views/board-missions-view/stations/notes/use-board-missions-notes";

interface IProps {
    note: string;
    index: number;
}
const BoardMissionsNote = ({index, note}: IProps) => {
    const {secondColor, grayColor} = useGomakeTheme();
    const {onDeleteNote, deleting} = useBoardMissionsNotes();
    return(
        <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
            <span style={{...FONT_FAMILY.Inter(500, 14), color: grayColor(500)}}>{`Note #${index + 1}`}</span>
            <span style={{...FONT_FAMILY.Inter(600, 14), color: grayColor(700)}}>{note}</span>
            {deleting ? <CircularProgress size={20}/> : <IconButton onClick={() => onDeleteNote(index).then()}><DeleteIcon height={20} width={20} color={secondColor(500)}/></IconButton>}
        </Stack>
    )
}

export {BoardMissionsNote}