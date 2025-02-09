import { Stack } from "@mui/material";
import { useBoardMissionsNotes } from "@/widgets/production-floor/views/board-missions-view/stations/notes/use-board-missions-notes";
import { BoardMissionsNote } from "@/widgets/production-floor/views/board-missions-view/stations/notes/board-missions-note";

const BoardMissionsNotes = () => {
  const { notes } = useBoardMissionsNotes();

  return (
    <Stack direction={"column"} gap={"10px"}>
      {notes?.map((note, index) => (
        <BoardMissionsNote note={note} index={index} />
      ))}
    </Stack>
  );
};

export { BoardMissionsNotes };
