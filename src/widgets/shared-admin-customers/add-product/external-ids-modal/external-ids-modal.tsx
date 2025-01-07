import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "./style";
import { EParameterTypes } from "@/enums";

//!here
const ExternalValuesIdModal = ({
  openModal,
  onClose,
  parameter,
  sectionId,
  subSectionId,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  const isMaterial =
    parameter?.parameterType === EParameterTypes.SELECT_MATERIALS ||
    parameter?.parameterType === EParameterTypes.ADVERTISING_PRODUCT_CATEGORY ||
    parameter?.parameterType === EParameterTypes.ADVERTISING_PRODUCT_NAME;

  const modalTitle = `${parameter?.name} values`;

  const [valuesConfigs, setValuesConfigs] = useState(
    parameter?.valuesConfigs || []
  );

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

  const handleUpdate = () => {
    const updatedList = valuesConfigs?.map(
      ({ id, externalId, updateName, valueId }) => ({
        id,
        value: isMaterial ? valueId : updateName,
        externalCode: externalId,
      })
    );
    // console.log("Updated Values Configs:", updatedList);
    // console.log("valuesConfigs", valuesConfigs);

    //!we also need
    //parameterId :parameter?.id
    // productId: router?.query?.id,
    //updateType:
    //sectionId:sectionId
    //subSectionId:subSectionId
  };

  return (
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
        style={{ height: 330, overflow: "scroll", padding: "0px 10px" }}
      >
        {valuesConfigs.map((item, index) => (
          <div
            key={item?.id}
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <span
              style={{
                width: "120px",
                minWidth: "max-content",
              }}
            >
              {isMaterial ? item?.valueId : item?.updateName}
            </span>
            <GomakeTextInput
              style={{ width: "70%" }}
              placeholder={t("products.profits.exceptions.enterValue")}
              onChange={(e) => changeItems(index, "externalId", e.target.value)}
              defaultValue={item?.externalId || ""}
            />
          </div>
        ))}
      </div>
      <div style={classes.updateBtn}>
        <PrimaryButton variant="contained" onClick={handleUpdate}>
          {t("modal.update")}
        </PrimaryButton>
      </div>
    </GoMakeModal>
  );
};

export { ExternalValuesIdModal };
