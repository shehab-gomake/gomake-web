import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "./style";
import { EParameterTypes } from "@/enums";
import { UpdateParameterModal } from "../parameters/widgets/update-parameter-modal";
import { useRecoilState } from "recoil";
import { selectedUpdateTypeState } from "@/store";
import { useRouter } from "next/router";
import { updateProductParametersValuesExternalValuesApi } from "@/services/api-service/products/product-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { PlusNewIcon } from "@/icons";
import { DeleteIcon } from "@/components/icons/delete-icon";
import { Stack } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const ExternalValuesIdModal = ({
  openModal,
  onClose,
  parameter,
  sectionId,
  subSectionId,
  getProductById,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertSuccessUpdate, alertFault } = useSnackBar();
  const { primaryColor } = useGomakeTheme();
  // const modalTitle = `${parameter?.name} / ${t(
  //   "products.parameters.admin.values"
  // )}`;

  const modalTitle = `${parameter?.name}`;
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [selectedUpdateType, setSelectedUpdateType] = useRecoilState(
    selectedUpdateTypeState
  );
  const [valuesConfigs, setValuesConfigs] = useState(
    parameter?.valuesConfigs || []
  );

  const isMaterial =
    parameter?.parameterType === EParameterTypes.SELECT_MATERIALS ||
    parameter?.parameterType === EParameterTypes.ADVERTISING_PRODUCT_CATEGORY ||
    parameter?.parameterType === EParameterTypes.ADVERTISING_PRODUCT_NAME;

  const isSwitch = parameter?.parameterType === EParameterTypes.SWITCH;

  useEffect(() => {
    if (parameter?.valuesConfigs) {
      setValuesConfigs([...parameter.valuesConfigs]);
    }
  }, [parameter]);

  const changeItems = (index, fieldName, value) => {
    setValuesConfigs((prev) => {
      const temp = [...prev];
      temp[index] = {
        ...temp[index],
        [fieldName]: value,
      };
      return temp;
    });
  };

  const handleUpdate = async () => {
    const values = valuesConfigs
      ?.map(({ id, externalValue, updateName, valueId }) => ({
        id,
        value: isMaterial || isSwitch ? valueId : updateName,
        externalCode: externalValue,
      }))
      .filter(({ externalCode }) => externalCode);

    // if (!values || values.length === 0) {
    //   alertFaultUpdate(); // Alert for empty array
    //   return;
    // }

    const updatePayload = {
      parameterId: parameter?.id,
      productId: router?.query?.id,
      updateType: selectedUpdateType,
      sectionId: sectionId,
      subSectionId: subSectionId,
      values,
    };
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        onClose();
        setOpenUpdateModal(false);
        getProductById();
      } else {
        alertFaultUpdate();
      }
    };
    await updateProductParametersValuesExternalValuesApi(
      callApi,
      callBack,
      updatePayload
    );
  };
  const addEmptyValue = () => {
    if (
      valuesConfigs &&
      valuesConfigs.length > 0 &&
      valuesConfigs.find((x) => !x.updateName)
    ) {
      alertFault("there is a empty row");
      return;
    }
    setValuesConfigs([...valuesConfigs, { updateName: "" }]);
  };
  const removeRow = (value, externalValue) => {
    setValuesConfigs(
      valuesConfigs.filter(
        (x) => !(x.updateName === value && x.externalValue === externalValue)
      )
    );
  };
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        modalTitleStyle={classes.modalTitle}
        withRoundedCloseIcon={false}
        insideStyle={classes.insideStyle}
      >
        <div className="custom-scrollbar" style={classes.scrollContainer}>
          {(parameter.parameterType === EParameterTypes.INPUT_TEXT ||
            parameter.parameterType === EParameterTypes.INPUT_NUMBER) && (
            <div
              onClick={addEmptyValue}
              style={classes.addButtonContainer}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--theme-bg-tertiary, rgba(0, 0, 0, 0.04))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <PlusNewIcon />
              <span
                style={{
                  marginLeft: 8,
                  ...FONT_FAMILY.Inter(500, 16),
                  color: `var(--theme-primary-color, ${primaryColor(500)})`,
                }}
              >
                {t("materials.buttons.add")}
              </span>
            </div>
          )}
          <Stack direction="column" spacing={1} width="100%">
            {valuesConfigs.map((item, index) => (
              <div
                key={isMaterial || isSwitch ? item?.valueId : item?.id}
                style={classes.rowContainer}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  width="100%"
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  {parameter.parameterType === EParameterTypes.INPUT_TEXT ||
                  parameter.parameterType === EParameterTypes.INPUT_NUMBER ? (
                    <GomakeTextInput
                      style={{ flex: 1, minWidth: 0 }}
                      placeholder={t("products.profits.exceptions.enterValue")}
                      onChange={(e) =>
                        changeItems(index, "updateName", e.target.value)
                      }
                      defaultValue={item?.updateName}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: FONT_FAMILY.Inter(500, 14).fontFamily,
                        fontWeight: FONT_FAMILY.Inter(500, 14).fontWeight,
                        fontSize: FONT_FAMILY.Inter(500, 14).fontSize,
                        color: "var(--theme-text-primary, #000000)",
                        flex: 1,
                      }}
                    >
                      {isMaterial || isSwitch ? item?.value : item?.updateName}
                    </span>
                  )}

                  <GomakeTextInput
                    style={{ flex: 1, minWidth: 0 }}
                    placeholder={t(
                      "products.profits.exceptions.enterExternalCode"
                    )}
                    onChange={(e) =>
                      changeItems(index, "externalValue", e.target.value)
                    }
                    defaultValue={item?.externalValue || ""}
                  />
                </Stack>
                {(parameter.parameterType === EParameterTypes.INPUT_TEXT ||
                  parameter.parameterType === EParameterTypes.INPUT_NUMBER) && (
                  <div
                    onClick={() =>
                      removeRow(item?.updateName, item?.externalValue)
                    }
                    style={classes.deleteButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--theme-error-bg-hover, rgba(172, 21, 21, 0.1))";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <DeleteIcon
                      color="var(--theme-error-color, #ac1515)"
                      width={20}
                      height={20}
                    />
                  </div>
                )}
              </div>
            ))}
          </Stack>
        </div>
        <div style={classes.updateBtn}>
          <PrimaryButton
            variant="contained"
            onClick={() => setOpenUpdateModal(true)}
          >
            {t("modal.update")}
          </PrimaryButton>
        </div>
      </GoMakeModal>
      <UpdateParameterModal
        openModal={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        selectedUpdateType={selectedUpdateType}
        setSelectedUpdateType={setSelectedUpdateType}
        onUpdate={handleUpdate}
        hideDoNotAskBox={true}
        showThirdOption={true}
      />
    </>
  );
};

export { ExternalValuesIdModal };
