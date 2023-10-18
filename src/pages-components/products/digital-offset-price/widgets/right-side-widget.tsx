import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { isLoadgingState } from "@/store";
import { Checkbox, CircularProgress, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { EWidgetProductType } from "../enums";

const RightSideWidget = ({
  clasess,
  clientDefaultValue,
  renderOptions,
  checkWhatRenderArray,
  clientTypeDefaultValue,
  clientTypesValue,
  defaultPrice,
  setDefaultPrice,
  template,
  tabs,
  activeTab,
  pricingDefaultValue,
  setUrgentOrder,
  urgentOrder,
  setPrintingNotes,
  setGraphicNotes,
  printingNotes,
  graphicNotes,
  generalParameters,
  workFlowSelected,
  widgetType,
  setPriceRecovery,
  priceRecovery,
}: any) => {
  const isLoading = useRecoilValue(isLoadgingState);

  const quantity = generalParameters?.find(
    (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
  );
  const [sliderPrice, setSliderPrice] = useState<number>(0);
  const [changePrice, setChangePrice] = useState<number>(0);
  console.log("changePrice", changePrice);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setSliderPrice(newValue as number);
  };
  useEffect(() => {
    if (workFlowSelected) {
      setDefaultPrice(workFlowSelected?.totalPrice.toFixed(2) - sliderPrice);
    } else if (widgetType === EWidgetProductType.EDIT) {
      setDefaultPrice(template?.quoteItem?.unitPrice * quantity?.value);
    } else {
      setDefaultPrice("----");
    }
  }, [
    pricingDefaultValue,
    sliderPrice,
    workFlowSelected,
    widgetType,
    quantity,
  ]);
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

        <div style={clasess.headerRightSide}>
          <div style={clasess.flyerText}>
            {t("products.offsetPrice.admin.flyerPoster")}
          </div>
          <div style={clasess.flyerText}>
            {isNaN(defaultPrice / quantity?.value)
              ? 0
              : (defaultPrice / quantity?.value).toFixed(2)}{" "}
            USD
          </div>
        </div>
        <div style={clasess.imgProductContainer}>
          <img src={template.img} alt="gomake" style={{ width: "100%" }} />
        </div>
        <div style={clasess.urgentEstimateContainer}>
          <div style={clasess.secondText}>
            {t("products.offsetPrice.admin.takeEstimate", {
              data: "5 days",
            })}
          </div>
          <div style={clasess.urgentContainer}>
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
        <div style={clasess.orderContainer}>
          {t("products.offsetPrice.admin.orderToral", {
            pieceNum: quantity?.value,
            price: isNaN(defaultPrice / quantity?.value)
              ? 0
              : (defaultPrice / quantity?.value).toFixed(2),
          })}
        </div>
        <div style={clasess.progress}>
          <Slider
            defaultValue={0}
            aria-label="Default"
            style={{ width: "93%", marginLeft: 10 }}
            min={10}
            max={100}
            onChange={handleChange}
          />
        </div>
        <div style={clasess.labelBrogressContainer}>
          <div style={clasess.labelStyle}>10.00</div>
          <div style={clasess.labelStyle}>100.00</div>
        </div>
        <div style={clasess.totalContainer}>
          <div style={clasess.totalStyle}>
            {t("products.offsetPrice.admin.total")}
          </div>
          <div style={clasess.totalStyle}>
            {isLoading ? (
              <CircularProgress size={25} style={{ marginRight: 40 }} />
            ) : (
              <GomakeTextInput
                value={defaultPrice}
                onChange={(e: any) => {
                  setPriceRecovery(false);
                  setDefaultPrice(e.target.value);
                  setChangePrice(e.target.value);
                }}
                style={clasess.inputPriceStyle}
              />
            )}{" "}
            USD
          </div>
        </div>
        {widgetType === EWidgetProductType.EDIT ? (
          <div style={clasess.priceRecoveryContainer}>
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              onChange={() => {
                setPriceRecovery(!priceRecovery);
                if (priceRecovery) {
                  setDefaultPrice(changePrice);
                } else {
                  setDefaultPrice(
                    workFlowSelected?.totalPrice.toFixed(2) - sliderPrice
                  );
                }
              }}
              checked={priceRecovery}
            />
            <div style={clasess.secondText}>
              {t("products.offsetPrice.admin.priceRecovery")}
            </div>
          </div>
        ) : null}

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
          {activeTab === "Production" ? (
            <div style={clasess.productionStatus}>
              <div style={clasess.sampleTypeStyle}>
                {t("products.offsetPrice.admin.sampleType")}
              </div>
              <div style={clasess.autoCompleteContainer}>
                <GoMakeAutoComplate
                  options={["q", "w"]}
                  placeholder={t("products.offsetPrice.admin.sampleType")}
                  style={clasess.dropDownListStyle}
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
                  placeholder="Production comment"
                />
              </div>
            </div>
          ) : (
            <div style={clasess.productionStatus}>
              <div style={clasess.sampleTypeStyle}>
                {t("products.offsetPrice.admin.sampleType")}
              </div>
              <div style={clasess.autoCompleteContainer}>
                <GoMakeAutoComplate
                  options={["q", "w"]}
                  placeholder={t("products.offsetPrice.admin.sampleType")}
                  style={clasess.dropDownListStyle}
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
                  placeholder="Graphic design comment"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <GomakePrimaryButton
        style={clasess.addOrderBtn}
        onClick={onOpeneMakeShape}
      >
        {t("products.offsetPrice.admin.addOrder")}
      </GomakePrimaryButton>
      <div style={clasess.noVatStyle}>
        {t("products.offsetPrice.admin.dontVAT")}
      </div> */}
    </div>
  );
};

export { RightSideWidget };
