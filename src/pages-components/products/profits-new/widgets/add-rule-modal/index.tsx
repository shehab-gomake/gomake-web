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
import { ETypeException } from "../../enums/profites-enum";

const AddRuleModal = ({
  openModal,
  onCloseModal,
  typeExceptionSelected,
  selectedPricingBy,
  actionProfitByActionId,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    rules,
    deleteRule,
    handleChange,
    addRule,
    machincesStateValue,
    productsStateValue,
    clientTypesStateValue,
    parametersStateValue,
    Outputs,
    setAdditionalProfit,
    clients,

    expression,
    mainconditions,
    categories,
    conditions,
    create,
  } = useAddRuleModal({
    typeExceptionSelected,
    selectedPricingBy,
    actionProfitByActionId,
  });
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.profits.exceptions.addNewRule")}
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
                  <div style={{ marginTop: "2%", fontSize: 16 }}> if</div>
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
                              onChange={(e, value) =>
                                handleChange(index, "statement2", value)
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
                              onChange={(e, value) =>
                                handleChange(index, "statement2", value)
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
                      options={conditions}
                      style={clasess.dropDownListContainer}
                      placeholder={t("properties.condtion")}
                      value={rule.condition}
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
                        options={machincesStateValue?.map((value) => {
                          return {
                            ...value,
                            label: `${value?.manufacturer} ${value?.model}`,
                            id: value.id,
                          };
                        })}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) =>
                          handleChange(index, "statement2", value)
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
                        onChange={(e, value) =>
                          handleChange(index, "statement2", value)
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
                          options={machincesStateValue?.map((value) => {
                            return {
                              ...value,
                              label: `${value?.manufacturer} ${value?.model}`,
                              id: value.id,
                            };
                          })}
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
                        options={productsStateValue?.map((value) => {
                          return {
                            ...value,
                            label: value?.name,
                            id: value.id,
                          };
                        })}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        // getOptionLabel={(value: any) => value?.name}
                        value={rule.statement2}
                        onChange={(e, value) =>
                          handleChange(index, "statement2", value)
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
                        onChange={(e, value) =>
                          handleChange(index, "statement2", value)
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

          <div style={clasess.btnContainer}>
            <GomakePrimaryButton
              style={clasess.sendBtn}
              onClick={() => {
                create();
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
              >
                Terminal
              </label>
              <textarea
                disabled={true}
                style={clasess.textarea}
                placeholder="Your rules will viewed here . . ."
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
