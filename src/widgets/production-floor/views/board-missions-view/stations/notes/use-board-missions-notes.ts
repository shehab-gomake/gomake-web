import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useState} from "react";
import {
    boardMissionsAddNote,
    boardMissionsDeleteNote
} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";

const useBoardMissionsNotes = (onCloseModal?: () => void) => {
    const {callApi} = useGomakeAxios();
    const [newNote, setNewNote] = useState<string>('');
    const {query} = useRouter();
    const [boardMissions, setBoardMissions] = useRecoilState(boardMissionsDetailsState);
    const {boardMissionsId} = query;
    const [deleting, setDeleting] = useState<boolean>(false);
    const [addingNote, setAddingNote] = useState<boolean>(false);
    const {alertSuccessAdded, alertFaultAdded, alertSuccessDelete, alertFaultDelete} = useSnackBar();
    const handleAddNote = async () => {
        setAddingNote(true)
        const callBack = (res) => {
            if (res.success) {
                alertSuccessAdded();
                setAddingNote(false)
                setBoardMissions({...boardMissions, notes: [...boardMissions.notes, newNote]});
                setNewNote('')
                onCloseModal && onCloseModal();
            } else {
                alertFaultAdded();
            }
        }
        await boardMissionsAddNote(callApi, callBack, {boardMissionsId, note: newNote});
    }

    const onDeleteNote = async (noteIndex: number) => {
        setDeleting(true)
        const callBack = res => {
            setDeleting(false)
            if (res.success) {
                alertSuccessDelete();
                setBoardMissions({
                    ...boardMissions,
                    notes: boardMissions.notes.filter((note, i) => i !== noteIndex)
                })
            } else {
                alertFaultDelete();
            }
        }
        await boardMissionsDeleteNote(callApi, callBack, {index: noteIndex, boardMissionsId})
    }
    return {
        newNote,
        setNewNote,
        handleAddNote,
        notes: boardMissions.notes,
        onDeleteNote,
        deleting,
        addingNote
    }
}

export {useBoardMissionsNotes}