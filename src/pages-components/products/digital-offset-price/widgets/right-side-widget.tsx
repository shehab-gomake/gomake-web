import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { EWidgetProductType } from "../enums";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { ProgressBar } from "@/components/progress-bar/progress-bar";
import { useRightSideWidget } from "./use-right-side-widget";
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
}: any) => {
  const {
    currentProductItemValueTotalPrice,
    calculationProgress,
    exampleTypeValues,
    billingMethodValues,
    systemCurrency,
    listEmployees,
    isLoading,
    quantity,
    calculationExceptionsLogs,
    setCurrentProductItemValueTotalPrice,
    t,
    _renderIconLogs,
  } = useRightSideWidget({ includeVAT });
  return (
    <div style={clasess.rightSideMainContainer}>
      <div style={clasess.rightSideContainer}>
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
        {template.img ? (
          <div style={clasess.imgProductContainer}>
            <img src={template.img} alt="gomake" style={{ width: "100%" }} />
          </div>
        ) : (
          <></>
        )}
        {/* <div style={clasess.headerRightSide}>
          <div style={clasess.flyerText}>
            {t("products.offsetPrice.admin.flyerPoster")}
          </div>
          <div style={clasess.flyerText}>
            {isNaN(defaultPrice?.values[0] / quantity?.values[0])
              ? 0
              : (defaultPrice?.values[0] / quantity?.values[0]).toFixed(2)}{" "}
            USD
          </div>
        </div> */}
        {/* <div style={clasess.imgProductContainer}>
          <img src={template.img} alt="gomake" style={{ width: "100%" }} />
        </div> */}
        {/* {typeof defaultPrice === "object" && (
          <>
            <div style={clasess.progress}>
              <PermissionCheck userPermission={Permissions.EDIT_PRICE_QUOTE}>
                <Slider
                  defaultValue={defaultPrice?.values[0]}
                  value={defaultPrice?.values[0]}
                  aria-label="Default"
                  style={{ width: "93%", marginLeft: 10 }}
                  min={10}
                  max={100}
                  onChange={handleChange}
                />
              </PermissionCheck>
            </div>
            <div style={clasess.labelBrogressContainer}>
              <div style={clasess.labelStyle}>10.00</div>
              <div style={clasess.labelStyle}>100.00</div>
            </div>
          </>
        )} */}

        <div style={clasess.totalContainer}>
          <div style={clasess.totalStyleText}>
            {t("products.offsetPrice.admin.total")}
          </div>
          <div style={clasess.totalStyle}>
            {isLoading ? (
              <DotsLoader />
            ) : (
              <GomakeTextInput
                value={
                  calculationExceptionsLogs?.length > 0
                    ? "---------"
                    : (currentProductItemValueTotalPrice ? currentProductItemValueTotalPrice.toFixed(2) : currentProductItemValueTotalPrice) ?? "---------"
                }
                onChange={(e: any) => {
                  setCurrentProductItemValueTotalPrice(e.target.value);
                }}
                style={clasess.inputPriceStyle}
                type={currentProductItemValueTotalPrice ? "number" : "text"}
              />
            )}
          </div>
          <span style={clasess.totalCurrancyStyle}>{systemCurrency}</span>
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
        {currentProductItemValueTotalPrice && (
          <div style={clasess.orderContainer}>
            {t("products.offsetPrice.admin.orderToral", {
              prieceNum: quantity?.values[0],
              price: isNaN(
                currentProductItemValueTotalPrice / quantity?.values[0]
              )
                ? 0
                : (
                  currentProductItemValueTotalPrice / quantity?.values[0]
                ).toFixed(2),
              unitPrice: systemCurrency,
            })}
          </div>
        )}
        {widgetType === EWidgetProductType.EDIT ? (
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
          ) : activeTab === t("products.offsetPrice.admin.graphicDesign") ? (
            <div style={clasess.productionStatus}>
              <div style={clasess.sampleTypeStyle}>Billing method</div>
              <div style={clasess.autoCompleteContainer}>
                <GoMakeAutoComplate
                  key={billingMethod}
                  options={billingMethodValues}
                  getOptionLabel={(option: any) => option.text}
                  placeholder="Billing method"
                  style={clasess.dropDownListStyle}
                  onChange={(e, value) => setBillingMethod(value)}
                  value={billingMethod}
                />
              </div>
              <div style={clasess.sampleTypeStyle}>Graphic designer</div>
              <div style={clasess.autoCompleteContainer}>
                <GoMakeAutoComplate
                  key={graphicDesigner}
                  options={[
                    {
                      id: "00415c86-165f-463a-bde0-f37c66f00000",
                      firstname: "Recommeded",
                      lastname: "",
                      email: "recommeded@gomake.net",
                    },
                    ...listEmployees,
                  ]}
                  getOptionLabel={(option: any) =>
                    `${option.firstname}` + ` ${option.lastname}`
                  }
                  placeholder={"Graphic designer"}
                  style={clasess.dropDownListStyle}
                  onChange={(e, value) => setGraphicDesigner(value)}
                  value={graphicDesigner}
                />
              </div>
              <div style={clasess.multiLineContainer}>
                <GomakeTextInput
                  multiline={6}
                  onChange={(e: any) => {
                    setGraphicNotes(e.target.value);
                  }}
                  value={graphicNotes}
                  style={clasess.multiLineTextInputStyle}
                  placeholder={t(
                    "products.offsetPrice.admin.graphicDesignComment"
                  )}
                />
              </div>
            </div>
          ) : (
            <div style={clasess.logsContainer}>
              {errorMsg && (
                <div style={clasess.generalMsgTextStyle}>
                  {t("products.offsetPrice.admin.general")} {errorMsg}
                </div>
              )}

              {calculationExceptionsLogs?.map((item) => {
                return (
                  <>
                    {item.title ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          width: "100%",
                          gap: 5,
                        }}
                      >
                        <div style={clasess.iconLogsTextStyle}>
                          <div>{_renderIconLogs(item.type)}</div>
                        </div>
                        <div
                          style={{
                            ...clasess.titleLogsTextStyle,
                            // color: item.type ? "" : "",
                          }}
                        >
                          <div>{item.title}:</div>
                        </div>
                        <div style={clasess.textLogstyle}>
                          <span style={{ color: "black" }}>{item.text}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={clasess.generalMsgTextStyle}>
                        {t("products.offsetPrice.admin.general")} {item.text}
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { RightSideWidget };
