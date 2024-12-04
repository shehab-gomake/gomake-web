import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { CircleCheckbox } from "@/components/check-box/circle-check-box";
import { FONT_FAMILY } from "@/utils/font-family";
import { Button, Checkbox, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { UpdateTypes } from "./section-mapping";
import { CheckboxIcon } from "@/icons";
import { CheckboxCheckedIcon } from "@/icons";

interface UpdateParameterModalProps {
  openModal: boolean;
  onClose: () => void;
  onUpdate: any;
  selectedUpdateType: UpdateTypes | null;
  setSelectedUpdateType: any;
  setDontAskNextTime: any;
  dontAskNextTime: boolean;
}

const UpdateParameterModal = ({
  openModal,
  onClose,
  onUpdate,
  selectedUpdateType,
  setSelectedUpdateType,
  setDontAskNextTime,
  dontAskNextTime
}: UpdateParameterModalProps) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.parameters.updateParameterModalTitle")}
        onClose={onClose}
        modalTitleStyle={{
          ...FONT_FAMILY.Inter(600, 18),
          paddingBottom: "20px",
        }}
        modalTitleColor={"#000000"}
        withRoundedCloseIcon={false}
        insideStyle={clasess.insideStyle}
      >
        <Stack direction={"column"} gap={"5px"} paddingBottom={"20px"}>
          <Stack direction={"row"} width={"100%"} alignItems={"center"}>
            <CircleCheckbox
              checked={selectedUpdateType === UpdateTypes.PRODUCT_ONLY}
              onChange={() => setSelectedUpdateType(UpdateTypes.PRODUCT_ONLY)}
            />
            <span style={clasess.optionsTitle}>
              {t("products.parameters.productOnly")}
            </span>
          </Stack>
          <Stack direction={"row"} width={"100%"} alignItems={"center"}>
            <CircleCheckbox
              checked={selectedUpdateType === UpdateTypes.SAME_PRICING_TYPE}
              onChange={() =>
                setSelectedUpdateType(UpdateTypes.SAME_PRICING_TYPE)
              }
            />
            <span style={clasess.optionsTitle}>
              {t("products.parameters.samePricingType")}
            </span>
          </Stack>

          {/* <Stack direction={"row"} width={"100%"} alignItems={"center"}>
            <CircleCheckbox
              checked={selectedUpdateType === UpdateTypes.ALL_PRODUCTS}
              onChange={() => setSelectedUpdateType(UpdateTypes.ALL_PRODUCTS)}
            />
            <span style={clasess.optionsTitle}>
              {t("products.parameters.allProducts")}
            </span>
          </Stack> */}
        </Stack>
        <Checkbox
          checked={dontAskNextTime}
          onChange={() => setDontAskNextTime(!dontAskNextTime)}
          icon={<CheckboxIcon />}
          checkedIcon={<CheckboxCheckedIcon />}
          disabled={selectedUpdateType === null}
        />
        <span style={clasess.dontAskNextTime}>
          {t("products.parameters.dontAskNextTime")}
        </span>
        <Stack direction={"row"} gap={"10px"}>
          <Button style={clasess.cancelButton} onClick={onClose}>
            {t("modal.cancel")}
          </Button>
          <GomakePrimaryButton
            style={{
              width: "50%",
              borderRadius: "8px",
              height: "44px",
            }}
            onClick={onUpdate}
          >
            {t("modal.update")}
          </GomakePrimaryButton>
        </Stack>
      </GoMakeModal>
    </>
  );
};
export { UpdateParameterModal };
