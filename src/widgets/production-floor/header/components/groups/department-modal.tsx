import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { Popover, Stack } from "@mui/material";
import { useStyle } from "../style";
import { FONT_FAMILY } from "@/utils/font-family";
import { SketchPicker } from "react-color";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useDepartmentModal } from "./use-department-modal";

const DepartmentModal = ({ openModal, onClose, onClickAdd }: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  const {
    color,
    stationFilterGroup,
    setStationFilterGroup,
    handleNameChange,
    anchorElPopover,
    showColorPicker,
    handleColorChange,
    handleOpenColorPicker,
    handleColorPickerClose,
  } = useDepartmentModal();

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
            width: "100%",
          }}
        >
          {t("productionFloor.departmentModalSubTitle")}
        </span>
        <Stack direction={"column"} spacing={1}>
          <span style={{ ...FONT_FAMILY.Inter(500, 14), color: "#344054" }}>
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
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <span
            style={{
              ...FONT_FAMILY.Inter(500, 14),
              color: "#344054",
              width: "50%",
            }}
          >
            {t("productionFloor.pickColor")}
          </span>
          <div style={classes.colorDiv} onClick={handleOpenColorPicker}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: color,
              }}
            />
            <span>{color}</span>
            {showColorPicker ? (
              <KeyboardArrowUpIcon sx={{ color: "#98A2B3" }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ color: "#98A2B3" }} />
            )}
          </div>
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
      <Popover
        key={`popover-color-picker`}
        open={showColorPicker}
        onClose={handleColorPickerClose}
        anchorEl={anchorElPopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <SketchPicker
          key={`SketchPicker-color`}
          color={color}
          onChange={handleColorChange}
        />
      </Popover>
    </GoMakeModal>
  );
};

export { DepartmentModal };
