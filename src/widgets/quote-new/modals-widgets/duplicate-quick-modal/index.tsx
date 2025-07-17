import { useTranslation } from "react-i18next";

import { Checkbox, Divider } from "@mui/material";

import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { CartWithoutBgIcon, CheckboxCheckedIcon } from "@/icons";
import { CheckboxIcon } from "@/icons";

import { useDuplicateQuickModal } from "./use-duplicate-quick-modal";
import { DuplicateModalIcon } from "./icons/duplicate-icon";
import { DeleteModalIcon } from "./icons/delete-icon";
import { AddModalIcon } from "./icons/add-icon";
import { useStyle } from "./style";
import { useEffect } from "react";

const DuplicateQuickModal = ({
  openModal,
  onClose,
  quoteItemId,
  documentType,
  getQuote,
  quoteItem,
  isAddQuantity
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    groups,
    setGroups,
    addGroup,
    addParameter,
    deleteParameter,
    deleteGroup,
    handleDropdownChange,
    handleTextInputChange,
    onClickQuickDuplicate,
    isRelatedJobs,
    setIsRelatedJobs,
    getProductSizes,
    productSizes,
    lastGroupRef
  } = useDuplicateQuickModal({ getQuote, onClose, documentType, quoteItemId, quoteItem })
  useEffect(() => {
    if (quoteItem?.productID && openModal) {
      getProductSizes()
    }

    const initialParameters = [
      {
        name: {
          label: t("boardMissions.jobName"),
          value: "a330193f-492c-40a8-86f3-8edf5c8f0d5e"
        },
        value: ""
      },
      {
        name: {
          label: t("boardMissions.quantity"),
          value: "4991945c-5e07-4773-8f11-2e3483b70b53"
        },
        value: ""
      },
      {
        name: {
          label: t("machineAttributes.size"),
          value: "e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4"
        },
        value: null,
        width: "",
        length: ""
      }
    ];

    const initialParametersForAddQuantity = [
      {
        name: {
          label: t("boardMissions.quantity"),
          value: "4991945c-5e07-4773-8f11-2e3483b70b53"
        },
        value: ""
      }
    ]

    if (openModal && quoteItem) {

      setGroups([{
        id: 1,
        parameters: isAddQuantity ? initialParametersForAddQuantity : initialParameters
      }])
    }
  }, [quoteItem, openModal, isAddQuantity])

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={isAddQuantity ? t("sales.quote.addQuantity") : t("products.addProduct.admin.advancedDuplicate")}
        onClose={() => {
          onClose()
          setGroups([{ id: 1, parameters: [{ name: "", value: "" }] }])
        }}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer} className={'show-scrollbar'}>
          {groups.map((group, groupIndex) => (
            <div key={group.id} style={{ width: "100%" }}
              ref={groupIndex === groups.length - 1 ? lastGroupRef : null}>
              <div style={clasess.groupContainer}>
                <div>
                  <div style={clasess.groupTitle}>{t("products.addProduct.admin.product")}{` ${group.id}`}</div>
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
                        { label: t("machineAttributes.size"), value: "e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4" },
                      ].filter(option =>
                        // Filter out options that are already selected in other parameters of the same group
                        !group.parameters.some((p, i) =>
                          i !== index && p.name?.value === option.value
                        )
                      )}
                      onChange={(e, value) => handleDropdownChange(groupIndex, index, value)}
                      value={param?.name}
                      style={clasess.groupParameterInput}
                      placeholder={t("products.profits.exceptions.selectParameter")}
                      withArrow={true}
                      disabled={isAddQuantity} // Add disabled prop

                    />
                  </div>
                  <div style={clasess.groupParameterDropdown2}>
                    {
                      param?.name?.value === "e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4" ?
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, width: "100%" }}>
                          {productSizes?.length > 0 && <div style={{ width: "100%" }}>
                            <div>{t("documentingSettings.value")}</div>
                            <GoMakeAutoComplate
                              options={productSizes}
                              onChange={(e, value) => {
                                if (value) {
                                  handleTextInputChange(groupIndex, index, value.width, "width");
                                  handleTextInputChange(groupIndex, index, value, "value");
                                  handleTextInputChange(groupIndex, index, value.length, "length");
                                }
                              }}
                              value={param?.value}
                              getOptionLabel={(option) => option?.name}
                              style={clasess.groupParameterInput2}
                              placeholder={t("products.profits.exceptions.selectParameter")}
                              withArrow={true}
                            />
                          </div>}
                          <div style={{ width: "100%" }}>
                            <div>{t("machineAttributes.width")}</div>
                            <GomakeTextInput
                              style={clasess.groupParameterInput2}
                              placeholder={t("products.profits.exceptions.enterValue")}
                              value={param?.width ? param?.width : ""}
                              onChange={(e) => handleTextInputChange(groupIndex, index, e.target.value, "width")}
                              disabled={param?.width && param?.value && param?.value?.width !== null ? true : false}
                            />
                          </div>
                          <div style={{ width: "100%" }}>
                            <div>{t("machineAttributes.length")}</div>
                            <GomakeTextInput
                              style={clasess.groupParameterInput2}
                              placeholder={t("products.profits.exceptions.enterValue")}
                              value={param?.length ? param?.length : ""}
                              onChange={(e) => handleTextInputChange(groupIndex, index, e.target.value, "length")}
                              disabled={param?.length && param?.value && param?.value?.length !== null ? true : false}
                            />
                          </div>
                        </div> :
                        <>
                          <div>{t("documentingSettings.value")}</div>
                          <GomakeTextInput
                            style={clasess.groupParameterInput2}
                            placeholder={t("products.profits.exceptions.enterValue")}
                            value={param?.value}
                            onChange={(e) => handleTextInputChange(groupIndex, index, e.target.value)}
                            type={param?.name?.value === "4991945c-5e07-4773-8f11-2e3483b70b53" ? "number" : "text"}
                          />
                        </>
                    }
                  </div>
                  <div style={clasess.groupParameterAddContainer}>
                    {!isAddQuantity ? <div onClick={() => addParameter(groupIndex)} style={clasess.groupParameterAdd}>
                      <AddModalIcon />
                    </div> : <div style={clasess.groupParameterAdd2} />}
                    {group.parameters.length > 1 && (
                      <div onClick={() => deleteParameter(groupIndex, index)} style={clasess.groupParameterAdd}>
                        <DeleteModalIcon width="40" height="40" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {group.id !== groups.length && <Divider style={{ marginTop: 24, }} />}
              <div style={clasess.groupActions}>
                <div onClick={() => addGroup(groupIndex)} style={clasess.groupAction}>
                  <DuplicateModalIcon />
                </div>
                {groups.length > 1 && (
                  <div onClick={() => deleteGroup(groupIndex)} style={clasess.groupAction}>
                    <DeleteModalIcon />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div style={clasess.checkboxContainer}>
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon fill="#2E3092" />}
              onChange={(e) => setIsRelatedJobs(e.target.checked)}
              value={isRelatedJobs}
            />
            <div style={clasess.checkboxLabel}>{t("products.addProduct.admin.createSameJobNumber")}</div>
          </div>

        </div>
        <div style={clasess.buttonContainer} onClick={() => {
          setGroups([{ id: 1, parameters: [{ name: "", value: "" }] }])
          onClose()
        }}>
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
      </GoMakeModal >
    </>
  );
};
export { DuplicateQuickModal };
