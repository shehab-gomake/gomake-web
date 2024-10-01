import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "../style";
import { FONT_FAMILY } from "@/utils/font-family";
import { useRecoilState } from "recoil";
import { stationFilterGroupState } from "@/widgets/production-floor/state/filter-group";
import { IStationFilterGroup } from "@/widgets/production-floor/interfaces/borad-missions-filter-groups";

const DepartmentModal = ({ openModal, onClose, onClickAdd }: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [stationFilterGroup, setStationFilterGroup] =
    useRecoilState<IStationFilterGroup>(stationFilterGroupState);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStationFilterGroup({
      ...stationFilterGroup,
      name: e.target.value,
    });
  };

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={t("productionFloor.departmentName")}
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
          {t("productionFloor.departmentModalSubTitle")}
        </span>
        <Stack direction={"column"} spacing={1}>
          <span style={{ ...FONT_FAMILY.Inter(400, 14), color: "#344054" }}>
            {t("productionFloor.departmentName")}
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
            placeholder={t("productionFloor.departmentName")}
            value={stationFilterGroup?.name}
            onChange={handleNameChange}
          />
        </Stack>
        <Stack
          direction={"row"}
          gap={"10px"}
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
            {t("materials.buttons.cancel")}
          </GomakePrimaryButton>
          <GomakePrimaryButton
            style={{
              width: "50%",
              borderRadius: "8px",
              height: "44px",
            }}
            onClick={onClickAdd}
          >
            {t("materials.buttons.add")}
          </GomakePrimaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { DepartmentModal };
