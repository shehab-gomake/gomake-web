import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { AddPlusIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { DeleteMenuIcon } from "@/widgets/quote/more-circle/icons/delete-menu";
import { useAddRuleModal } from "./use-add-rule-modal";
import { ETypeException, EValueType } from "../../enums/profites-enum";
import { useEffect, useState } from "react";
import { selectedOutputsProps, selectedParametersProps } from "../../interface";
import { EParameterTypes } from "@/enums";
import { useRouter } from "next/router";

const AddRuleModal = ({
  openModal,
  onCloseModal,
  typeExceptionSelected,
  selectedPricingBy,
  actionProfitByActionId,
  getProfitsPricingTables,
  selectedPricingTableItems,
  isPropertiesWidge,
  selectedProperties,
  getProperitesService,
}: any) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    rules,
    machincesList,
    allMachincesList,
    productsStateValue,
    clientTypesStateValue,
    parametersStateValue,
    Outputs,
    materialsTypes,
    machines,
    clients,
    expression,
    mainconditions,
    categories,
    conditions,
    create,
    createProperties,
    setPropertieValue,
    setAdditionalProfit,
    deleteRule,
    handleChange,
    addRule,
  } = useAddRuleModal({
    typeExceptionSelected,
    selectedPricingBy,
    actionProfitByActionId,
    onCloseModal,
    getProfitsPricingTables,
    selectedPricingTableItems,
    selectedProperties,
    getProperitesService,
  });
  const [selectedCategories, setSelectedCategories] = useState<any>("")
  const [selectedStatment2, setSelectedStatment2] = useState<any>("")
  console.log("selectedCategories", selectedCategories)
  const router = useRouter();
  const [selectedOutputs, setSelectedOutputs] =
    useState<selectedOutputsProps>();
  const [selectedParameters, setSelectedParameters] =
    useState<selectedParametersProps>();
  useEffect(() => {
    const selectedOutputs = Outputs?.find(
      (output) => output?.id === selectedProperties?.propertyId
    );
    const selectedParameters = parametersStateValue?.find(
      (parameter) => parameter?.id === selectedProperties?.propertyId
    );
    setSelectedOutputs(selectedOutputs);
    setSelectedParameters(selectedParameters);
  }, [selectedProperties, Outputs, parametersStateValue]);

  const _renderInptsForProperties = () => {
    if (selectedProperties?.ruleType === 0) {
      switch (selectedOutputs?.valueType) {
        case EValueType.MACHINE:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectMachine")}
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GoMakeAutoComplate
                options={
                  router.query.actionId
                    ? machincesList?.machines?.map((value) => {
                      return {
                        ...value,
                        label: value?.machineName,
                        id: value.machineId,
                      };
                    })
                    : allMachincesList?.map((value) => {
                      return {
                        ...value,
                        label: value?.name,
                        id: value.id,
                      };
                    })
                }
                style={clasess.dropDownListContainer}
                placeholder={t("products.profits.exceptions.selectMachine")}
                onChange={(e, value) => {
                  console.log("value", value)
                  setPropertieValue(value?.id)

                }
                }
              />
            </div>
          );
        case EValueType.MATERIAL:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                Select Material
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GoMakeAutoComplate
                options={materialsTypes?.map((value) => {
                  return {
                    ...value,
                    label: value.materialTypeName,
                    id: value.materialTypeKey,
                  };
                })}
                placeholder={"Select Material"}
                style={clasess.autoComplateStyle}
                onChange={(e: any, value: any) => {
                  setPropertieValue(value?.id as string);
                }}
              />
            </div>
          );
        case EValueType.INPUTNUMBER:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.enterValue")}
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GomakeTextInput
                placeholder={t("products.profits.exceptions.enterValue")}
                onChange={(e: any) => {
                  setPropertieValue(e.target.value);
                }}
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                  height: 40,
                }}
              />
            </div>
          );
        case EValueType.INPUTTEXT:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.enterValue")}
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GomakeTextInput
                placeholder={t("products.profits.exceptions.enterValue")}
                onChange={(e: any) => {
                  setPropertieValue(e.target.value);
                }}
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                  height: 40,
                }}
              />
            </div>
          );
        case EValueType.BOOLEAN:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectValue")}
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GoMakeAutoComplate
                options={[
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" },
                ]}
                placeholder={t("products.profits.exceptions.selectValue")}
                style={clasess.autoComplateStyle}
                onChange={(e: any, value: any) => {
                  console.log("value", value)
                  setPropertieValue(value?.value as string);
                }}
              />
            </div>
          );
      }
    } else {
      switch (selectedParameters?.type) {
        case EParameterTypes.DROP_DOWN_LIST:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectValue")}
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GoMakeAutoComplate
                options={selectedParameters?.values?.map((value) => {
                  return {
                    ...value,
                    label: value.name,
                    id: value.id,
                  };
                })}
                style={clasess.dropDownListContainer}
                placeholder={t("products.profits.exceptions.selectValue")}
                onChange={(e, value) => setPropertieValue(value?.id)}
              />
            </div>
          );
        case EParameterTypes.INPUT_NUMBER:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.enterValue")}
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GomakeTextInput
                placeholder={t("products.profits.exceptions.enterValue")}
                onChange={(e: any) => {
                  setPropertieValue(e.target.value);
                }}
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                  height: 40,
                }}
              />
            </div>
          );
        case EParameterTypes.INPUT_TEXT:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.enterValue")}
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GomakeTextInput
                placeholder={t("products.profits.exceptions.enterValue")}
                onChange={(e: any) => {
                  setPropertieValue(e.target.value);
                }}
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                  height: 40,
                }}
              />
            </div>
          );
        case EParameterTypes.SWITCH:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectValue")}
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GoMakeAutoComplate
                options={[
                  { label: "Yes", value: "true" },
                  { label: "No", value: "false" },
                ]}
                placeholder={t("products.profits.exceptions.selectValue")}
                style={clasess.autoComplateStyle}
                onChange={(e: any, value: any) => {
                  setPropertieValue(value?.value as string);
                }}
              />
            </div>
          );
      }
    }
  };
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={
          isPropertiesWidge
            ? t("products.profits.exceptions.addNewRule") +
            " (" +
            selectedProperties?.propertyName +
            ")"
            : t("products.profits.exceptions.addNewRule")
        }
        onClose={() => {
          onCloseModal();
        }}
        insideStyle={clasess.insideStyle}
      >
        <div>
          {rules.map((rule, index) => {
            return (
              <>
                {index != 0 && (
                  <div
                    style={{
                      display: "block",
                      marginTop: 15,
                      marginBottom: 15,
                    }}
                  >
                    <label style={clasess.inputLable}>
                      {t("properties.condtionBetween")}
                    </label>
                    <GoMakeAutoComplate
                      options={mainconditions}
                      style={clasess.dropDownListContainer}
                      placeholder={t("properties.condtion")}
                      value={rule.linkCondition}
                      onChange={(event, value) => {
                        handleChange(index, "linkCondition", value);
                      }}
                    />
                  </div>
                )}
                <div key={index} style={clasess.inputsContainer}>
                  <div style={{ marginTop: "2%", fontSize: 16, height: "100%" }}> if</div>
                  <div>
                    <label style={clasess.inputLable}>
                      {t("properties.category")}
                    </label>
                    <GoMakeAutoComplate
                      options={categories}
                      style={clasess.dropDownListContainer}
                      placeholder={t("properties.category")}
                      value={rule.category}
                      onChange={(e, value) => {
                        handleChange(index, "category", value);
                        handleChange(index, "statement2", null);
                        handleChange(index, "condition", null);
                        handleChange(index, "statement", null);
                        setSelectedCategories(value)


                      }}
                    />
                  </div>
                  {rule.category?.id != "Machine" &&
                    rule.category?.id != "Client Type" &&
                    rule.category?.id != "Products" && (
                      <>
                        {rule.category?.id === "Property input" && (
                          <div>
                            <label style={clasess.inputLable}>
                              {t("properties.statment")}
                            </label>
                            <GoMakeAutoComplate
                              options={parametersStateValue?.map((value) => {
                                return {
                                  ...value,
                                  label: value.name,
                                  id: value.id,
                                };
                              })}
                              style={clasess.dropDownListContainer}
                              placeholder={t("properties.statment")}
                              // getOptionLabel={(value: any) => value?.name}
                              value={rule.statement2}
                              onChange={(e, value) => {
                                handleChange(index, "statement2", value);
                                handleChange(index, "condition", null);
                                handleChange(index, "statement", null);
                                setSelectedStatment2(value)
                              }

                              }
                            />
                          </div>
                        )}
                        {rule.category?.id === "Property output" && (
                          <div>
                            <label style={clasess.inputLable}>
                              {t("properties.statment")}
                            </label>
                            <GoMakeAutoComplate
                              options={Outputs?.map((value) => {
                                return {
                                  ...value,
                                  label: value.name,
                                  id: value.id,
                                };
                              })}
                              style={clasess.dropDownListContainer}
                              placeholder={t("properties.statment")}
                              // getOptionLabel={(value: any) => value?.name}
                              value={rule.statement2}
                              onChange={(e, value) => {
                                handleChange(index, "statement2", value)
                                handleChange(index, "condition", null);
                                handleChange(index, "statement", null);
                                setSelectedStatment2(value)
                              }
                              }
                            />
                          </div>
                        )}
                      </>
                    )}

                  <div>
                    <label style={clasess.inputLable}>
                      {t("properties.condtion")}
                    </label>
                    <GoMakeAutoComplate
                      key={selectedCategories?.id + index + selectedStatment2?.id}
                      options={conditions}
                      style={clasess.dropDownListContainer}
                      placeholder={t("properties.condtion")}
                      // value={rule.condition}
                      onChange={(event, value) => {
                        handleChange(index, "condition", value);
                      }}
                    />
                  </div>
                  {rule.category?.id === "Machine" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>
                      <GoMakeAutoComplate
                        options={
                          router.query.actionId
                            ? machines?.map((value) => {
                              return {
                                ...value,
                                label: value?.name,
                                id: value.id,
                              };
                            })
                            : allMachincesList?.map((value) => {
                              return {
                                ...value,
                                label: value?.name,
                                id: value.id,
                              };
                            })
                        }
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value)
                          handleChange(index, "statement", null);
                        }
                        }
                      />
                    </div>
                  )}
                  {rule.category?.id === "Client" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>
                      <GoMakeAutoComplate
                        options={clients?.map((value) => {
                          return {
                            ...value,
                            label: value?.name,
                            id: value.id,
                          };
                        })}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value)
                          handleChange(index, "statement", null);
                        }
                        }
                      />
                    </div>
                  )}
                  {rule.category?.id === "Property output" &&
                    rules[index]?.statement2?.valueType === 1 && (
                      <div>
                        <label style={clasess.inputLable}>
                          {t("properties.statment")}
                        </label>
                        <GoMakeAutoComplate
                          key={selectedCategories?.id + index + selectedStatment2?.id}
                          options={
                            router.query.actionId
                              ? machines?.map((value) => {
                                return {
                                  ...value,
                                  label: value?.name,
                                  id: value.id,
                                };
                              })
                              : allMachincesList?.map((value) => {
                                return {
                                  ...value,
                                  label: value?.name,
                                  id: value.id,
                                };
                              })
                          }
                          style={clasess.dropDownListContainer}
                          placeholder={t("properties.statment")}
                          value={rule.statement}
                          onChange={(e, value) =>
                            handleChange(index, "statement", value)
                          }
                        />
                      </div>
                    )}
                  {rule.category?.id === "Property output" &&
                    rules[index]?.statement2?.valueType === 3 && (
                      <div>
                        <label style={clasess.inputLable}>
                          {t("properties.statment")}
                        </label>
                        <GomakeTextInput
                          key={selectedCategories?.id + index + selectedStatment2?.id}
                          style={clasess.textInputContainer}
                          placeholder={t("properties.statment")}
                          value={rule.statement}
                          onChange={(e) =>
                            handleChange(index, "statement", e.target.value)
                          }
                        />
                      </div>
                    )}
                  {rule.category?.id === "Products" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>

                      <GoMakeAutoComplate
                        options={productsStateValue
                          ?.filter((item) => item.name !== null)
                          .map((value) => {
                            return {
                              ...value,
                              label: value?.name,
                              id: value.id,
                            };
                          })}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value)
                          handleChange(index, "statement", null);
                        }
                        }
                      />
                    </div>
                  )}
                  {rule.category?.id === "Client Type" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>
                      <GoMakeAutoComplate
                        options={clientTypesStateValue?.map((value) => {
                          return {
                            ...value,
                            label: value?.name,
                            id: value.id,
                          };
                        })}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value)
                          handleChange(index, "statement", null);
                        }
                        }
                      />
                    </div>
                  )}
                  {rule.category?.id === "Property input" && (
                    <>
                      {rules[index]?.statement2?.type === 0 ? (
                        <div>
                          <label style={clasess.inputLable}>
                            {t("properties.statment")}
                          </label>
                          <GoMakeAutoComplate
                            key={selectedCategories?.id + index + selectedStatment2?.id}
                            options={rules[index]?.statement2?.values?.map(
                              (value) => {
                                return {
                                  ...value,
                                  label: value?.name,
                                  id: value.id,
                                };
                              }
                            )}
                            style={clasess.dropDownListContainer}
                            placeholder={t("properties.statment")}
                            value={rule.statement}
                            onChange={(e, value) =>
                              handleChange(index, "statement", value)
                            }
                          />
                        </div>
                      ) : (
                        <div>
                          <label style={clasess.inputLable}>
                            {t("properties.statment")}
                          </label>
                          <GomakeTextInput
                            key={selectedCategories?.id + index + selectedStatment2?.id}
                            style={clasess.textInputContainer}
                            placeholder={t("properties.statment")}
                            onChange={(e) =>
                              handleChange(index, "statement", e.target.value)
                            }
                          />
                        </div>
                      )}
                    </>
                  )}
                  {rules.length > 1 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        marginTop: "2%",
                      }}
                      onClick={() => deleteRule(index)}
                    >
                      <DeleteMenuIcon />
                    </div>
                  )}
                </div>
              </>
            );
          })}
          <div style={clasess.AddNewRuleDiv}>
            <AddPlusIcon />{" "}
            <span onClick={addRule} style={clasess.spanAddNewRule}>
              {t("properties.addNewRule")}
            </span>
          </div>
          {typeExceptionSelected === ETypeException.ADDITIONAL && (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.additionalProfit")}
              </div>
              <GomakeTextInput
                type="number"
                placeholder={t("products.profits.exceptions.additionalProfit")}
                onChange={(e: any) => {
                  setAdditionalProfit(e.target.value);
                }}
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                  height: 40,
                }}
              />
            </div>
          )}

          {isPropertiesWidge && _renderInptsForProperties()}

          <div style={clasess.btnContainer}>
            <GomakePrimaryButton
              style={clasess.sendBtn}
              onClick={() => {
                isPropertiesWidge ? createProperties() : create();
              }}
            >
              {t("properties.create")}
            </GomakePrimaryButton>
          </div>
          <div>
            <div>
              <label
                style={{
                  ...FONT_FAMILY.Lexend(500, 12),
                  // color: primaryColor(500),
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >{t("products.profits.exceptions.terminal")}</label>
              <textarea
                disabled={true}
                style={clasess.textarea}
                placeholder={t("products.profits.exceptions.willViewed")}
                value={expression}
              />
            </div>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};

export { AddRuleModal };