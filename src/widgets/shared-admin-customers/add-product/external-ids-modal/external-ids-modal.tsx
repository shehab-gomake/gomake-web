import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "./style";

const ExternalValuesIdModal = ({ openModal, onClose, selectedParameter }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const modalTitle = `${selectedParameter?.name} values`;

  const [valuesConfigs, setValuesConfigs] = useState(
    selectedParameter?.valuesConfigs || []
  );

  useEffect(() => {
    if (selectedParameter?.valuesConfigs) {
      setValuesConfigs([...selectedParameter.valuesConfigs]);
    }
  }, [selectedParameter]);

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
      ({ id, externalId, updateName }) => ({
        valueId: id,
        valueName: updateName,
        externalId,
      })
    );
    console.log("Updated Values Configs:", updatedList, valuesConfigs);
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
              {item?.updateName}
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
