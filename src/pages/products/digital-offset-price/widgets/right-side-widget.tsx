import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { isLoadgingState } from "@/store";
import { loadgingState } from "@/store/loading";
import { Checkbox, CircularProgress, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

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
  onOpeneMakeShape,
  pricingDefaultValue,
}: any) => {
  const isLoading = useRecoilValue(isLoadgingState);
  const [defaultPrice, setDefaultPrice] = useState<any>();
  useEffect(() => {
    if (pricingDefaultValue?.workFlows?.length > 0) {
      setDefaultPrice(pricingDefaultValue?.workFlows[0]?.totalPrice.toFixed(2));
    } else {
      setDefaultPrice("----");
    }
  }, [pricingDefaultValue]);
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
                onChange={(e, value) => {
                  console.log(value);
                }}
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
                onChange={(e, value) => {
                  console.log(value);
                }}
              />
            )}
          </div>
        </div>

        <div style={clasess.headerRightSide}>
          <div style={clasess.flyerText}>
            {t("products.offsetPrice.admin.flyerPoster")}
          </div>
          <div style={clasess.flyerText}>2.00 USD</div>
        </div>
        <div style={clasess.imgProductContainer}>
          <img
            src={template.img}
            alt="gomake"
            style={{ width: "100%", height: 170, borderRadius: 16 }}
          />
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
            />
            <div style={clasess.secondText}>
              {t("products.offsetPrice.admin.urgentOrder")}
            </div>
          </div>
        </div>
        <div style={clasess.orderContainer}>
          {t("products.offsetPrice.admin.orderToral", {
            pieceNum: "15",
            price: "2.00",
          })}
        </div>
        <div style={clasess.progress}>
          <Slider defaultValue={50} aria-label="Default" />
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
                onChange={(e: any) => setDefaultPrice(e.target.value)}
                style={clasess.inputPriceStyle}
              />
            )}{" "}
            USD
          </div>
        </div>
        <div style={clasess.priceRecoveryContainer}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
          />
          <div style={clasess.secondText}>
            {t("products.offsetPrice.admin.priceRecovery")}
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
                  onChange={(e, value) => {
                    console.log(value);
                  }}
                />
              </div>
              <div style={clasess.multiLineContainer}>
                <GomakeTextInput
                  multiline={6}
                  style={clasess.multiLineTextInputStyle}
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
                  onChange={(e, value) => {
                    console.log(value);
                  }}
                />
              </div>
              <div style={clasess.multiLineContainer}>
                <GomakeTextInput
                  multiline={6}
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
