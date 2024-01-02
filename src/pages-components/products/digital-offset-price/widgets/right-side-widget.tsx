import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import {isLoadgingState, subProductsParametersState, systemCurrencyState} from "@/store";
import { Checkbox, Slider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { EWidgetProductType } from "../enums";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { exampleTypeState } from "@/store/example-type";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import {
  calculationProgressState,
  currentProductItemValuePriceState,
  selectedWorkFlowState,
} from "@/widgets/product-pricing-widget/state";
import { ProgressBar } from "@/components/progress-bar/progress-bar";

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
}: any) => {
  const isLoading = useRecoilValue(isLoadgingState);
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);

  const [
    currentProductItemValueTotalPrice,
    setCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(currentProductItemValuePriceState);
  const calculationProgress = useRecoilValue(calculationProgressState);
  const quantity = useMemo(() => {
    if (subProducts) {
      const generalParameters = subProducts.find((x) => !x.type)?.parameters;
      return generalParameters?.find(
        (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
      );
    }
  }, [subProducts]);
  const exampleTypeValues = useRecoilValue(exampleTypeState);
  const [changePrice, setChangePrice] = useState<number>(0);
  const { t } = useTranslation();
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
          <div style={clasess.totalStyle}>
            {t("products.offsetPrice.admin.total")}
          </div>
          <div style={clasess.totalStyle}>
            {isLoading ? (
              <DotsLoader />
            ) : (
              <GomakeTextInput
                value={currentProductItemValueTotalPrice ?? "-----"}
                onChange={(e: any) => {
                  setCurrentProductItemValueTotalPrice(e.target.value);
                  //e.target.value;
                  /*setPriceRecovery(false);
                  const updatedDefaultPrice = { ...defaultPrice };
                  updatedDefaultPrice.values = [...updatedDefaultPrice?.values];
                  updatedDefaultPrice.values[0] = e.target.value;
                  setDefaultPrice(updatedDefaultPrice);
                  setChangePrice(updatedDefaultPrice);*/
                }}
                style={clasess.inputPriceStyle}
                type={"number"}
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
              pieceNum: quantity?.values[0],
              price: isNaN(
                currentProductItemValueTotalPrice / quantity?.values[0]
              )
                ? 0
                : (
                    currentProductItemValueTotalPrice / quantity?.values[0]
                  ).toFixed(2),
              unitPrice: "USD",
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
                setUrgentOrder(!urgentOrder);
              }}
              checked={urgentOrder}
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
                setIncludeVAT(!urgentOrder);
              }}
              checked={includeVAT}
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
                      ? clasess.activeTabStyle
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
                  options={exampleTypeValues}
                  getOptionLabel={(option: any) => option.text}
                  placeholder={t("products.offsetPrice.admin.sampleType")}
                  style={clasess.dropDownListStyle}
                  onChange={(e, value) => setSamlleType(value)}
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
          ) : (
            <div style={clasess.productionStatus}>
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
          )}
        </div>
      </div>
      {/* <div style={clasess.noVatStyle}>
        {t("products.offsetPrice.admin.dontVAT")}
      </div> */}
    </div>
  );
};

export { RightSideWidget };
