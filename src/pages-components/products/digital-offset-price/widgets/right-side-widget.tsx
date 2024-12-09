import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon, ReloadIcon } from "@/icons";
import { Checkbox, Divider, Typography } from "@mui/material";
import { EWidgetProductType } from "../enums";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { useRightSideWidget } from "./use-right-side-widget";
import { useEffect, useState } from "react";
import { _renderIconLogs } from "@/utils/constants";
import { useRouter } from "next/router";
import { useClientTypesList } from "@/hooks/use-client-types";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useRecoilValue } from "recoil";
import { additionalProductItemsState } from "@/widgets/product-pricing-widget/state";

const RightSideWidget = ({
  clasess,
  template,
  tabs,
  activeTab,
  setUrgentOrder,
  urgentOrder,
  setPrintingNotes,
  printingNotes,
  workFlowSelected,
  widgetType,
  setPriceRecovery,
  priceRecovery,
  setSampleType,
  includeVAT,
  setIncludeVAT,
  sampleType,
  errorMsg,
  calculationServerErrorState,
  canCalculation,
  calculationProduct,
  subProducts,

}: any) => {
  const {
    currentProductItemValueTotalPrice,
    lastProductItemValueTotalPrice,
    calculationProgress,
    exampleTypeValues,
    systemCurrency,
    isLoading,
    quantity,
    selectedWorkFlow,
    calculationExceptionsLogs,
    setCurrentProductItemValueTotalPrice,
    t,
  } = useRightSideWidget({ includeVAT });
  const direction = t("direction");
  const additionalProductItems = useRecoilValue(additionalProductItemsState);
  const mergedArray = [
    ...(selectedWorkFlow?.exceptions || []),
    ...(calculationExceptionsLogs || []),
  ];
  const [logsArray, setLogsArray] = useState(mergedArray);



  useEffect(() => {
    const uniqueArray = mergedArray.filter((item, index, self) => {
      const itemValuesArray = JSON.parse(item.values || "[]");
      const itemValuesSorted = itemValuesArray.sort().join(",");
      return (
        index ===
        self.findIndex(
          (t) =>
            t.actionName === item.actionName &&
            t?.exception?.exceptionKey === item?.exception?.exceptionKey &&
            t?.exception?.exceptionMessage ===
            item?.exception?.exceptionMessage &&
            JSON.parse(t.values || "[]")
              .sort()
              .join(",") === itemValuesSorted
        )
      );
    });
    if (uniqueArray) {
      setLogsArray(uniqueArray);
    }
  }, [selectedWorkFlow, calculationExceptionsLogs]);

  const router = useRouter();
  const [clientTypeDefaultValue, setClientTypeDefaultValue] = useState<any>();
  const [clientDefaultValue, setClientDefaultValue] = useState<any>();
  const { clientTypesCategories, getClientTypesCategories } =
    useClientTypesList();

  useEffect(() => {
    getClientTypesCategories();
  }, []);

  useEffect(() => {
    if (router?.query?.clientTypeId) {
      clientTypesCategories &&
        setClientTypeDefaultValue(
          clientTypesCategories?.find(
            (item: any) => item?.id === router?.query?.clientTypeId
          )
        );
    }
    if (router?.query?.customerId && router?.query?.customerName) {
      const customerName = Array.isArray(router?.query?.customerName)
        ? router.query.customerName[0]
        : router?.query?.customerName;
      const decodedCustomerName = customerName
        ? decodeURIComponent(customerName)
        : "";
      setClientDefaultValue({
        id: router?.query?.customerId,
        label: decodedCustomerName,
      });
    }
  }, [clientTypesCategories]);

  const docType = Array.isArray(router?.query?.documentType)
    ? 0
    : Number(router?.query?.documentType) ?? 0;

  const documentNumberText =
    docType === DOCUMENT_TYPE.quote
      ? t("sales.quote.quoteNumber")
      : t("sales.quote.orderNumber");

  return (
    <div style={clasess.rightSideMainContainer}>
      <div style={clasess.rightSideContainer}>
        {router?.query?.documentNumber && (
          <div
            style={clasess.titleStyle}
          >{`${documentNumberText}: ${router?.query?.documentNumber} `}</div>
        )}
        <div style={clasess.headerClientRightSide}>
          <div style={clasess.clientContainer}>
            <div style={clasess.labelTextStyle}>
              {t("products.offsetPrice.admin.client")}
            </div>
            {clientDefaultValue && (
              <Typography
                key={"client-name"}
                style={clasess.clientTypographyStyle}
              >
                {clientDefaultValue?.label ||
                  t("products.offsetPrice.admin.client")}
              </Typography>
            )}
          </div>
          <div style={clasess.typeContainer}>
            <div style={clasess.labelTextStyle}>
              {t("products.offsetPrice.admin.type")}
            </div>
            {clientTypeDefaultValue && (
              <GoMakeAutoComplate
                options={clientTypesCategories}
                disableClearable
                style={clasess.clientDropDownListStyle}
                placeholder={t("customers.selectAgent")}
                onChange={(e, v) => {
                  if (v) {
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, clientTypeId: v?.id },
                    });
                    setClientTypeDefaultValue(v);
                  }
                }}
                value={clientTypeDefaultValue}
              />
              // <Typography
              //   key={"client-type"}
              //   style={clasess.clientDropDownListStyle}>
              //   {clientTypeDefaultValue?.label || t("products.offsetPrice.admin.type")}
              // </Typography>
            )}
          </div>
        </div>
        {template.img ? (
          <div style={clasess.imgProductContainer}>
            <img src={template.img} alt="gomake" style={{ width: "100%" }} />
          </div>
        ) : (
          <></>
        )}

        <div style={clasess.totalContainer}>
          <div style={clasess.totalStyleText}>
            {t("products.offsetPrice.admin.total")}
          </div>
          <div data-tour={"product-pricing"} style={clasess.totalStyle}>
            {isLoading ? (
              <DotsLoader />
            ) : (
              <GomakeTextInput
                value={currentProductItemValueTotalPrice ?? "---------"}
                onChange={(e: any) => {
                  setCurrentProductItemValueTotalPrice(e.target.value);
                }}
                key={"TotalPriceInput"}
                style={clasess.inputPriceStyle}
              />
            )}
          </div>
          <span style={clasess.totalCurrancyStyle}>{systemCurrency}</span>
        </div>
        <div
          onClick={() => {
            if (canCalculation) {
              calculationProduct(subProducts);
            }
          }}
          style={clasess.reloadTotalPrice}><ReloadIcon /> {t(
            "products.offsetPrice.admin.updateTotalPrice"
          )}</div>
        {calculationProgress &&
          calculationProgress.currentWorkFlowsCount > 0 &&
          calculationProgress.currentWorkFlowsCount !==
          calculationProgress.totalWorkFlowsCount && (
            <div style={{ marginBottom: "15px" }}>
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
                  (currentProductItemValueTotalPrice || 0) /
                  (quantity?.values[0] || 1)
                )?.toFixed(4),
              unitPrice: systemCurrency,
            })}
          </div>
        )}
        {widgetType === EWidgetProductType.EDIT ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div style={clasess.priceRecoveryContainer}>
              <Checkbox
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxCheckedIcon />}
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
            {lastProductItemValueTotalPrice ? (
              <div style={clasess.priceRecoveryContainer}>
                <div style={clasess.secondText}>
                  {t("products.offsetPrice.admin.lastPrice")}{" "}
                  {lastProductItemValueTotalPrice}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        ) : null}
        <Divider />
        {additionalProductItems?.length > 0 && (
          <div style={clasess.additionalProductItems}>
            {additionalProductItems.map((item) => (
              <div
                key={item.printingActionId}
                style={clasess.additionalProductItemsContainer}
              >
                <div style={clasess.additionalProductItem}>
                  {item.productName}
                </div>
                <div style={clasess.additionalPrices}>
                  {item.lastPrice && item.lastPrice !== item.newPrice && (
                    <div
                      style={{
                        textDecoration: "line-through",
                        fontWeight: 300,
                        color: "#2E3092",
                      }}
                    >
                      {item.lastPrice} {systemCurrency}
                    </div>
                  )}
                  <div style={clasess.additionalProductItem}>
                    {item.newPrice} {systemCurrency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
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
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
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
                  style={{
                    ...(activeTab === tab.name
                      ? tab.name === t("products.offsetPrice.admin.logs")
                        ? clasess.activeLogsTabStyle
                        : clasess.activeTabStyle
                      : clasess.unActiveTabStyle),
                    position: "relative",
                  }}
                >
                  {tab.name}
                  {tab?.showIndicator && (
                    <div
                      style={{
                        position: "absolute",
                        top: -5,
                        right: direction === "ltr" ? -5 : "auto",
                        left: direction === "rtl" ? -5 : "auto",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "red",
                        }}
                      />
                    </div>
                  )}
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
                  key={sampleType}
                  options={exampleTypeValues}
                  getOptionLabel={(option: any) => option.text}
                  placeholder={t("products.offsetPrice.admin.sampleType")}
                  style={clasess.dropDownListStyle}
                  onChange={(e, value) => setSampleType(value)}
                  value={sampleType}
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
                  {errorMsg}
                </div>
              )}
              {/* {calculationServerErrorState && (
                <div style={clasess.generalMsgTextStyle}>
                  {t("products.offsetPrice.admin.general")} Server Error
                </div>
              )} */}
              {logsArray?.map((item) => {
                if (item.actionName || item.actionName === null) {
                  const renderExceptionMessage = (exceptionKey, values) => {
                    if (exceptionKey && values?.length > 0) {
                      return (
                        <span style={{ color: "black" }}>
                          {t("CalculationExceptions." + exceptionKey).replace(
                            /\{\{(\d+)\}\}/g,
                            (_, index) => values[index] || ""
                          )}
                        </span>
                      );
                    }
                    else if (exceptionKey) {
                      return (
                        <span style={{ color: "black" }}>
                          {t("CalculationExceptions." + exceptionKey)}
                        </span>
                      );
                    }
                    return null;
                  };

                  const renderValues = (values) => {
                    if (!item?.exception?.exceptionKey && values?.length > 0) {
                      return (
                        <span style={{ color: "black" }}>
                          {values.join(", ")}
                        </span>
                      );
                    }
                    return null;
                  };
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

                      <div style={{ width: "100%", marginTop: -3 }}>
                        {item.actionName !== undefined && (
                          <div style={{ ...clasess.titleLogsTextStyle }}>
                            <div style={{ width: "fit-content" }}>
                              {item.actionName || ""}:
                            </div>
                            <div style={{ width: "fit-content" }}>
                              {item?.exception?.exceptionMessage || ""}
                            </div>
                            {renderExceptionMessage(item?.exception?.exceptionKey, item?.exception?.values)}
                            {renderValues(item?.exception?.values)}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
                else {
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
                      {_renderIconLogs(item?.exceptionType, 16, 16)}

                      <div style={{ width: "100%", marginTop: -3 }}>
                        {item?.values &&
                          item?.values?.length > 0 ? (
                          <span style={{ color: "black" }}>
                            {item?.exceptionMessage +
                              t(
                                "CalculationExceptions." +
                                item?.exceptionKey
                              ).replace(
                                /\{\{(\d+)\}\}/g,
                                (_, index) =>
                                  item?.values[index] || ""
                              )}
                          </span>
                        ) : (
                          <span style={{ color: "black" }}>
                            {t("CalculationExceptions." + item?.exceptionKey)}
                          </span>
                        )}
                      </div>
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
