import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import {
  Checkbox,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { EWidgetProductType } from "../enums";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { useRightSideWidget } from "./use-right-side-widget";
import { _renderIconLogs } from "@/utils/constants";
import { Permissions } from "@/components/CheckPermission/enum";
import { Box, Slider } from "@mui/material";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";
import { ETab } from "@/pages-components/admin/home/widgets/quote-widget/enums";
import { ReloadPriceIcon } from "@/icons/reload-price";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { formatValueWithUnit } from "@/utils/is-currency";
import { renderExceptionMessage } from "@/utils/helpers";

export const roundPrice = (price) => {
  try {
    if (typeof price === "string" && /[a-zA-Z]/.test(price)) {
      return NaN;
    }
    if (typeof price === "string") {
      price = price;
    }
    if (price && !isNaN(price) && typeof price === "number") {
      let roundedPrice = price.toFixed(3);
      let arr = roundedPrice.split(".");
      let decimalPart = Number(arr[1]);
      if (!decimalPart) {
        return arr[0];
      }
      return roundedPrice;
    }
    return price;
  } catch (e) {
    return price;
  }
};

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
  sampleType,
  errorMsg,
  calculationProduct,
  subProducts,
  setCanCalculation,
  showCalculationInCompletedAlert,
}: any) => {
  const {
    direction,
    isRtl,
    currentProductItemValueTotalPrice,
    lastProductItemValueTotalPrice,
    calculationProgress,
    exampleTypeValues,
    systemCurrency,
    isLoading,
    quantity,
    maxIncrease,
    minDiscount,
    sliderCurrentProductItemValueTotalPrice,
    priceIncludeVat,
    systemVAT,
    selectedProduct,
    combinedData,
    priceChangePercents,
    clientTypeDefaultValue,
    clientDefaultValue,
    documentNumberText,
    workFlows,
    additionalProductItems,
    logsArray,
    permissions,
    router,
    clientTypesCategories,
    isRTL,
    localStateValue,
    setLocalStateValue,
    setSliderCurrentProductItemValueTotalPrice,
    setClientTypeDefaultValue,
    handleProductChange,
    handleSliderChange,
    setPriceIncludeVat,
    setSubProducts,
    primaryColor,
    alertFault,
    t,
  } = useRightSideWidget({ includeVAT, widgetType });



  return (
    <div style={clasess.rightSideMainContainer}>
      <div style={clasess.rightSideContainer}>
        {router?.query?.documentNumber && (
          <div
            style={clasess.titleStyle}
          >{`${documentNumberText}: ${router?.query?.documentNumber} `}</div>
        )}
        <div style={clasess.headerClientRightSide}>
          {clientDefaultValue && (
            <div style={clasess.clientContainer}>
              <div style={clasess.labelTextStyle}>
                {t("products.offsetPrice.admin.client")}
              </div>

              <Typography
                key={"client-name"}
                style={clasess.clientTypographyStyle}
              >
                {clientDefaultValue?.label ||
                  t("products.offsetPrice.admin.client")}
              </Typography>
            </div>
          )}

          {/* Client types Select */}
          {clientTypeDefaultValue && (
            <div style={clasess.typeContainer}>
              <div style={clasess.labelTextStyle}>
                {t("products.offsetPrice.admin.type")}
              </div>
              <GoMakeAutoComplate
                options={clientTypesCategories}
                disableClearable
                style={clasess.clientDropDownListStyle}
                placeholder={t("customers.selectAgent")}
                onChange={(e, v) => {
                  if (v) {
                    if (
                      widgetType === EWidgetProductType.EDIT ||
                      widgetType === EWidgetProductType.DUPLICATE
                    ) {
                      setCanCalculation(true);
                    }
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, clientTypeId: v?.id },
                    });
                    setClientTypeDefaultValue(v);
                  }
                }}
                value={clientTypeDefaultValue}
              />
            </div>
          )}
        </div>

        {/* Product Select */}
        <div style={clasess.autoComplateRowContainer}>
          <div
            data-tour="select-product"
            style={{ width: "100%", marginBottom: 16 }}
          >
            <GoMakeTreeSelect
              value={selectedProduct}
              options={combinedData}
              onChange={(e) => {
                setSubProducts([]);
                handleProductChange(e);
              }}
              placeholder={t("home.admin.selectProductOrMaterial")}
              selectedTab={ETab.PRODUCTS}
              setSelectedTab={null}
              hideOtherTabs={true}
            />
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    ...clasess.totalCurrancyStyle,
                    position: "absolute",
                    // left: 30,
                    // zIndex: 999999,
                    left: 10,
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                >
                  {systemCurrency}
                </span>
                <GomakeTextInput
                  direction={direction}
                  value={
                    localStateValue ??
                    roundPrice(sliderCurrentProductItemValueTotalPrice) ??
                    "---------"
                  }
                  onBlur={(e: any) => {
                    if (currentProductItemValueTotalPrice > 0) {
                      const inputValue = Number(e.target.value);
                      if (maxIncrease && minDiscount) {
                        if (
                          priceChangePercents?.minPercent === null &&
                          priceChangePercents?.maxPercent === null
                        )
                          return;
                        if (
                          (priceChangePercents?.minPercent !== null &&
                            priceChangePercents?.maxPercent !== null &&
                            inputValue < minDiscount) ||
                          inputValue > maxIncrease
                        ) {
                          alertFault("alerts.outOfAllowed");
                          setSliderCurrentProductItemValueTotalPrice(
                            currentProductItemValueTotalPrice
                          ); // Reset to valid value
                        }
                      }
                    }
                  }}
                  onChange={(e: any) => {
                    if (
                      !permissions.includes(Permissions.UPDATE_CALCULATED_PRICE)
                    ) {
                      setSliderCurrentProductItemValueTotalPrice(
                        currentProductItemValueTotalPrice
                      );
                    } else {
                      setLocalStateValue(e.target.value)
                      setSliderCurrentProductItemValueTotalPrice(
                        e.target.value
                      );
                    }
                  }}
                  key={"TotalPriceInput"}
                  style={{
                    ...clasess.inputPriceStyle,
                    ...(showCalculationInCompletedAlert && {
                      color: "#f44336",
                      WebkitTextFillColor: "#f44336",
                    }),
                  }}
                />
              </div>
            )}
          </div>
          {showCalculationInCompletedAlert && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <WarningAmberRoundedIcon htmlColor={"#f44336"} />
            </div>
          )}
          <span style={clasess.totalCurrancyStyle}>
            <Tooltip title={t("products.offsetPrice.admin.updateTotalPrice")}>
              <IconButton
                onClick={() => {
                  calculationProduct(subProducts);
                  setLocalStateValue(null)
                }}
              >
                <ReloadPriceIcon color={primaryColor(500)} />
              </IconButton>
            </Tooltip>
          </span>
        </div>
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
        {sliderCurrentProductItemValueTotalPrice && (
          <>
            <div style={clasess.orderContainer}>
              {t("products.offsetPrice.admin.orderToral", {
                prieceNum:
                  quantity &&
                  quantity.values &&
                  quantity.values.length &&
                  quantity?.values[0],
                price: roundPrice(
                  isNaN(
                    sliderCurrentProductItemValueTotalPrice /
                    ((quantity &&
                      quantity.values &&
                      quantity.values.length &&
                      quantity?.values[0]) ||
                      1)
                  )
                    ? 0
                    : (sliderCurrentProductItemValueTotalPrice || 0) /
                    ((quantity &&
                      quantity.values &&
                      quantity.values.length &&
                      quantity?.values[0]) ||
                      1)
                ),
                unitPrice: systemCurrency,
              })}
            </div>
            <div style={clasess.vatContainer}>
              {t("products.offsetPrice.admin.includeVAT")}:{" "}
              {!isRTL && systemCurrency}
              <input
                value={roundPrice(priceIncludeVat)}
                // type="number"
                onChange={(e) => {
                  const newPriceIncludeVat = e.target.value;
                  setPriceIncludeVat(newPriceIncludeVat);
                  if (
                    quantity &&
                    quantity.values &&
                    quantity.values.length &&
                    quantity?.values[0] &&
                    newPriceIncludeVat !== "" &&
                    newPriceIncludeVat !== null &&
                    newPriceIncludeVat !== "0"
                  ) {
                    const newTotalPrice = roundPrice(
                      Number(newPriceIncludeVat) / (1 + systemVAT)
                    );
                    setSliderCurrentProductItemValueTotalPrice(
                      Number(newTotalPrice)
                    );
                    setLocalStateValue(Number(newTotalPrice))
                  }
                }}
                style={{
                  width: "65px",
                  border: "none",
                  outline: "none",
                  color: "#2E3092",
                  padding: "5px",
                }}
              />
              {isRTL && systemCurrency}
            </div>
          </>
        )}

        {widgetType === EWidgetProductType.EDIT ||
          widgetType === EWidgetProductType.DUPLICATE ? (
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
                  {/* {lastProductItemValueTotalPrice} */}
                  {roundPrice(lastProductItemValueTotalPrice)}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        ) : null}
        {template?.minimumPrice > 0 &&
          !sliderCurrentProductItemValueTotalPrice && (
            <div style={{ ...clasess.secondText, marginBottom: 10 }}>
              {t("products.addProduct.admin.minimumPrice")} :{" "}
              {template?.minimumPrice}
            </div>
          )}
        {template?.minimumPrice > 0 &&
          sliderCurrentProductItemValueTotalPrice &&
          workFlows?.length > 0 && (
            <div style={{ ...clasess.secondText, marginBottom: 10 }}>
              {t("dashboard.calculatedPrice")} :{" "}
              {workFlows[0]?.calculatedTotalPriceBeforeProductMinimumPriceCheck}
            </div>
          )}
        {/* Slider */}
        {priceChangePercents?.minPercent !== null &&
          priceChangePercents?.maxPercent !== null && (
            <PermissionCheck
              userPermission={Permissions.UPDATE_CALCULATED_PRICE}
            >
              <Box
                sx={{ width: 300, textAlign: "center", margin: "20px auto" }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ direction: direction }}
                >
                  <Typography sx={clasess.labelsStyle}>
                    {!isRTL && systemCurrency}
                    {Math.round(minDiscount)}
                    {isRTL && systemCurrency}
                  </Typography>
                  <Typography sx={clasess.labelsStyle}>
                    {!isRTL && systemCurrency}
                    {Math.round(maxIncrease)}
                    {isRTL && systemCurrency}
                  </Typography>
                </Box>
                <Slider
                  value={sliderCurrentProductItemValueTotalPrice}
                  onChange={handleSliderChange}
                  aria-label="Price Change Slider"
                  min={Math.round(Number(minDiscount))}
                  max={Math.round(Number(maxIncrease))}
                  step={1}
                  sx={{
                    direction: direction,
                    transform: isRtl ? "scaleX(-1)" : "none",
                    "& .MuiSlider-track": {
                      direction: direction,
                    },
                  }}
                />
              </Box>
            </PermissionCheck>
          )}
        {/* Slider */}
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
                  data: formatValueWithUnit(
                    workFlowSelected?.totalRealProductionTime?.values[0],
                    workFlowSelected?.totalRealProductionTime?.defaultUnit
                  ),
                })}
              </div>
            )}
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
                {t("products.offsetPrice.admin.proof")}
              </div>
              <div style={clasess.autoCompleteContainer}>
                <GoMakeAutoComplate
                  key={sampleType}
                  options={
                    exampleTypeValues?.map((option) => ({
                      value: option.key,
                      text: t(`products.proofTypes.${option.value}`),
                    })) || []
                  }
                  getOptionLabel={(option: any) => option.text}
                  placeholder={t("products.offsetPrice.admin.proof")}
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
                <div style={clasess.generalMsgTextStyle}>{errorMsg}</div>
              )}
              {/* {calculationServerErrorState && (
                <div style={clasess.generalMsgTextStyle}>
                  {t("products.offsetPrice.admin.general")} Server Error
                </div>
              )} */}
              {logsArray?.map((item) => {
                const renderValues = (values) => {
                  if (!item?.exception?.exceptionKey && values?.length > 0) {
                    return values.join(", ");
                  }
                  return "";
                };
                if (item.actionName || item.actionName === null) {
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
                      <div>
                        {_renderIconLogs(item.exception?.exceptionType, 16, 16)}
                      </div>
                      <div
                        style={{
                          marginTop: -1.5,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ ...clasess.titleLogsTextStyle }}>
                          {`${item.actionName ? item.actionName + ": " : ""}${item?.exception?.exceptionMessage || " "
                            }${renderExceptionMessage(
                              item?.exception?.exceptionKey,
                              item?.exception?.values,
                              t
                            )}${!item?.exception?.exceptionKey
                              ? renderValues(item?.exception?.values)
                              : ""
                            }`}
                        </div>
                      </div>
                    </div>
                  );
                } else {
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
                      <div>{_renderIconLogs(item?.exceptionType, 16, 16)}</div>
                      <div
                        style={{
                          marginTop: -1.5,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ ...clasess.titleLogsTextStyle }}>
                          {`${item?.exceptionMessage || " "
                            }${renderExceptionMessage(
                              item?.exceptionKey,
                              item?.values,
                              t
                            )}${!item?.exceptionKey
                              ? renderValues(item?.values)
                              : ""
                            }`}
                        </div>
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
