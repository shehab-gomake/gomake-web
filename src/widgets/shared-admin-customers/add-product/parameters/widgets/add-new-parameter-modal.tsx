import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, } from "@/components";
import { CircleCheckbox } from "@/components/check-box/circle-check-box";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { UpdateTypes } from "./section-mapping";

import { GoMakeTextInput } from "@/components/text-input/go-make-text-input";
import { Button, Stack } from "@mui/material";
import { addParameterToProductApi } from "@/services/api-service/products/product-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";

interface AddNewParameterModalProps {
  openModal: boolean;
  onClose: () => void;
  newParameterState: any;
  onChangeInputs: any;
  getProductById: any;
}

const AddNewParameterModal = ({
  openModal,
  onClose,
  newParameterState,
  onChangeInputs,
  getProductById
}: AddNewParameterModalProps) => {
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded, alertFault } = useSnackBar();
  const { t } = useTranslation();
  const { classes } = useStyle();
  const parameterTypeOptions = [
    { text: t("machineAttributes.number"), value: 1 },
    { text: t("machineAttributes.text"), value: 2 },
    { text: t("machineAttributes.boolean"), value: 3 },
    { text: t("machineAttributes.fixedValues"), value: 6 },
    { text: t("machineAttributes.quantity"), value: 7 },
    { text: t("sales.quote.jobName"), value: 8 },
  ];

  const addActionToProduct = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded()
        getProductById()
        onClose()
      }
      else {
        if (res?.errors?.ErrorMessage) {
          alertFault(res?.errors?.ErrorMessage)
        }
        else {
          alertFaultAdded()
        }
      }
    }

    const isQuantityParameter = newParameterState?.parameterType === 7;
    const isJobNameParameter = newParameterState?.parameterType === 8;
    const payload = {
      productId: newParameterState?.productId,
      sectionId: newParameterState?.sectionId,
      subSectionId: newParameterState?.subSectionId,
      updateType: newParameterState?.updateType,
      parameterName: newParameterState?.parameterName,
      parameterType: isQuantityParameter ? 1 : isJobNameParameter ? 2 : newParameterState?.parameterType,
      ...(isQuantityParameter && { isQuantityParameter: true }),
      ...(isJobNameParameter && { isJobNameParameter: true })
    };

    await addParameterToProductApi(callApi, callBack, payload);
  }
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.parameters.addNewParameter")}
        onClose={onClose}
        modalTitleStyle={{
          ...FONT_FAMILY.Inter(600, 18),
          paddingBottom: "20px",
        }}
        modalTitleColor={"#000000"}
        insideStyle={classes.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span>{t("products.parameters.parameterName")}</span>
          <GoMakeTextInput
            key={"ticket-title"}
            onChange={(e) => onChangeInputs("parameterName", e.target.value)}
            placeholder={t("products.parameters.parameterName")}
            value={newParameterState?.parameterName}
          />
          <span>{t("products.parameters.parameterType")}</span>
          <GoMakeAutoComplate
            options={parameterTypeOptions}
            onChange={(e, val) => onChangeInputs("parameterType", val?.value)}
            placeholder={t("products.parameters.parameterType")}
            getOptionLabel={(option) => option.text}
            value={newParameterState?.parameterType}
            style={{ border: "1px solid #E0E0E0" }}
          />
          <span>{t("products.parameters.updateType")}</span>
          <Stack direction={"column"} gap={"5px"} paddingBottom={"20px"}>
            <Stack direction={"row"} width={"100%"} alignItems={"center"}>
              <CircleCheckbox
                checked={newParameterState?.updateType === UpdateTypes.PRODUCT_ONLY}
                onChange={() => onChangeInputs("updateType", UpdateTypes.PRODUCT_ONLY)}
              />
              <span style={classes.optionsTitle}>
                {t("products.parameters.productOnly")}
              </span>
            </Stack>
            <Stack direction={"row"} width={"100%"} alignItems={"center"}>
              <CircleCheckbox
                checked={newParameterState?.updateType === UpdateTypes.SAME_PRICING_TYPE}
                onChange={() =>
                  onChangeInputs("updateType", UpdateTypes.SAME_PRICING_TYPE)
                }
              />
              <span style={classes.optionsTitle}>
                {t("products.parameters.samePricingType")}
              </span>
            </Stack>

          </Stack>
          <Stack direction={"row"} gap={"10px"}>
            <Button style={classes.cancelButton} onClick={onClose}>
              {t("modal.cancel")}
            </Button>
            <GomakePrimaryButton
              style={{
                width: "50%",
                borderRadius: "8px",
                height: "44px",
              }}
              onClick={addActionToProduct}
            >
              {t("products.parameters.addNewParameter")}
            </GomakePrimaryButton>
          </Stack>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewParameterModal };
