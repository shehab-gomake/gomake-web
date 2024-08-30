import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { EWidgetProductType } from "../enums";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { useRightSideWidget } from "./use-right-side-widget";
import { useEffect, useState } from "react";
import { _renderIconLogs } from "@/utils/constants";
const RightSideWidget = ({
  clasess,
  clientDefaultValue,
  renderOptions,
  checkWhatRenderArray,
  clientTypeDefaultValue,
  clientTypesValue,
  template,
  tabs,
  activeTab,
  setUrgentOrder,
  urgentOrder,
  setPrintingNotes,
  setGraphicNotes,
  printingNotes,
  graphicNotes,
  workFlowSelected,
  widgetType,
  setPriceRecovery,
  priceRecovery,
  setSamlleType,
  includeVAT,
  setIncludeVAT,
  setBillingMethod,
  billingMethod,
  samlleType,
  graphicDesigner,
  setGraphicDesigner,
  errorMsg,
  calculationServerErrorState
}: any) => {

  const {
    currentProductItemValueTotalPrice,
    lastProductItemValueTotalPrice,
    calculationProgress,
    exampleTypeValues,
    billingMethodValues,
    listEmployeesValues,
    systemCurrency,
    isLoading,
    quantity,
    selectedWorkFlow,
    calculationExceptionsLogs,
    setCurrentProductItemValueTotalPrice,
    t,
  } = useRightSideWidget({ includeVAT });
  const mergedArray = [...(selectedWorkFlow?.exceptions || []), ...(calculationExceptionsLogs || [])];
  const [logsArray, setLogsArray] = useState(mergedArray)
  useEffect(() => {
    const uniqueArray = mergedArray.filter((item, index, self) => {
      const itemValuesArray = JSON.parse(item.values || '[]');
      const itemValuesSorted = itemValuesArray.sort().join(',');
      return index === self.findIndex(
        (t) =>
          t.actionName === item.actionName &&
          t?.exception?.exceptionKey === item?.exception?.exceptionKey &&
          t?.exception?.exceptionMessage === item?.exception?.exceptionMessage &&
          JSON.parse(t.values || '[]').sort().join(',') === itemValuesSorted
      );
    });

    if (uniqueArray) {
      setLogsArray(uniqueArray);
    }
  }, [selectedWorkFlow, calculationExceptionsLogs]);
  return (
    <div style={clasess.rightSideMainContainer}>
      <div style={clasess.rightSideContainer}>
        {/* {
          widgetType === EWidgetProductType.CREATE &&
          <div style={clasess.headerClientRightSide}>
            <div style={clasess.clientContainer}>
              <div style={clasess.labelTextStyle}>
                {t("products.offsetPrice.admin.client")}
              </div>
              {clientDefaultValue && (
                <GoMakeAutoComplate
                  options={renderOptions()}
                  placeholder={t("products.offsetPrice.admin.client")}
                  getOptionLabel={(option: any) =>
                    `${option.name}-${option.code}`
                  }
                  defaultValue={clientDefaultValue}
                  onChangeTextField={checkWhatRenderArray}
                  style={clasess.dropDownListStyle}
                />
              )}
            </div>
            <div style={clasess.typeContainer}>
              <div style={clasess.labelTextStyle}>
                {t("products.offsetPrice.admin.type")}
              </div>
              {clientTypeDefaultValue && (
                <GoMakeAutoComplate
                  options={clientTypesValue}
                  placeholder={t("products.offsetPrice.admin.type")}
                  getOptionLabel={(option: any) => option.name}
                  defaultValue={clientTypeDefaultValue}
                  style={clasess.dropDownListStyle}
                />
              )}
            </div>
          </div>
        } */}

        {template.img ? (
            <div style={clasess.imgProductContainer}>
              <img src={template.img} alt="gomake" style={{width: "100%"}}/>
            </div>
        ) : (
            <></>
        )}
        
        <div style={clasess.totalContainer}>

          <div style={clasess.totalStyleText}>
            {t("products.offsetPrice.admin.total")}
          </div>
          <div data-tour={'product-pricing'} style={clasess.totalStyle}>
            {isLoading ? (
                <DotsLoader/>
            ) : (
                <GomakeTextInput
                    value={
                        currentProductItemValueTotalPrice ?? "---------"
                    }
                    onChange={(e: any) => {
                      setCurrentProductItemValueTotalPrice(e.target.value);
                    }}
                    style={clasess.inputPriceStyle}
                    type={!selectedWorkFlow?.isCalculated ? "text" : typeof (currentProductItemValueTotalPrice) === "number" ? "number" : "text"}
                />
            )}
          </div>
          <span style={clasess.totalCurrancyStyle}>{systemCurrency}</span>
        </div>
        {calculationProgress &&
            calculationProgress.currentWorkFlowsCount > 0 &&
            calculationProgress.currentWorkFlowsCount !==
            calculationProgress.totalWorkFlowsCount && (
                <div style={{marginBottom: "15px"}}>
                  <ProgressBar
                      bottomLeftText={t(
                          "products.offsetPrice.admin.loadingOptimalWorkflows"
                      )}
                      bottomRightText={
                          calculationProgress.currentWorkFlowsCount +
                          "/" +
                          calculationProgress.totalWorkFlowsCount
                      }
                      progress={
                          (calculationProgress.currentWorkFlowsCount /
                              calculationProgress.totalWorkFlowsCount) *
                          100
                      }
                  />
                </div>
            )}
        {currentProductItemValueTotalPrice && (
            <div style={clasess.orderContainer}>
              {t("products.offsetPrice.admin.orderToral", {
                prieceNum: quantity?.values[0],
                price: isNaN(
                    currentProductItemValueTotalPrice / quantity?.values[0]
                )
                    ? 0
                    : (
                        (currentProductItemValueTotalPrice || 0) / (quantity?.values[0] || 1)
                    )?.toFixed(4),
                unitPrice: systemCurrency,
              })}
            </div>
        )}
        {widgetType === EWidgetProductType.EDIT ? (
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <div style={clasess.priceRecoveryContainer}>
                <Checkbox
                    icon={<CheckboxIcon/>}
                    checkedIcon={<CheckboxCheckedIcon/>}
                    onChange={() => {
                      setPriceRecovery(!priceRecovery);
                      if (priceRecovery) {
                        //setDefaultPrice(changePrice);
                      } else {
                        if (
                            widgetType === EWidgetProductType.EDIT ||
                            widgetType === EWidgetProductType.DUPLICATE
                        ) {
                          /*setDefaultPrice(
                                template?.quoteItem?.unitPrice * quantity?.values[0]
                              );*/
                        } else {
                          /*setDefaultPrice(
                                workFlowSelected?.totalPrice?.values[0].toFixed(2)
                              );*/
                        }
                      }
                    }}
                    checked={priceRecovery}
                />
                <div style={clasess.secondText}>
                  {t("products.offsetPrice.admin.priceRecovery")}
                </div>
              </div>
              {
                lastProductItemValueTotalPrice ? <div style={clasess.priceRecoveryContainer}>
                  <div style={clasess.secondText}>
                    {t("products.offsetPrice.admin.lastPrice")} {lastProductItemValueTotalPrice}
                  </div>
                </div> : <div></div>
              }

            </div>
        ) : null}

        <div style={clasess.urgentEstimateContainer}>
          {workFlowSelected &&
              workFlowSelected?.totalRealProductionTime?.values[0].length > 0 && (
                  <div style={clasess.secondText}>
                    {t("products.offsetPrice.admin.takeEstimate", {
                      data: `${workFlowSelected?.totalRealProductionTime?.values[0]} ${workFlowSelected?.totalRealProductionTime?.defaultUnit}`,
                    })}
                  </div>
              )}
          <div style={clasess.priceRecoveryContainer}>
            <Checkbox
                icon={<CheckboxIcon/>}
                checkedIcon={<CheckboxCheckedIcon/>}
                onChange={() => {
                  setIncludeVAT(!includeVAT);
                }}
                checked={includeVAT}
            />
            <div style={clasess.secondText}>
              {t("products.offsetPrice.admin.includeVAT")}
            </div>
          </div>
          <div style={clasess.priceRecoveryContainer}>
            <Checkbox
                icon={<CheckboxIcon/>}
                checkedIcon={<CheckboxCheckedIcon/>}
                onChange={() => {
                  setUrgentOrder(!urgentOrder);
                }}
                checked={urgentOrder}
            />
            <div style={clasess.secondText}>
              {t("products.offsetPrice.admin.urgentOrder")}
            </div>
          </div>
        </div>

        <div style={clasess.switchAdditionsContainer}>
          <div style={clasess.tabsTypesContainer}>
            {tabs?.map((tab) => {
              return (
                  <div
                      onClick={tab.onclick()}
                      style={
                        activeTab === tab.name
                            ? tab.name === t("products.offsetPrice.admin.logs")
                                ? clasess.activeLogsTabStyle
                                : clasess.activeTabStyle
                            : clasess.unActiveTabStyle
                      }
                  >
                    {tab.name}
                  </div>
              );
            })}
          </div>
          {activeTab === t("quality.production") ? (
              <div style={clasess.productionStatus}>
                <div style={clasess.sampleTypeStyle}>
                  {t("products.offsetPrice.admin.sampleType")}
                </div>
                <div style={clasess.autoCompleteContainer}>
                  <GoMakeAutoComplate
                      key={samlleType}
                      options={exampleTypeValues}
                      getOptionLabel={(option: any) => option.text}
                      placeholder={t("products.offsetPrice.admin.sampleType")}
                      style={clasess.dropDownListStyle}
                      onChange={(e, value) => setSamlleType(value)}
                      value={samlleType}
                  />
                </div>
                <div style={clasess.multiLineContainer}>
                  <GomakeTextInput
                      multiline={6}
                      style={clasess.multiLineTextInputStyle}
                      onChange={(e: any) => {
                        setPrintingNotes(e.target.value);
                      }}
                      value={printingNotes}
                      placeholder={t(
                          "products.offsetPrice.admin.productionComment"
                      )}
                  />
                </div>
              </div>
          ) : activeTab === t("reports.details") ? (
              <div style={clasess.logsContainer}>
                <div style={clasess.detailsContainer}>{template?.details}</div>
              </div>
          ) : (
              <div style={clasess.logsContainer}>
                {errorMsg && (
                    <div style={clasess.generalMsgTextStyle}>
                      {t("products.offsetPrice.admin.general")} {errorMsg}
                    </div>
                )}
                {calculationServerErrorState && (
                    <div style={clasess.generalMsgTextStyle}>
                      {t("products.offsetPrice.admin.general")} Server Error
                    </div>
                )}

                {logsArray?.map((item) => {
                  if (item.actionName) {
                    return (
                        <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                              width: "100%",
                              gap: 5,
                            }}
                        >
                          <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: 5,
                          }}>
                            {_renderIconLogs(item.exception?.exceptionType, 16, 16)}
                            <div
                                style={{
                                  ...clasess.titleLogsTextStyle,
                                }}
                            >
                              <div style={{width: 85}}>{item.actionName}:</div>
                            </div>
                          </div>

                          <div style={clasess.textLogstyle}>
                            <span
                                style={{color: "black"}}>{t("CalculationExceptions." + item?.exception?.exceptionKey)}</span>
                          </div>
                        </div>
                    );
                  } else if (item.actionName === null) {
                    return (
                        <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                              width: "100%",
                              gap: 5,
                            }}
                        >
                          {_renderIconLogs(item.exception?.exceptionType, 16, 16)}

                          <div style={{width: "100%", marginTop: -3}}>
                            {item?.exception?.values && item?.exception?.values?.length > 0 ?
                                <span style={{color: "black"}}>
                            {item?.exception?.exceptionMessage + t("CalculationExceptions." + item?.exception?.exceptionKey)
                                .replace(/\{\{(\d+)\}\}/g, (_, index) => item?.exception?.values[index] || "")}
                          </span>
                                :
                                <span
                                    style={{color: "black"}}>{t("CalculationExceptions." + item?.exception?.exceptionKey)}</span>
                            }

                          </div>
                        </div>
                    );
                  } else {
                    return (
                        <div style={clasess.generalMsgTextStyle}>
                          <div style={clasess.iconLogsTextStyle}>
                            {_renderIconLogs(item.exception?.exceptionType, 16, 16)}
                          </div>
                          {t("products.offsetPrice.admin.general")} {t("CalculationExceptions." + item?.exceptionKey)}
                        </div>
                    );
                  }
                })}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { RightSideWidget };
