import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";
import {
  boardMissionsAddNote,
  boardMissionsDeleteNote,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";

const useBoardMissionsNotes = (onCloseModal?: () => void) => {
  const { callApi } = useGomakeAxios();
  const [newNote, setNewNote] = useState({
    noteType: 0,
    name: null,
    value: "",
  });
  const { query } = useRouter();
  const [boardMissions, setBoardMissions] = useRecoilState(
    boardMissionsDetailsState
  );
  const { boardMissionsId, productType } = query;
  const [deleting, setDeleting] = useState<boolean>(false);
  const [addingNote, setAddingNote] = useState<boolean>(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState<boolean>(false);
  const {
    alertSuccessAdded,
    alertFaultAdded,
    alertSuccessDelete,
    alertFaultDelete,
  } = useSnackBar();

  const handleAddNote = async () => {
    setAddingNote(true);
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        setAddingNote(false);
        setBoardMissions({
          ...boardMissions,
          noteValues: [...boardMissions?.noteValues, newNote],
        });
        setNewNote({ noteType: 0, name: null, value: "" });
        onCloseModal && onCloseModal();
      } else {
        alertFaultAdded();
      }
    };

    await boardMissionsAddNote(callApi, callBack, {
      boardMissionsId,
      note: newNote?.value,
      ...(productType && { productType }),
    });
  };

  const onDeleteNote = async (noteIndex: number) => {
    setDeleting(true);
    const callBack = (res) => {
      setDeleting(false);
      if (res.success) {
        alertSuccessDelete();
        setBoardMissions({
          ...boardMissions,
          noteValues: boardMissions.noteValues.filter(
            (_, i) => i !== noteIndex
          ),
        });
      } else {
        alertFaultDelete();
      }
    };
    await boardMissionsDeleteNote(callApi, callBack, {
      index: noteIndex,
      boardMissionsId,
      ...(productType && { productType }),
    });
  };

  const toggleNotesExpanded = () => {
    setIsNotesExpanded((prev) => !prev);
  };

  return {
    newNote,
    setNewNote,
    handleAddNote,
    notes: boardMissions?.noteValues,
    onDeleteNote,
    deleting,
    addingNote,
    isNotesExpanded,
    toggleNotesExpanded,
  };
};

export { useBoardMissionsNotes };
