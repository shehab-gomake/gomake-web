import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";

import { useStyle } from "./style";
import { useState } from "react";
import { DeleteModalIcon } from "./icons/delete-icon";
import { AddModalIcon } from "./icons/add-icon";
import { Checkbox, Divider } from "@mui/material";
import { DuplicateModalIcon } from "./icons/duplicate-icon";
import { CartWithoutBgIcon, CheckboxCheckedIcon } from "@/icons";
import { CheckboxIcon } from "@/icons";
import { quickDuplicateApi } from "@/services/api-service/generic-doc/documents-api";
import { useSnackBar } from "@/hooks";
import { useGomakeAxios } from "@/hooks";

const DuplicateQuickModal = ({
  openModal,
  onClose,
  quoteItemId,
  documentType,
  getQuote
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [groups, setGroups] = useState<any>([{ id: 1, parameters: [{ name: "", value: "" }] }]);
  const addGroup = () => {
    const newGroup = {
      id: groups.length + 1,
      parameters: [{ name: "", value: "" }]
    };
    setGroups([...groups, newGroup]);
  };

  const addParameter = (groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters.push({ name: "", value: "" });
    setGroups(newGroups);
  };
  const deleteParameter = (groupIndex, paramIndex) => { // Step 2: Add delete function
    const newGroups = [...groups];
    newGroups[groupIndex].parameters.splice(paramIndex, 1);
    setGroups(newGroups);
  };
  const deleteGroup = (groupIndex) => {
    const newGroups = groups.filter((_, index) => index !== groupIndex);
    // Reassign ids based on the new index
    const reorderedGroups = newGroups.map((group, index) => ({
      ...group,
      id: index + 1,
    }));
    setGroups(reorderedGroups);
  };
  const handleDropdownChange = (groupIndex, paramIndex, value) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters[paramIndex].name = value;
    setGroups(newGroups);
  };

  const handleTextInputChange = (groupIndex, paramIndex, value) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters[paramIndex].value = value;
    setGroups(newGroups);
  };
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

  const onClickQuickDuplicate = async () => {
    const hasEmptyParameter = groups.some(group =>
      group.parameters.some(param => param.name === "" || param.value === "")
    );

    if (hasEmptyParameter) {
      alertFaultUpdate();
      return;
    }
    const items = groups.map(group => ({
      parameters: group.parameters.map(param => ({
        parameterId: param?.name.value, // Example ID, replace with actual logic if needed
        value: param.value
      }))
    }));
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        setGroups([{ id: 1, parameters: [{ name: "", value: "" }] }])
        getQuote()
        onClose()
      } else {
        alertFaultUpdate();
      }
    };
    await quickDuplicateApi(callApi, callBack,
      { documentType: documentType, document: { documentItemId: quoteItemId, items } });
  };
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.addProduct.admin.advancedDuplicate")}
        onClose={() => {
          onClose()
          setGroups([{ id: 1, parameters: [{ name: "", value: "" }] }])
        }}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          {groups.map((group, groupIndex) => (
            <div key={group.id} style={{ width: "100%" }}>
              <div style={clasess.groupContainer}>
                <div>
                  <div style={clasess.groupTitle}>{t("products.addProduct.admin.product")}{` ${group.id}`}</div>
                </div>
                <div style={clasess.groupActions}>
                  <div onClick={addGroup} style={clasess.groupAction}>
                    <DuplicateModalIcon />
                  </div>
                  {groups.length > 1 && (
                    <div onClick={() => deleteGroup(groupIndex)} style={clasess.groupAction}>
                      <DeleteModalIcon />
                    </div>
                  )}
                </div>
              </div>
              {group.parameters.map((param, index) => (
                <div key={index} style={clasess.groupParameter}>
                  <div style={clasess.groupParameterDropdown}>
                    <div>{t("products.parameters.admin.parameter")}</div>
                    <GoMakeAutoComplate
                      key={param?.name}
                      options={[
                        { label: t("boardMissions.jobName"), value: "a330193f-492c-40a8-86f3-8edf5c8f0d5e" },
                        { label: t("boardMissions.quantity"), value: "4991945c-5e07-4773-8f11-2e3483b70b53" },
                        { label: t("machineAttributes.width"), value: "4ba9a275-4fbc-4313-b284-e9b1cf8b452e" },
                        { label: t("machineAttributes.length"), value: "d2c965d3-6b08-4380-9d4b-17c361d7e484" },
                      ]}
                      onChange={(e, value) => handleDropdownChange(groupIndex, index, value)}
                      value={param?.name}
                      style={clasess.groupParameterInput}
                      placeholder={t("products.profits.exceptions.selectParameter")}
                      withArrow={true}
                    />
                  </div>
                  <div style={clasess.groupParameterDropdown}>
                    <div>{t("documentingSettings.value")}</div>
                    <GomakeTextInput
                      style={clasess.groupParameterInput}
                      placeholder={t("products.profits.exceptions.enterValue")}
                      value={param?.value}
                      onChange={(e) => handleTextInputChange(groupIndex, index, e.target.value)}
                    />
                  </div>
                  <div style={clasess.groupParameterAddContainer}>
                    <div onClick={() => addParameter(groupIndex)} style={clasess.groupParameterAdd}>
                      <AddModalIcon />
                    </div>
                    {group.parameters.length > 1 && (
                      <div onClick={() => deleteParameter(groupIndex, index)} style={clasess.groupParameterAdd}>
                        <DeleteModalIcon width="40" height="40" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {group.id !== groups.length && <Divider style={{ marginTop: 24, }} />}
            </div>
          ))}
          <div style={clasess.checkboxContainer}>
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon fill="#2E3092" />}
            />
            <div style={clasess.checkboxLabel}>{t("products.addProduct.admin.createSameJobNumber")}</div>
          </div>
          <div style={clasess.buttonContainer} onClick={onClose}>
            <GomakePrimaryButton style={clasess.cancelButton}>
              {t("sales.quote.cancel")}
            </GomakePrimaryButton>
            <GomakePrimaryButton style={clasess.addButton} onClick={onClickQuickDuplicate}>
              <div style={clasess.addButtonContainer}>
                <CartWithoutBgIcon />
                <div style={clasess.addButtonText}>  {t("products.offsetPrice.admin.addOrderBtn")}</div>
              </div>
            </GomakePrimaryButton>
          </div>
        </div>

      </GoMakeModal >
    </>
  );
};
export { DuplicateQuickModal };
