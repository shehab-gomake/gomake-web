import { Stack } from "@mui/material";
import { useBoardMissionsNotes } from "@/widgets/production-floor/views/board-missions-view/stations/notes/use-board-missions-notes";
import { BoardMissionsNote } from "@/widgets/production-floor/views/board-missions-view/stations/notes/board-missions-note";
import { useRecoilValue } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const BoardMissionsNotes = () => {
  const { notes } = useBoardMissionsNotes();
  const boardMissionsDetails = useRecoilValue(boardMissionsDetailsState);
  const { t } = useTranslation();
  const { secondColor } = useGomakeTheme();

  return (
    <Stack direction={"column"} gap={"10px"}>
      {/* Quality Issue Reason - displayed first if exists */}
      {boardMissionsDetails?.qualityIssueReason && (
        <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
          <span
            style={{ ...FONT_FAMILY.Inter(600, 16), color: secondColor(500) }}
          >
            {t("productionFloor.qualityIssueReasonLabel")}:
          </span>
          <span style={{ ...FONT_FAMILY.Inter(500, 16), color: "#344054" }}>
            {boardMissionsDetails.qualityIssueReason}
          </span>
        </Stack>
      )}
      {/* Regular Notes */}
      {notes?.map((note, index) => (
        <BoardMissionsNote key={index} note={note} index={index} />
      ))}
    </Stack>
  );
};

export { BoardMissionsNotes };
