import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "../style";
import { FONT_FAMILY } from "@/utils/font-family";

const SaveSelectionModal = ({ openModal, onClose, onClickSave }: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  const handleSave = () => {
    onClickSave();
    onClose();
  };

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={t("productionFloor.selectionModalTitle")}
      modalTitleStyle={{ ...FONT_FAMILY.Inter(600, 18) }}
      modalTitleColor={"#000000"}
      withRoundedCloseIcon={false}
      insideStyle={classes.saveSelectionModalStyle}
    >
      <Stack direction={"column"} gap={"25px"}>
        <span style={{ ...FONT_FAMILY.Inter(400, 14), color: "#475467" }}>
          {t("productionFloor.selectionModalSubTitle")}
        </span>
        <Stack direction={"row"} gap={"10px"} alignSelf={"flex-end"}>
          <GomakePrimaryButton
            style={{
              width: "fit-content",
              borderRadius: "8px",
              height: "44px",
              background: "white",
              color: "#000000",
              border: "1px solid  #D0D5DD",
            }}
            onClick={onClose}
          >
            {t("materials.buttons.discard")}
          </GomakePrimaryButton>
          <GomakePrimaryButton
            style={{
              width: "fit-content",
              borderRadius: "8px",
              height: "44px",
            }}
            onClick={handleSave}
          >
            {t("materials.buttons.save")}
          </GomakePrimaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { SaveSelectionModal };
