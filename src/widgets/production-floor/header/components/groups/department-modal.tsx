import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "../style";
import { FONT_FAMILY } from "@/utils/font-family";

const DepartmentModal = ({ openModal, onClose }: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={t("Department name")}
      modalTitleStyle={{ ...FONT_FAMILY.Inter(600, 18) }}
      modalTitleColor={"#000000"}
      withRoundedCloseIcon={false}
      insideStyle={{
        ...classes.saveSelectionModalStyle,
        width: "20%",
        minWidth: "400px",
      }}
    >
      <Stack direction={"column"} gap={"25px"}>
        <span
          style={{
            ...FONT_FAMILY.Inter(400, 14),
            color: "#475467",
            width: "90%",
          }}
        >
          Please enter a name for Department you want to add.
        </span>
        <Stack direction={"column"} spacing={1}>
          <span style={{ ...FONT_FAMILY.Inter(400, 14), color: "#344054" }}>
            Department name
          </span>
          <GomakeTextInput
            sx={{
              minWidth: 180,
              borderRadius: "8px",
              border: "1px solid #D0D5DD",
              "& .MuiOutlinedInput-root": {
                "& input": {
                  height: "44px",
                },
              },
            }}
            placeholder={t("e.g. Printing Department")}
            value={""}
          />
        </Stack>
        <Stack
          direction={"row"}
          spacing={1}
          alignSelf={"flex-end"}
          width={"100%"}
        >
          <GomakePrimaryButton
            style={{
              width: "50%",
              borderRadius: "8px",
              height: "44px",
              background: "white",
              color: "#000000",
              border: "1px solid  #D0D5DD",
            }}
            onClick={onClose}
          >
            {t("Cancel")}
          </GomakePrimaryButton>
          <GomakePrimaryButton
            style={{
              width: "50%",
              borderRadius: "8px",
              height: "44px",
            }}
            onClick={() => null}
          >
            {t("Add")}
          </GomakePrimaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { DepartmentModal };
