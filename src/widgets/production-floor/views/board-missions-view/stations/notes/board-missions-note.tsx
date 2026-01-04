import { CircularProgress, IconButton, Stack } from "@mui/material";
import { RemoveIcon } from "@/components/icons/remove-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useBoardMissionsNotes } from "@/widgets/production-floor/views/board-missions-view/stations/notes/use-board-missions-notes";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { useTranslation } from "react-i18next";
import parse from "html-react-parser";

enum NoteTypeEnum {
  general = 0,
}

interface IProps {
  note: {
    noteType: NoteTypeEnum;
    name: string | null;
    value: string;
  };
  index: number;
}

const BoardMissionsNote = ({ index, note }: IProps) => {
  const { t } = useTranslation();
  const { secondColor } = useGomakeTheme();
  const { onDeleteNote, deleting } = useBoardMissionsNotes();

  return (
    <Stack direction={"row"} gap={"10px"} alignItems={"center"} >
      <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
        <span
          style={{ ...FONT_FAMILY.Inter(600, 16), color: secondColor(500) }}
        >
          {`${note?.noteType !== NoteTypeEnum.general
              ? note?.name || "Unknown"
              : t(`productionFloor.${NoteTypeEnum[note?.noteType]}`) ||
              "Unknown"
            }:`}
        </span>
        <span style={{ ...FONT_FAMILY.Inter(500, 16), color: "#344054" }}>
          {parse(note?.value)}
        </span>
      </Stack>
      <PermissionCheck
        userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}
      >
        {deleting ? (
          <CircularProgress size={20} />
        ) : (
          <IconButton onClick={() => onDeleteNote(index).then()}>
            <RemoveIcon height={20} width={20} color={secondColor(500)} />
          </IconButton>
        )}
      </PermissionCheck>
    </Stack>
  );
};

export { BoardMissionsNote };
