import {Stack} from "@mui/material";
import {GoMakeModal} from "@/components";
import {Textarea} from "@mui/joy";
import {FONT_FAMILY} from "@/utils/font-family";
import {PrimaryButton} from "@/components/button/primary-button";
import {
    useBoardMissionsNotes
} from "@/widgets/production-floor/views/board-missions-view/stations/notes/use-board-missions-notes";

interface IProps {
    openModal: boolean;
    onClose: () => void
}

const BoardMissionsAddNote = ({openModal, onClose}: IProps) => {
    const {newNote, setNewNote, handleAddNote} = useBoardMissionsNotes(onClose);
    return (
        <GoMakeModal style={{zIndex: 999999}} insideStyle={{width: '400px', height: '350px'}} openModal={openModal}
                     onClose={onClose} modalTitle={'add your note here'}>
            <Stack height={'100%'} gap={'20px'}>
                <Textarea style={{height: '100%', width: '100%', ...FONT_FAMILY.Inter(400, 16)}}
                          placeholder="Fill your note here..." value={newNote} onChange={(e) => setNewNote(e.target.value)}/>
                <Stack gap={'12px'} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <PrimaryButton onClick={onClose} variant={'outlined'}>cancel</PrimaryButton>
                    <PrimaryButton variant={'contained'} onClick={handleAddNote}>add note</PrimaryButton>
                </Stack>
            </Stack>
        </GoMakeModal>
    );
}

export {BoardMissionsAddNote}