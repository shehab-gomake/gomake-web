import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "@/pages-components/board-missions/style";
import { FONT_FAMILY } from "@/utils/font-family";
import { useRecoilState } from "recoil";
import { boardMissionMaterialState } from "./states";
import { MaterialStockUnit } from "@/widgets/materials-widget/enums";

interface IProps {
  openModal: boolean;
  onClose: () => void;
  onUpdate: (updatedState: any, isSendMessage?: boolean) => void;
  showIsReady?: boolean;
}

const MaterialsAndProductionTimeModalWidget = ({
  openModal,
  onClose,
  onUpdate,
  showIsReady = false,
}: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [state, setState] = useRecoilState<any>(boardMissionMaterialState);

  const convertMinutesToSeconds = (minutes: number) => minutes * 60;
  const convertSecondsToMinutes = (seconds: string | number) =>
    Math.floor(Number(seconds) / 60);

  const handleMaterialChange = (index: number, newValue: string) => {
    setState((prevState) => ({
      ...prevState,
      materials: prevState?.materials.map((item, idx) =>
        idx === index ? { ...item, currentValue: newValue } : item
      ),
    }));
  };

  const handleUpdate = (isSendingMessage?: boolean | null) => {
    onUpdate(state, isSendingMessage);
    onClose();
  };

  const handleProductionTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValueInMinutes = parseInt(event.target.value, 10);

    if (!isNaN(newValueInMinutes)) {
      setState((prevState) => ({
        ...prevState,
        productionTime: convertMinutesToSeconds(newValueInMinutes), // Store in seconds
      }));
    }
  };

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      withClose={showIsReady ? false : true}
      isMiddleTitle={showIsReady ? true : false}
      modalTitle={
        showIsReady
          ? t("boardMissions.markDoneModalTitle")
          : t("boardMissions.materialsAndPTModalTitle")
      }
      insideStyle={{
        ...classes.materialsQuantityModalStyle,
        ...(showIsReady && { width: "fit-content" }),
      }}
      style={{ zIndex: 999999 }}
      withRoundedCloseIcon={false}
      modalTitleStyle={{
        ...(showIsReady
          ? { ...FONT_FAMILY.Inter(600, 16), textAlign: "center" }
          : FONT_FAMILY.Inter(600, 18)),
        color: "#000000",
      }}
    >
      <Stack direction="column" gap="30px">
        {showIsReady && (
          <div style={classes.subTitle}>
            {t("boardMissions.markDoneModalSubTitle")}
          </div>
        )}
        <Stack
          direction="column"
          gap="15px"
          maxHeight={"200px"}
          overflow={"scroll"}
          padding={"0px 10px"}
          sx={{
            "::-webkit-scrollbar": {
              width: "8px",
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: "#CCCDCF",
              borderRadius: "4px",
              cursor: "pointer",
            },
            "::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#888",
            },
          }}
        >
          {/* Production Time Input */}
          <div style={{ width: "100%" }}>
            <h3 style={classes.filterLabelStyle}>
              {t("boardMissions.productionTime")}
            </h3>
            <GomakeTextInput
              style={classes.textInputStyle}
              value={convertSecondsToMinutes(state?.productionTime || 0)}
              onChange={handleProductionTimeChange}
              type="number"
              placeholder={t("boardMissions.productionTime")}
            />
          </div>

          {/* Materials Mapping */}
          {state?.materials?.length > 0 && (
            <Stack direction="column" gap="10px">
              {state?.materials.map((material, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  gap="10px"
                  style={{ width: "100%" }}
                >
                  <div style={{ width: "50%" }}>
                    <h3 style={classes.filterLabelStyle}>
                      {`${material?.materialKey} (${
                        MaterialStockUnit[material?.unit]
                      })`}
                    </h3>
                  </div>

                  {/* Quantity Input */}
                  <div style={{ width: "50%" }}>
                    <GomakeTextInput
                      key={`input-${material.materialKey}-${index}`}
                      style={classes.textInputStyle}
                      value={material?.currentValue}
                      onChange={(e) =>
                        handleMaterialChange(index, e.target.value)
                      }
                      type="number"
                      placeholder={t("boardMissions.quantity")}
                    />
                  </div>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
        {/* Buttons */}
        <Stack direction="row" gap="15px" justifyContent="flex-end">
          {showIsReady ? (
            <>
              <GomakePrimaryButton
                style={classes.yesBtn}
                onClick={() => handleUpdate(true)}
              >
                {t("boardMissions.markDoneModalYes")}
              </GomakePrimaryButton>
              <GomakePrimaryButton
                style={classes.noBtn}
                onClick={() => handleUpdate(false)}
              >
                {t("boardMissions.markDoneModalNo")}
              </GomakePrimaryButton>
              <GomakePrimaryButton style={classes.cancelBtn} onClick={onClose}>
                {t("modal.cancel")}
              </GomakePrimaryButton>
            </>
          ) : (
            <>
              <GomakePrimaryButton
                style={{
                  width: "50%",
                  borderRadius: "8px",
                  height: "44px",
                }}
                onClick={() => handleUpdate(false)}
              >
                {t("modal.update")}
              </GomakePrimaryButton>
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
                {t("modal.cancel")}
              </GomakePrimaryButton>
            </>
          )}
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { MaterialsAndProductionTimeModalWidget };
