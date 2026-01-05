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
    if (valuesConfigs && valuesConfigs.length > 0 && valuesConfigs.find(x => !x.updateName)) {
      alertFault("there is a empty row")
      return;
    }
    setValuesConfigs([...valuesConfigs, { updateName: "" }])
  }
  const removeRow = (value, externalValue) => {
    setValuesConfigs(valuesConfigs.filter(x => !(x.updateName === value && x.externalValue === externalValue)))
  }
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
        <div
          className="custom-scrollbar"
          style={{
            height: 330,
            overflow: "scroll",
            padding: "0px 10px",
            width: "100%",
          }}
        >
          {
            parameter.parameterType === EParameterTypes.INPUT_TEXT || parameter.parameterType === EParameterTypes.INPUT_NUMBER ?
              <div onClick={addEmptyValue}><PlusNewIcon></PlusNewIcon></div>
              : <div></div>
          }
          {valuesConfigs.map((item, index) => (
            <div
              key={isMaterial || isSwitch ? item?.valueId : item?.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {
                parameter.parameterType === EParameterTypes.INPUT_TEXT || parameter.parameterType === EParameterTypes.INPUT_NUMBER ?
                  <GomakeTextInput
                    style={{ width: "90%" }}
                    placeholder={t("products.profits.exceptions.enterValue")}
                    onChange={(e) =>
                      changeItems(index, "updateName", e.target.value)
                    }
                    defaultValue={item?.updateName}
                  /> :
                  <span>
                    {isMaterial || isSwitch ? item?.value : item?.updateName}
                  </span>
              }

              <GomakeTextInput
                style={{ width: "90%" }}
                placeholder={t("products.profits.exceptions.enterExternalCode")}
                onChange={(e) =>
                  changeItems(index, "externalValue", e.target.value)
                }
                defaultValue={item?.externalValue || ""}
              />
              {
                parameter.parameterType === EParameterTypes.INPUT_TEXT || parameter.parameterType === EParameterTypes.INPUT_NUMBER ?
                  <div onClick={() => removeRow(item?.updateName, item?.externalValue)}>
                    <DeleteIcon
                      color={'#ac1515'}
                      width={20}
                      height={20}>

                    </DeleteIcon>
                  </div>
                  : <div></div>
              }
            </div>
          ))}
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
