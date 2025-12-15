import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
  GoMakeDeleteModal,
} from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { AddPlusIcon, SettingNavBar } from "@/icons";
import { IconButton } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { useAddRuleModal } from "./use-add-rule-modal";
import { ETypeException, EValueType } from "../../enums/profites-enum";
import { useEffect, useState } from "react";
import { selectedOutputsProps, selectedParametersProps } from "../../interface";
import { DocumentTypeEnums, EAdditionType, EParameterTypes, ModalType } from "@/enums";
import { useRouter } from "next/router";
import { DeleteMenuIcon } from "@/widgets/quote-new/more-circle/icons/delete-menu";
import { ScheduleSendWidget } from "@/pages-components/quotes/widgets/schedule-send-widget/schedule-send-widget";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { getHotFolderNames } from "@/services/api-service/files-api-settings/files-api-settings-endpoint";
import { useGomakeAxios } from "@/hooks";
import { OsSettingsIcon } from "@/icons";

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
  isQuoteWidge = false,
  filterData,
  onCreate,
  isHotFolderWidget,
  getProductHotFolderRules,
  documentType,
  onShowScheduledReports,
  createScheduledReport,
  filterDTO,
  boardMissionTableFilterDTO,
  availableDateFilters = [],
  parametersStateValue,
  pricingTableConditionProperties,
  duplicateRule,
}: any) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();

  const [selectedCategories, setSelectedCategories] = useState<any>("");
  const [selectedStatment2, setSelectedStatment2] = useState<any>("");
  const [openScheduleOrDownloadModal, setOpenScheduleOrDownloadModal] = useState(false);
  const [detailsOption, setDetailsOption] = useState<{ label: string; id: number } | null>({
    label: t("products.profits.exceptions.withoutDetails"),
    id: 2,
  });

  useEffect(() => {
    setDetailsOption({ label: t("products.profits.exceptions.withoutDetails"), id: 2 });
  }, []);

  const isInvoice = documentType === 3; // 3 = invoice (based on DOCUMENT_TYPE enum: quote=0, order=1, deliveryNote=2, invoice=3)
  const isDeliveryNote = documentType === 2; // 2 = deliveryNote
  const {
    rules,
    propertieValue,
    machincesList,
    allMachincesList,
    productsStateValue,
    clientTypesStateValue,
    Outputs,
    materialsTypes,
    expression,
    mainconditions,
    categories,
    conditions,
    GroupByOptions,
    agentsCategories,
    create,
    createProperties,
    setPropertieValue,
    setAdditionalProfit,
    deleteRule,
    handleChange,
    addRule,
    createForQuoteWidget,
    createForHotFolderWidget,
    setRules,
    initialRule,
    openScheduleModal,
    onCloseScheduleModal,
    onOpenScheduleModal,
    renderOptions,
    checkWhatRenderArray,
    onSelectDeliveryTimeDates,
    fromDate,
    toDate,
    mappingRules,
    categoriesList,
    employeeList,
    allProductTypes,
    actionEmployeeList,
    isFetching,
    getConditionText,
    setAdditionType,
    hotFolderNames,
    fetchHotFolderNames,
  } = useAddRuleModal({
    typeExceptionSelected,
    selectedPricingBy,
    actionProfitByActionId,
    onCloseModal,
    getProfitsPricingTables,
    selectedPricingTableItems,
    selectedProperties,
    getProperitesService,
    isQuoteWidge,
    filterData,
    openModal,
    getProductHotFolderRules,
    documentType,
    detailsOption,
    pricingTableConditionProperties,
    duplicateRule,
    parametersStateValue,
  });

  // Update selectedCategories and selectedStatment2 only once when modal opens with duplicateRule
  useEffect(() => {
    if (duplicateRule && openModal && rules && rules.length > 0 && rules[0]?.category) {
      setSelectedCategories(rules[0].category);
      if (rules[0]?.statement2) {
        setSelectedStatment2(rules[0].statement2);
      }
    }
  }, [openModal, duplicateRule]); // Only depend on openModal and duplicateRule, not rules

  // Fetch hot folder names when modal opens
  useEffect(() => {
    if (openModal && isHotFolderWidget) {
      fetchHotFolderNames();
    }
  }, [openModal, isHotFolderWidget, fetchHotFolderNames]);

  const [selectedProfitModel, setSelectedProfitModel] = useState<number>(null);
  const router = useRouter();

  // Get available date filters based on document type
  const getAvailableDateFilters = () => {
    // If availableDateFilters is passed as prop, use it
    if (availableDateFilters && availableDateFilters.length > 0) {
      return availableDateFilters;
    }

    const baseFilters = [
      { label: t("sales.list.creationDate"), value: "creationDate" },
    ];

    switch (documentType) {
      case "order":
        return [
          ...baseFilters,
          { label: t("sales.list.dueDate"), value: "dueDate" },
          { label: t("sales.list.readyDate"), value: "readyDate" },
        ];
      case "job":
        return [
          ...baseFilters,
          { label: t("sales.list.dueDate"), value: "dueDate" },
          { label: t("sales.list.readyDate"), value: "readyDate" },
        ];
      default:
        return baseFilters;
    }
  };
  console.log("rules", rules);
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
                        label: `${value?.nickName}`,
                        id: value.id,
                      };
                    })
                }
                style={clasess.dropDownListContainer}
                placeholder={t("products.profits.exceptions.selectMachine")}
                onChange={(e, value) => {
                  setPropertieValue(value?.id);
                }}
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
                  { label: t("modal.yes"), value: "true" },
                  { label: t("modal.no"), value: "false" },
                ]}
                placeholder={t("products.profits.exceptions.selectValue")}
                style={clasess.autoComplateStyle}
                onChange={(e: any, value: any) => {
                  setPropertieValue(value?.value as string);
                }}
              />
            </div>
          );
        case EValueType.EMPLOYEE:
          return (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectEmployee")}
                <span style={clasess.spanUnitStyle}>
                  {selectedOutputs?.defaultUnit}
                </span>
              </div>
              <GoMakeAutoComplate
                options={actionEmployeeList}
                style={clasess.dropDownListContainer}
                placeholder={t("products.profits.exceptions.selectEmployee")}
                onChange={(e, value) => {
                  setPropertieValue(value?.id);
                }}
              />
            </div>
          );
      }
    }
    else {
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
                  { label: t("modal.yes"), value: "true" },
                  { label: t("modal.no"), value: "false" },
                ]}
                placeholder={t("products.profits.exceptions.selectValue")}
                style={clasess.autoComplateStyle}
                onChange={(e: any, value: any) => {
                  setPropertieValue(value?.value as string);
                }}
              />
            </div>
          );
        case EParameterTypes.SELECT_MATERIALS:
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
      }
    }
  };

  const _renderInptsForQuotes = () => {
    // Check document type


    // For invoices, show the 4 extended export options
    if (isInvoice) {
      return (
        <div style={clasess.inputsForQuotesContainer}>
          <div>
            <div style={clasess.selectTypeStyle}>
              {t("products.profits.exceptions.detailsOption")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: t("products.profits.exceptions.withoutDetails"), id: 2 },
                { label: t("sales.list.exportExtendedTableExcel"), id: 3 }, // ExtendedExcel
                { label: t("sales.list.exportExtendedTableTxt"), id: 4 }, // ExtendedTxt
                { label: t("sales.list.exportSummeryExcelWithoutVat"), id: 5 }, // SummeryExcelWithoutVat
                { label: t("sales.list.exportSummeryExcelWithVat"), id: 6 }, // SummeryExcelWithVat

              ]}
              style={clasess.dropDownListContainer}
              placeholder={t("products.profits.exceptions.selectDetailsOption")}
              onChange={(e, value) => {
                setDetailsOption({ label: value?.label, id: value?.id });
              }}
              value={detailsOption}
            />
          </div>
        </div>
      );
    }

    // For delivery notes, only show "Without Details"
    if (isDeliveryNote) {
      return (
        <div style={clasess.inputsForQuotesContainer}>
          <div>
            <div style={clasess.selectTypeStyle}>
              {t("products.profits.exceptions.detailsOption")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: t("products.profits.exceptions.withoutDetails"), id: 2 }, // withoutDetails = 2
              ]}
              style={clasess.dropDownListContainer}
              placeholder={t("products.profits.exceptions.selectDetailsOption")}
              onChange={(e, value) => {
                setDetailsOption({ label: value?.label, id: value?.id });
                setPropertieValue(null);
              }}
              value={detailsOption}
            />
          </div>
        </div>
      );
    }

    // For quotes, orders, and other documents, show with/without details options
    return (
      <div style={clasess.inputsForQuotesContainer}>
        <div>
          <div style={clasess.selectTypeStyle}>
            {t("products.profits.exceptions.detailsOption")}
          </div>
          <GoMakeAutoComplate
            options={[
              { label: t("products.profits.exceptions.withDetails"), id: 1 }, // withDetails = 1
              { label: t("products.profits.exceptions.withoutDetails"), id: 2 }, // withoutDetails = 2
            ]}
            style={clasess.dropDownListContainer}
            placeholder={t("products.profits.exceptions.selectDetailsOption")}
            onChange={(e, value) => {
              setDetailsOption({ label: value?.label, id: value?.id });
              if (value?.id === 2) { // withoutDetails
                setPropertieValue(null);
              }
            }}
            value={detailsOption}
          />
        </div>
        {detailsOption && detailsOption?.id === 1 && ( // withDetails
          <div>
            <div style={clasess.selectTypeStyle}>
              {t("products.profits.exceptions.groupBy")}
            </div>
            <GoMakeAutoComplate
              options={GroupByOptions}
              style={clasess.dropDownListContainer}
              placeholder={t("products.profits.exceptions.selectGroupBy")}
              onChange={(e, value) => {
                setPropertieValue(value?.id);
              }}
            />
          </div>
        )}
      </div>
    );
  };
  const _renderInptsForHotFolder = () => {
    const handleOpenSettings = () => {
      window.open("/settings/file-api-settings", "_blank");
    };

    return (
      <div style={clasess.inputsForQuotesContainer}>
        <div>
          <div
            style={{
              ...clasess.selectTypeStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {t("products.profits.exceptions.folderName")}
            <IconButton
              onClick={handleOpenSettings}
              size="small"
              style={{
                color: "#ed028c",
                fontSize: "16px",
                padding: "4px",
                width: "20px",
                height: "20px",
              }}
              title={t("products.profits.exceptions.openFileApiSettings")}
            >
              +
            </IconButton>
          </div>
          <GoMakeAutoComplate
            options={hotFolderNames}
            getOptionLabel={(option) => option.hotFolderName || option}
            onChange={(event, value) => {
              setPropertieValue(value?.id || value || "");
            }}
            placeholder={t("products.profits.exceptions.selectFolderName")}
            style={clasess.dropDownListContainer}
            isOptionEqualToValue={(option, value) =>
              option?.id === value?.id || option === value
            }
          />
        </div>
      </div>
    );
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
          setRules([initialRule]);
          onCloseModal();
        }}
        insideStyle={clasess.insideStyle}
      >
        <div>
          {(!isInvoice && !isDeliveryNote) && rules?.map((rule, index) => {
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
                      key={`linkCondition-${index}-${openModal ? 'open' : 'closed'}`}
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
                  <div
                    style={{ marginTop: "2%", fontSize: 16, height: "100%" }}
                  >
                    {t("properties.if")}
                  </div>
                  <div>
                    <label style={clasess.inputLable}>
                      {t("properties.category")}
                    </label>
                    <GoMakeAutoComplate
                      key={`category-${index}-${rule.category?.id || 'empty'}-${openModal ? 'open' : 'closed'}`}
                      options={categories}
                      style={clasess.dropDownListContainer}
                      placeholder={t("properties.category")}
                      value={rule.category || null}
                      isOptionEqualToValue={(option, value) => {
                        if (!option || !value) return false;
                        return option.id === value.id;
                      }}
                      onChange={(e, value) => {
                        handleChange(index, "category", value);
                        handleChange(index, "statement2", null);
                        handleChange(index, "condition", null);
                        handleChange(index, "statement", null);
                        setSelectedCategories(value);
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
                              key={`statement2-property-input-${index}-${rule.category?.id || ''}-${openModal ? 'open' : 'closed'}`}
                              options={parametersStateValue?.map((value) => {
                                return {
                                  ...value,
                                  label: value.name,
                                  id: value.id,
                                };
                              })}
                              style={clasess.dropDownListContainer}
                              placeholder={t("properties.statment")}
                              value={rule.statement2}
                              onChange={(e, value) => {
                                // Check if the same option is selected
                                if (rule.statement2?.id === value?.id) {
                                  return;
                                }
                                handleChange(index, "statement2", value);
                                handleChange(index, "condition", null);
                                handleChange(index, "statement", null);
                                setSelectedStatment2(value);
                              }}
                            />
                          </div>
                        )}
                        {rule.category?.id === "Property output" && (
                          <div>
                            <label style={clasess.inputLable}>
                              {t("properties.statment")}
                            </label>
                            <GoMakeAutoComplate
                              key={`statement2-property-output-${index}-${rule.category?.id || ''}-${openModal ? 'open' : 'closed'}`}
                              options={Outputs?.map((value) => {
                                return {
                                  ...value,
                                  label: value.name,
                                  id: value.id,
                                };
                              })}
                              style={clasess.dropDownListContainer}
                              placeholder={t("properties.statment")}
                              value={rule.statement2}
                              onChange={(e, value) => {
                                // Check if the same option is selected
                                if (rule.statement2?.id === value?.id) {
                                  return;
                                }
                                handleChange(index, "statement2", value);
                                handleChange(index, "condition", null);
                                handleChange(index, "statement", null);
                                setSelectedStatment2(value);
                              }}
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
                      key={`condition-${index}-${rule.category?.id || ''}-${openModal ? 'open' : 'closed'}`}
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
                        key={`statement2-machine-${index}-${openModal ? 'open' : 'closed'}`}
                        options={
                          router.query.actionId
                            ? allMachincesList?.map((value) => {
                              return {
                                ...value,
                                label: `${value?.nickName}`,
                                id: value.id,
                              };
                            })
                            : allMachincesList?.map((value) => {
                              return {
                                ...value,
                                label: `${value?.nickName}`,
                                id: value.id,
                              };
                            })
                        }
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value);
                          handleChange(index, "statement", null);
                        }}
                      />
                    </div>
                  )}
                  {rule.category?.id === "Client" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>
                      <ClientAutocomplete
                        options={renderOptions()?.map((value) => {
                          return {
                            ...value,
                            label: value?.name,
                            id: value.id,
                          };
                        })}
                        getOptionLabel={(option: any) => `${option.name}`}
                        onChangeTextField={checkWhatRenderArray}
                        style={clasess.dropDownListContainer}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value);
                          handleChange(index, "statement", null);
                        }}
                        loading={isFetching}
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
                          key={`statement-property-output-machine-${index}-${rule.statement2?.id || ''}-${openModal ? 'open' : 'closed'}`}
                          options={
                            router.query.actionId
                              ? allMachincesList?.map((value) => {
                                return {
                                  ...value,
                                  label: `${value?.nickName}`,
                                  id: value.id,
                                };
                              })
                              : allMachincesList?.map((value) => {
                                return {
                                  ...value,
                                  label: `${value?.nickName}`,
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
                          key={
                            selectedCategories?.id +
                            index +
                            selectedStatment2?.id
                          }
                          style={clasess.textInputContainer}
                          placeholder={t("properties.statment")}
                          value={rule.statement}
                          onChange={(e) =>
                            handleChange(index, "statement", e.target.value)
                          }
                        />
                      </div>
                    )}
                  {rule.category?.id === "Property output" &&
                    rules[index]?.statement2?.valueType === 5 && (
                      <div>
                        <label style={clasess.inputLable}>
                          {t("properties.statment")}
                        </label>
                        <GoMakeAutoComplate
                          options={[
                            { label: t("modal.yes"), value: "true" },
                            { label: t("modal.no"), value: "false" },
                          ]}
                          style={clasess.dropDownListContainer}
                          placeholder={t("properties.statment")}
                          value={rule.statement}
                          onChange={(e, value) => {
                            // handleChange(index, "statement2", value);
                            handleChange(index, "statement", value);
                          }}
                        />
                        {/* <GomakeTextInput
                          key={
                            selectedCategories?.id +
                            index +
                            selectedStatment2?.id
                          }
                          style={clasess.textInputContainer}
                          placeholder={t("properties.statment")}
                          value={rule.statement}
                          onChange={(e) =>
                            handleChange(index, "statement", e.target.value)
                          }
                        /> */}
                      </div>
                    )}
                  {rule.category?.id === "Products" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>

                      <GoMakeAutoComplate
                        key={`statement2-products-${index}-${openModal ? 'open' : 'closed'}`}
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
                          handleChange(index, "statement2", value);
                          handleChange(index, "statement", null);
                        }}
                      />
                    </div>
                  )}
                  {rule.category?.id === "Agent" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>

                      <GoMakeAutoComplate
                        options={agentsCategories}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value);
                          handleChange(index, "statement", null);
                        }}
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
                          handleChange(index, "statement2", value);
                          handleChange(index, "statement", null);
                        }}
                      />
                    </div>
                  )}
                  {rule.category?.id === "Property input" && (
                    <>
                      {rules[index]?.statement2?.type === 0 ||
                        rules[index]?.statement2?.type === 5 ||
                        rules[index]?.statement2?.type === 4 ||
                        rules[index]?.statement2?.type === 10 ||
                        rules[index]?.statement2?.type === 13 ||
                        rules[index]?.statement2?.type === 11 ? (
                        <div>
                          <label style={clasess.inputLable}>
                            {t("properties.statment")}
                          </label>
                          <GoMakeAutoComplate
                            key={`statement-property-input-${index}-${rule.statement2?.id || ''}-${openModal ? 'open' : 'closed'}`}
                            options={rules[index]?.statement2?.values?.map(
                              (value) => ({
                                ...value,
                                label: value?.name,
                                id: value.id,
                              })
                            )}
                            style={clasess.dropDownListContainer}
                            placeholder={t("properties.statment")}
                            value={rule.statement}
                            onChange={(e, value) =>
                              handleChange(index, "statement", value)
                            }
                          />
                        </div>
                      ) : rules[index]?.statement2?.type === 3 ? (
                        <div>
                          <label style={clasess.inputLable}>
                            {t("properties.statment")}
                          </label>
                          <SecondSwitch
                            checked={rule.statement === "true"}
                            onChange={(e, value) => {
                              handleChange(
                                index,
                                "statement",
                                value === true ? "true" : "false"
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <label style={clasess.inputLable}>
                            {t("properties.statment")}
                          </label>
                          <GomakeTextInput
                            // key={
                            //   selectedCategories?.id +
                            //   index +
                            //   selectedStatment2?.id
                            // }
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

                  {rule.category?.id === "Machine category" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>

                      <GoMakeAutoComplate
                        options={categoriesList?.map((value) => {
                          return {
                            ...value,
                            label: value.name,
                            id: value.id,
                          };
                        })}
                        getOptionLabel={(value) => t(`${value.name}`)}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value);
                          handleChange(index, "statement", null);
                        }}
                      />
                    </div>
                  )}
                  {rule.category?.id === "MATERIALTYPE" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>

                      <GoMakeAutoComplate
                        options={materialsTypes?.map((value) => {
                          return {
                            ...value,
                            label: value.materialTypeName,
                            id: value.materialTypeKey,
                          };
                        })}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value);
                          handleChange(index, "statement", null);
                        }}
                      />
                    </div>
                  )}

                  {rule.category?.id === "Employee" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>

                      <GoMakeAutoComplate
                        options={employeeList}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value);
                          handleChange(index, "statement", null);
                        }}
                      />
                    </div>
                  )}

                  {rule.category?.id === "ProductType" && (
                    <div>
                      <label style={clasess.inputLable}>
                        {t("properties.statment")}
                      </label>

                      <GoMakeAutoComplate
                        options={allProductTypes}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={rule.statement2}
                        onChange={(e, value) => {
                          handleChange(index, "statement2", value);
                          handleChange(index, "statement", null);
                        }}
                      />
                    </div>
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
          {(!isInvoice && !isDeliveryNote) && <div style={clasess.AddNewRuleDiv}>
            <AddPlusIcon />{" "}
            <span onClick={addRule} style={clasess.spanAddNewRule}>
              {t("properties.addNewRule")}
            </span>
          </div>}
          {typeExceptionSelected === ETypeException.ADDITIONAL && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: "20%" }}>
                <div style={clasess.selectTypeStyle}>
                  {t("products.profits.exceptions.addition")}
                </div>
                <GomakeTextInput
                  type="number"
                  placeholder={t("products.profits.exceptions.addition")}
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
              <div style={{ width: "20%" }}>
                <div style={clasess.selectTypeStyle}>
                  {t("products.profits.exceptions.additionType")}
                </div>
                <GoMakeAutoComplate
                  options={[
                    {
                      label: t("products.profits.exceptions.percents"),
                      value: EAdditionType.Percentage,
                    },
                    {
                      label: t("products.profits.exceptions.valuePerUnit"),
                      value: EAdditionType.ValuePerUnit,
                    },
                    {
                      label: t("products.profits.exceptions.valuePerJob"),
                      value: EAdditionType.ValuePerJob,
                    },
                  ]}
                  placeholder={t("products.profits.exceptions.additionType")}
                  style={clasess.autoComplateStyle}
                  onChange={(e: any, value: any) => {
                    setAdditionType(value?.value);
                  }}
                />
              </div>
            </div>
          )}
          {typeExceptionSelected === ETypeException.PROFIT && (
            <div style={{ width: "20%" }}>
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.additionalProfit")}
              </div>
              <GoMakeAutoComplate
                options={[
                  { label: "Action", value: 0 },
                  { label: "Product", value: 1 },
                ]}
                placeholder={t("products.profits.exceptions.selectValue")}
                style={clasess.autoComplateStyle}
                onChange={(e: any, value: any) => {
                  setSelectedProfitModel(value?.value);
                }}
              />
            </div>
          )}

          {isPropertiesWidge && _renderInptsForProperties()}
          {isQuoteWidge && _renderInptsForQuotes()}

          {isHotFolderWidget && _renderInptsForHotFolder()}

          <div style={clasess.btnContainer}>
            {isQuoteWidge && (
              <>
                {/* <GomakePrimaryButton
                  style={clasess.sendBtn}
                  onClick={onOpenScheduleModal}
                >
                  {t("properties.scheduleSend")}
                </GomakePrimaryButton> */}
                <GomakePrimaryButton
                  style={clasess.sendBtn}
                  onClick={onShowScheduledReports}
                >
                  {t("sales.list.scheduledReports")}
                </GomakePrimaryButton>
              </>
            )}
            <GomakePrimaryButton
              style={clasess.sendBtn}
              onClick={() => {
                if (onCreate) {
                  onCreate({
                    exceptionConditionProperties: mappingRules(),
                    profitsModel: selectedProfitModel,
                    expression: expression,
                  });
                } else {
                  if (isQuoteWidge) {
                    // Open the schedule or download modal
                    setOpenScheduleOrDownloadModal(true);
                  } else if (isPropertiesWidge) {
                    createProperties();
                  } else if (isHotFolderWidget) {
                    createForHotFolderWidget();
                  } else {
                    create();
                  }
                }
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
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                {t("products.profits.exceptions.terminal")}
              </label>
              <textarea
                disabled={true}
                style={clasess.textarea}
                placeholder={t("products.profits.exceptions.willViewed")}
                value={expression}
              />
            </div>
          </div>
        </div>
        <ScheduleSendWidget
          detailsOption={detailsOption}
          openModal={openScheduleModal}
          onCloseModal={onCloseScheduleModal}
          documentType={documentType}
          availableDateFilters={availableDateFilters}
          createScheduledReport={createScheduledReport}
          filterData={filterDTO}
          boardMissionTableFilterDTO={boardMissionTableFilterDTO}
          rules={rules}
          propertieValue={propertieValue}
        />
      </GoMakeModal>

      {/* Schedule or Download Modal */}
      {isQuoteWidge && (
        <GoMakeDeleteModal
          hideIcon
          modalType={ModalType.WARNING}
          openModal={openScheduleOrDownloadModal}
          onClose={() => setOpenScheduleOrDownloadModal(false)}
          title={t("sales.list.scheduleOrDownloadTitle")}
          subTitle={t("sales.list.scheduleOrDownloadSubtitle")}
          yesBtn={t("sales.list.download")}
          cancelBtn={t("sales.list.schedule")}
          onClickDelete={() => {
            createForQuoteWidget();
            setOpenScheduleOrDownloadModal(false);
          }}
          onClickCancel={() => {
            setOpenScheduleOrDownloadModal(false);
            onOpenScheduleModal();
          }}
        />
      )}
    </>
  );
};

export { AddRuleModal };
