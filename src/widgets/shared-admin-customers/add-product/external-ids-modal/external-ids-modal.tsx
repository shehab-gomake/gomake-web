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

const ExternalValuesIdModal = ({
  openModal,
  onClose,
  parameter,
  sectionId,
  subSectionId,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
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
        value: isMaterial ? valueId : updateName,
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
          {valuesConfigs.map((item, index) => (
            <div
              key={isMaterial ? item?.valueId : item?.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>{isMaterial ? item?.value : item?.updateName}</span>
              <GomakeTextInput
                style={{ width: "50%" }}
                placeholder={t("products.profits.exceptions.enterValue")}
                onChange={(e) =>
                  changeItems(index, "externalValue", e.target.value)
                }
                defaultValue={item?.externalValue || ""}
              />
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
