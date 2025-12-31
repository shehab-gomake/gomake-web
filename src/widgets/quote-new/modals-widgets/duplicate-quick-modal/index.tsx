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
  console.log("quoteItem", quoteItem);
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
    lastGroupRef,
    areAllParametersUsed,
    getBookParameters,
    bookParameters,
    bookParametersValues,
    handleBookParameterValueChange,
    resetBookParameters,
  } = useDuplicateQuickModal({ getQuote, onClose, documentType, quoteItemId, quoteItem })
  console.log("bookParameters", bookParameters);
  useEffect(() => {
    if (quoteItem?.productID && openModal) {
      getProductSizes()
    }

    if (quoteItem?.isBook && openModal) {
      getBookParameters()
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

  // Render Advanced Duplicate view - all parameters in one row
  const renderAdvancedDuplicateView = () => {
    return groups.map((group, groupIndex) => (
      <div key={group.id} style={{ width: "100%" }}
        ref={groupIndex === groups.length - 1 ? lastGroupRef : null}>
        {/* <div style={clasess.groupContainer}>
          <div>
            <div style={clasess.groupTitle}>{t("products.addProduct.admin.product")}{` ${group.id}`}</div>
          </div>
        </div> */}

        {/* Single row for all parameters */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          alignItems: "flex-end",
          marginTop: "16px",
          marginBottom: "16px"
        }}>
          {/* Job Name Input */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>{t("boardMissions.jobName")}</div>
            <GomakeTextInput
              style={{ width: "100%" }}
              placeholder={t("products.profits.exceptions.enterValue")}
              value={group.parameters[0]?.value || ""}
              onChange={(e) => handleTextInputChange(groupIndex, 0, e.target.value)}
            />
          </div>

          {/* Quantity Input */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>{t("boardMissions.quantity")}</div>
            <GomakeTextInput
              style={{ width: "100%" }}
              placeholder={t("products.profits.exceptions.enterValue")}
              value={group.parameters[1]?.value || ""}
              onChange={(e) => handleTextInputChange(groupIndex, 1, e.target.value)}
              type="number"
            />
          </div>

          {/* Size Selector */}
          {productSizes?.length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: "8px" }}>{t("machineAttributes.size")}</div>
              <GoMakeAutoComplate
                options={productSizes}
                onChange={(e, value) => {
                  if (value) {
                    handleTextInputChange(groupIndex, 2, value.width, "width");
                    handleTextInputChange(groupIndex, 2, value, "value");
                    handleTextInputChange(groupIndex, 2, value.length, "length");
                  }
                }}
                value={group.parameters[2]?.value}
                getOptionLabel={(option) => option?.name}
                style={{ width: "100%" }}
                placeholder={t("products.profits.exceptions.selectParameter")}
                withArrow={true}
              />
            </div>
          )}

          {/* Width Input */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>{t("machineAttributes.width")}</div>
            <GomakeTextInput
              style={{ width: "100%" }}
              placeholder={t("products.profits.exceptions.enterValue")}
              value={group.parameters[2]?.width || ""}
              onChange={(e) => handleTextInputChange(groupIndex, 2, e.target.value, "width")}
              disabled={group.parameters[2]?.width && group.parameters[2]?.value && group.parameters[2]?.value?.width !== null}
            />
          </div>

          {/* Length Input */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>{t("machineAttributes.length")}</div>
            <GomakeTextInput
              style={{ width: "100%" }}
              placeholder={t("products.profits.exceptions.enterValue")}
              value={group.parameters[2]?.length || ""}
              onChange={(e) => handleTextInputChange(groupIndex, 2, e.target.value, "length")}
              disabled={group.parameters[2]?.length && group.parameters[2]?.value && group.parameters[2]?.value?.length !== null}
            />
          </div>
        </div>

        {/* Book Parameters Section */}
        {quoteItem?.isBook && bookParameters?.length > 0 && (
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            alignItems: "flex-end",
            marginTop: "16px",
            marginBottom: "16px",
            flexWrap: "wrap"
          }}>
            {bookParameters.map((bookParam) => (
              <div key={`${group.id}-${bookParam.productType}`} style={{
                display: "flex", flexDirection: "column", gap: "8px", width: "48%"

              }}>
                <div style={{ marginBottom: "8px" }}>{bookParam.sectionName} / {t("machineAttributes.internalPagesNumber")}</div>
                <GomakeTextInput
                  key={`${group.id}-${bookParam.productType}-input`}
                  style={{ width: "100%" }}
                  placeholder={t("products.profits.exceptions.enterValue")}
                  value={bookParametersValues[group.id]?.[bookParam.productType] || ""}
                  onChange={(e) => handleBookParameterValueChange(group.id, bookParam.productType, e.target.value)}
                  type="number"
                />
              </div>
            ))}
          </div>
        )}

        {group.id !== groups.length && <Divider style={{ marginTop: 24 }} />}

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
    ));
  };

  // Original render for Add Quantity mode - keep as is
  const renderAddQuantityView = () => {
    return groups.map((group, groupIndex) => (
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
                  !group.parameters.some((p, i) =>
                    i !== index && p.name?.value === option.value
                  )
                )}
                onChange={(e, value) => handleDropdownChange(groupIndex, index, value)}
                value={param?.name}
                style={clasess.groupParameterInput}
                placeholder={t("products.profits.exceptions.selectParameter")}
                withArrow={true}
                disabled={isAddQuantity}
              />
            </div>
            <div style={clasess.groupParameterDropdown2}>
              <div>{t("documentingSettings.value")}</div>
              <GomakeTextInput
                style={clasess.groupParameterInput2}
                placeholder={t("products.profits.exceptions.enterValue")}
                value={param?.value}
                onChange={(e) => handleTextInputChange(groupIndex, index, e.target.value)}
                type={param?.name?.value === "4991945c-5e07-4773-8f11-2e3483b70b53" ? "number" : "text"}
              />
            </div>
            <div style={clasess.groupParameterAddContainer}>
              {!isAddQuantity && !areAllParametersUsed(groupIndex) && (
                <div onClick={() => addParameter(groupIndex)} style={clasess.groupParameterAdd}>
                  <AddModalIcon />
                </div>
              )}
              {group.parameters.length > 1 && (
                <div onClick={() => deleteParameter(groupIndex, index)} style={clasess.groupParameterAdd}>
                  <DeleteModalIcon width="40" height="40" />
                </div>
              )}
            </div>
          </div>
        ))}

        {group.id !== groups.length && <Divider style={{ marginTop: 24 }} />}

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
    ));
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={isAddQuantity ? t("sales.quote.addQuantity") : t("products.addProduct.admin.advancedDuplicate")}
        onClose={() => {
          onClose()
          setGroups([{ id: 1, parameters: [{ name: "", value: "" }] }])
          resetBookParameters()
        }}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer} className={'show-scrollbar'}>
          {isAddQuantity ? renderAddQuantityView() : renderAdvancedDuplicateView()}

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
          resetBookParameters()
          onClose()
        }}>
          <GomakePrimaryButton style={clasess.cancelButton}>
            {t("sales.quote.cancel")}
          </GomakePrimaryButton>
          <GomakePrimaryButton style={clasess.addButton} onClick={onClickQuickDuplicate}>
            <div style={clasess.addButtonContainer}>
              <CartWithoutBgIcon />
              <div style={clasess.addButtonText}>{t("products.offsetPrice.admin.addOrderBtn")}</div>
            </div>
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};

export { DuplicateQuickModal };