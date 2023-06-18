import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { profitsState } from "../../store/profits";
import { useRecoilValue } from "recoil";
import { useExceptions } from "../exceptions/use-exception";

const AddExceptionModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const {
    machincesStateValue,
    productsStateValue,
    parametersStateValue,
    clientTypesStateValue,
  } = useExceptions({});
  return (
    <>
      <GoMakeModal
        openModal={profitsStateValue?.openAddExceptionModal}
        modalTitle={t("products.profits.exceptions.addNewException")}
        onClose={profitsStateValue?.onCloseAddExceptionModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.selectTypeStyle}>
          {t("products.profits.exceptions.selectTypeOfException")}
        </div>
        <GoMakeAutoComplate
          options={[
            { label: "Machines", value: "machine" },
            { label: "Products", value: "product" },
            { label: "Clients", value: "client" },
            { label: "Parameters", value: "parameter" },
          ]}
          placeholder={t("products.profits.exceptions.selectTypeOfException")}
          value={profitsStateValue?.state.typeOfException || ""}
          onChange={(e: any, item: any) => {
            profitsStateValue?.setState({});
            profitsStateValue?.onChangeState("typeOfException", item?.value);
          }}
        />
        <div style={{ marginTop: 20 }}>
          {profitsStateValue?.state.typeOfException === "machine" ? (
            <div key="machine">
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectMachine")}
              </div>
              <GoMakeAutoComplate
                options={machincesStateValue}
                placeholder={t("products.profits.exceptions.selectMachine")}
                getOptionLabel={(value: any) => value?.name}
                onChange={(e: any, item: any) => {
                  profitsStateValue?.onChangeState("machine", item);
                  profitsStateValue?.onChangeState("machineId", item?.id);
                }}
              />
            </div>
          ) : profitsStateValue?.state.typeOfException === "product" ? (
            <div key="product">
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectProduct")}
              </div>
              <GoMakeAutoComplate
                options={productsStateValue}
                placeholder={t("products.profits.exceptions.selectProduct")}
                getOptionLabel={(value: any) => value?.name}
                onChange={(e: any, item: any) => {
                  profitsStateValue?.onChangeState("subProduct", item);
                  profitsStateValue?.onChangeState("subProductId", item?.id);
                }}
              />
            </div>
          ) : profitsStateValue?.state.typeOfException === "client" ? (
            <div key="client">
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectClient")}
              </div>
              <GoMakeAutoComplate
                options={clientTypesStateValue}
                placeholder={t("products.profits.exceptions.selectClient")}
                getOptionLabel={(value: any) => value?.name}
                onChange={(e: any, item: any) => {
                  profitsStateValue?.onChangeState("clientType", item);
                  profitsStateValue?.onChangeState("clientTypeId", item?.id);
                }}
              />
            </div>
          ) : profitsStateValue?.state.typeOfException === "parameter" ? (
            <div key="parameter">
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectParameter")}
              </div>
              <GoMakeAutoComplate
                options={parametersStateValue}
                placeholder={t("products.profits.exceptions.selectParameter")}
                getOptionLabel={(value: any) => value?.name}
                onChange={(e: any, item: any) => {
                  profitsStateValue?.onChangeState("priceListParameter", item);
                  profitsStateValue?.onChangeState(
                    "priceListParameterId",
                    item?.id
                  );
                }}
              />
              {profitsStateValue?.state?.priceListParameterId && (
                <div
                  key={`priceListParameterId-${profitsStateValue?.state?.priceListParameterId}`}
                  style={{ marginTop: 20 }}
                >
                  <div style={clasess.selectTypeStyle}>
                    {t(
                      "products.profits.exceptions.SelectValueNameOfParameter"
                    )}
                  </div>
                  <GoMakeAutoComplate
                    options={
                      profitsStateValue?.state?.priceListParameter
                        ?.parameterValues
                    }
                    placeholder={t(
                      "products.profits.exceptions.SelectValueNameOfParameter"
                    )}
                    getOptionLabel={(value: any) => value?.value}
                    onChange={(e: any, item: any) => {
                      profitsStateValue?.onChangeState(
                        "paramValueName",
                        item?.value
                      );
                    }}
                  />
                </div>
              )}
            </div>
          ) : null}
          <div>
            {profitsStateValue?.state?.typeOfException && (
              <div key="exceptionType" style={{ marginTop: 20 }}>
                <div style={clasess.selectTypeStyle}>
                  {t("products.profits.exceptions.selectScopeOfChange")}
                </div>
                <GoMakeAutoComplate
                  options={[
                    { label: "Additional", value: 0 },
                    { label: "NewBase", value: 1 },
                    { label: "EditBase", value: 2 },
                  ]}
                  placeholder={t(
                    "products.profits.exceptions.selectScopeOfChange"
                  )}
                  onChange={(e: any, item: any) => {
                    profitsStateValue?.onChangeState("additionalProfit", null);
                    profitsStateValue?.onChangeState(
                      "exceptionType",
                      item?.value
                    );
                  }}
                />
                {profitsStateValue?.state?.exceptionType === 0 ? (
                  <div>
                    <div style={{ marginTop: 20 }}>
                      <div style={clasess.selectTypeStyle}>
                        {t("products.profits.exceptions.additionalProfit")}
                      </div>
                    </div>
                    <GomakeTextInput
                      style={{ height: 40 }}
                      type="number"
                      placeholder={t(
                        "products.profits.exceptions.additionalProfit"
                      )}
                      onChange={(e: any) => {
                        profitsStateValue?.onChangeState(
                          "additionalProfit",
                          e.target.value
                        );
                      }}
                    />
                  </div>
                ) : null}
                <div style={clasess.btnContainer}>
                  <GomakePrimaryButton
                    style={{ height: 40 }}
                    onClick={profitsStateValue?.addedNewException}
                  >
                    {t("products.profits.exceptions.addNewException")}
                  </GomakePrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddExceptionModal };
