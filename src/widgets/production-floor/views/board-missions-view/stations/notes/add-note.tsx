import { CircularProgress, Stack } from "@mui/material";
import { GoMakeModal } from "@/components";
import { Textarea } from "@mui/joy";
import { FONT_FAMILY } from "@/utils/font-family";
import { PrimaryButton } from "@/components/button/primary-button";
import { useBoardMissionsNotes } from "@/widgets/production-floor/views/board-missions-view/stations/notes/use-board-missions-notes";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-responsive";

interface IProps {
  openModal: boolean;
  onClose: () => void;
}

const BoardMissionsAddNote = ({ openModal, onClose }: IProps) => {
  const { t } = useTranslation();
  const { newNote, setNewNote, handleAddNote, addingNote } =
    useBoardMissionsNotes(onClose);
  const isMobile = useIsMobile();

  return (
    <GoMakeModal
      style={{ zIndex: 999999 }}
      insideStyle={{ width: isMobile ? "90vw" : "400px", height: "350px" }}
      openModal={openModal}
      onClose={onClose}
      withRoundedCloseIcon={false}
      modalTitle={t("productionFloor.addYourNote")}
      modalTitleStyle={
        isMobile ? { ...FONT_FAMILY.Inter(500, 22), padding: "0px 18px" } : {}
      }
    >
      <Stack
        height={"100%"}
        gap={"20px"}
        padding={isMobile ? "10px 0px" : undefined}
      >
        <Textarea
          style={{
            height: "100%",
            width: isMobile ? "90%" : "100%",
            alignSelf: "center",
            ...FONT_FAMILY.Inter(400, 16),
          }}
          placeholder={t("productionFloor.fillYourNote")}
          value={newNote?.value}
          onChange={(e) => setNewNote({ ...newNote, value: e.target.value })}
          onClick={(e) => e.currentTarget.querySelector("textarea")?.focus()} // ensure focus on click
        />
        <Stack
          gap={"12px"}
          direction={"row"}
          justifyContent={"space-between"}
          width={isMobile ? "90%" : "100%"}
          alignSelf={"center"}
        >
          <PrimaryButton onClick={onClose} variant={"outlined"}>
            {t("reports.cancel")}
          </PrimaryButton>
          <PrimaryButton
            disabled={addingNote}
            endIcon={addingNote ? <CircularProgress size={20} /> : undefined}
            variant={"contained"}
            onClick={handleAddNote}
          >
            {t("productionFloor.addNote")}
          </PrimaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { BoardMissionsAddNote };
