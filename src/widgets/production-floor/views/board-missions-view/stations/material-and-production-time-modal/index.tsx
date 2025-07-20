import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "@/pages-components/board-missions/style";
import { FONT_FAMILY } from "@/utils/font-family";
import { MaterialStockUnit } from "@/widgets/materials-widget/enums";
import { useIsMobile } from "@/hooks/use-responsive";
import { useMaterialAndProductionTimeModal } from "./use-material-and-production-time-modal";

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
  const isMobile = useIsMobile();

  const {
    handleMaterialChange,
    handleUpdate,
    handleProductionTimeChange,
    convertSecondsToMinutes,
    state,
    storageList,
    inputValue,
    setInputValue,
    handleStorageChange,
    addPrintHouseJobsStorage
  } = useMaterialAndProductionTimeModal({ onUpdate, onClose })
  const defaultValue = storageList?.find(
    (option: any) => option?.storage === state?.storage
  )
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

        ...(showIsReady && {
          width: isMobile ? "90vw" : "fit-content",
        }),
      }}
      style={{ zIndex: 999999 }}
      withRoundedCloseIcon={false}
      modalTitleStyle={{
        ...(showIsReady
          ? { ...FONT_FAMILY.Inter(600, 16), textAlign: "center" }
          : { ...FONT_FAMILY.Inter(600, 18) }),
        ...(isMobile && { padding: "5px" }),
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

          <div style={{ width: "100%" }}>
            <h3 style={classes.filterLabelStyle}>
              {t("boardMissions.storage")}
            </h3>
            <GoMakeAutoComplate
              options={
                storageList?.find(
                  (option: any) => option.storage === inputValue
                ) || inputValue === ""
                  ? storageList
                  : [
                    {
                      storage: `Add "${inputValue}" as a new storage`,
                      id: "new",
                    },
                    ...storageList,
                  ]
              }
              placeholder={t("boardMissions.selectStorage")}
              key={defaultValue}
              style={classes.textInputStyle}
              getOptionLabel={(option: any) => option?.storage}
              value={defaultValue}
              onChange={(e: any, value: any) => {
                if (value?.id === "new") {
                  addPrintHouseJobsStorage(inputValue);
                  setInputValue("");
                } else {
                  handleStorageChange(e, value);
                  setInputValue("");
                }
              }}
              onInputChange={(event: any, newInputValue: string) => {
                setInputValue(newInputValue);
              }}
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
                      {`${material?.materialKey} (${t(`boardMissions.${MaterialStockUnit[material?.unit]}`)})`}
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
        <Stack
          direction="row"
          gap="15px"
          justifyContent="flex-end"
          style={{
            ...(isMobile && showIsReady ? { flexWrap: "wrap" } : {}),
          }}
        >
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
