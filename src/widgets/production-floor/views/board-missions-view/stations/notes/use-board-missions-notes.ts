import {useGomakeAxios} from "@/hooks";
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
    const handleAddNote = async () => {
        const callBack = (res) => {
            if (res.success) {
                setBoardMissions({...boardMissions, notes: [...boardMissions.notes, newNote]});
                setNewNote('')
                onCloseModal && onCloseModal();
            }
        }
        await boardMissionsAddNote(callApi, callBack, {boardMissionsId, note: newNote});
    }

    const onDeleteNote = async (noteIndex: number) => {
        const callBack = res => {
            if (res.success) {
                setBoardMissions({
                    ...boardMissions,
                    notes: boardMissions.notes.filter((note, i) => i !== noteIndex)
                })
            }
        }
        await boardMissionsDeleteNote(callApi, callBack, {index: noteIndex, boardMissionsId})
    }
    return {
        newNote,
        setNewNote,
        handleAddNote,
        notes: boardMissions.notes,
        onDeleteNote
    }
}

export {useBoardMissionsNotes}