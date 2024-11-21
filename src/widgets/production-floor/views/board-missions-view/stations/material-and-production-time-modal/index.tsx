import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "@/pages-components/board-missions/style";
import { useEffect, useState } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

interface IProps {
  state?: {
    boardMissionActionId?: string;
    currentStationId: string;
    productionTime: string;
    materials: {
      productType: string;
      workFlowActionId: string;
      materialKey: string;
      currentValue: string;
    }[];
  };
  openModal: boolean;
  onClose: () => void;
  onUpdate?: (updatedState: any) => void;
}
const MaterialsAndProductionTimeModalWidget = ({
  state,
  openModal,
  onClose,
  onUpdate,
}: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [productionTime, setProductionTime] = useState(state?.productionTime);
  const [materials, setMaterials] = useState(state?.materials || []);

  useEffect(() => {
    setProductionTime(state?.productionTime);
    setMaterials(state?.materials);
  }, [state]);

  const handleProductionTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductionTime(event.target.value);
  };

  const handleMaterialChange = (index: number, newValue: string) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index].currentValue = newValue;
    setMaterials(updatedMaterials);
  };

  const handleUpdate = () => {
    onUpdate({
      boardMissionActionId: state?.boardMissionActionId,
      currentStationId: state?.currentStationId,
      productionTime: productionTime,
      materials: materials,
      // materials: materials.map(({ materialKey, currentValue }) => ({
      //   materialKey,
      //   currentValue,
      // })),
    });
    onClose();
  };

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={t("Enter actual materials quantity and production time")}
      insideStyle={classes.materialsQuantityModalStyle}
      style={{ zIndex: 999999 }}
      withRoundedCloseIcon={false}
      modalTitleStyle={{ ...FONT_FAMILY.Inter(600, 18), color: "#000000" }}
    >
      <Stack direction="column" gap="30px">
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
              value={productionTime}
              onChange={handleProductionTimeChange}
              type="number"
              placeholder={t("boardMissions.productionTime")}
            />
          </div>

          {/* Materials Mapping */}
          {state?.materials.length > 0 && (
            <Stack direction="column" gap="10px">
              {materials?.map((material, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  gap="10px"
                  style={{ width: "100%" }}
                >
                  <div style={{ width: "50%" }}>
                    <h3 style={classes.filterLabelStyle}>
                      {material?.materialKey}
                    </h3>
                  </div>

                  {/* Quantity Input */}
                  <div style={{ width: "50%" }}>
                    <GomakeTextInput
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
          <GomakePrimaryButton
            style={{
              width: "50%",
              borderRadius: "8px",
              height: "44px",
            }}
            onClick={handleUpdate}
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
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { MaterialsAndProductionTimeModalWidget };
