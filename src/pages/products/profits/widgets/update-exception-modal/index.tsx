import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { profitsState } from "../../store/profits";
import { useRecoilValue } from "recoil";
import { useExceptions } from "../exceptions/use-exception";

const UpdateExceptionModal = () => {
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
        openModal={profitsStateValue?.openUpdateExceptionModal}
        modalTitle={t("products.profits.exceptions.updateException")}
        onClose={profitsStateValue?.onCloseUpdateExceptionModal}
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
          placeholder={profitsStateValue?.selectedProfitException.type}
          disabled={true}
          style={{
            border: "0px",
            background: "#fff",
            borderRadius: 4,
          }}
        />
        <div style={{ marginTop: 20 }}>
          {profitsStateValue?.selectedProfitException.type === "machine" ? (
            <div key="machine">
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectMachine")}
              </div>
              <GoMakeAutoComplate
                options={machincesStateValue}
                placeholder={profitsStateValue?.selectedProfitException.name}
                disabled={true}
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                }}
              />
            </div>
          ) : profitsStateValue?.selectedProfitException.type === "product" ? (
            <div key="product">
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectProduct")}
              </div>
              <GoMakeAutoComplate
                options={productsStateValue}
                placeholder={profitsStateValue?.selectedProfitException.name}
                disabled={true}
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                }}
              />
            </div>
          ) : profitsStateValue?.selectedProfitException.type === "client" ? (
            <div key="client">
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectClient")}
              </div>
              <GoMakeAutoComplate
                options={clientTypesStateValue}
                placeholder={profitsStateValue?.selectedProfitException.name}
                disabled={true}
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                }}
              />
            </div>
          ) : profitsStateValue?.selectedProfitException.type ===
            "parameter" ? (
            <div key="parameter">
              <div style={clasess.selectTypeStyle}>
                {t("products.profits.exceptions.selectParameter")}
              </div>
              <GoMakeAutoComplate
                options={parametersStateValue}
                placeholder={profitsStateValue?.selectedProfitException.name}
                disabled={true}
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                }}
              />
              <div
                key={`priceListParameterId-${profitsStateValue?.state?.priceListParameterId}`}
                style={{ marginTop: 20 }}
              >
                <div style={clasess.selectTypeStyle}>
                  {t("products.profits.exceptions.SelectValueNameOfParameter")}
                </div>
                <GoMakeAutoComplate
                  options={profitsStateValue?.state?.priceListParameter?.values}
                  placeholder={
                    profitsStateValue?.selectedProfitException.parameter
                  }
                  disabled={true}
                  style={{
                    border: "0px",
                    background: "#fff",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ) : null}
          <div>
            {profitsStateValue?.selectedProfitException?.exceptionType && (
              <div key="exceptionType" style={{ marginTop: 20 }}>
                <div style={clasess.selectTypeStyle}>
                  {t("products.profits.exceptions.selectScopeOfChange")}
                </div>
                <GoMakeAutoComplate
                  options={[
                    { label: "Additional", value: 0 },
                    // { label: "NewBase", value: 1 },
                    { label: "EditBase", value: 2 },
                  ]}
                  placeholder={
                    profitsStateValue?.selectedProfitException?.exceptionType
                  }
                  onChange={(e: any, item: any) => {
                    profitsStateValue?.onChangeState("additionalProfit", null);
                    profitsStateValue?.onChangeState(
                      "exceptionType",
                      item?.value
                    );
                  }}
                  style={{
                    border: "0px",
                    background: "#fff",
                    borderRadius: 4,
                  }}
                />
                {profitsStateValue?.selectedProfitException?.item
                  ?.exceptionType === 0 ? (
                  <div>
                    <div style={{ marginTop: 20 }}>
                      <div style={clasess.selectTypeStyle}>
                        {t("products.profits.exceptions.additionalProfit")}
                      </div>
                    </div>
                    <GomakeTextInput
                      type="number"
                      placeholder={
                        profitsStateValue?.selectedProfitException
                          ?.selectedAdditional ||
                        t("products.profits.exceptions.additionalProfit")
                      }
                      onChange={(e: any) => {
                        profitsStateValue?.onChangeState(
                          "additionalProfit",
                          e.target.value
                        );
                      }}
                      style={{
                        border: "0px",
                        background: "#fff",
                        borderRadius: 4,
                        height: 40,
                      }}
                    />
                  </div>
                ) : null}
                <div style={clasess.btnContainer}>
                  <GomakePrimaryButton
                    style={{ height: 40 }}
                    onClick={profitsStateValue?.updateException}
                  >
                    {t("products.profits.exceptions.updateException")}
                  </GomakePrimaryButton>
                </div>
                <div style={clasess.btnContainer}>
                  <GomakePrimaryButton
                    style={clasess.btnDelete}
                    onClick={profitsStateValue.onOpenDeleteExceptionProfitModal}
                  >
                    {t("products.profits.exceptions.deleteException")}
                  </GomakePrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </GoMakeModal>
      <GoMakeDeleteModal
        title={t("products.profits.exceptions.deleteExceptionProfit")}
        yesBtn={t("materials.buttons.delete")}
        openModal={profitsStateValue.openDeleteExceptionProfitModal}
        onClose={profitsStateValue.onCloseDeleteExceptionProfitModal}
        // subTitle={subTitle}
        onClickDelete={() =>
          profitsStateValue.deleteExceptionProfit(
            profitsStateValue?.selectedProfitException?.id
          )
        }
      />
    </>
  );
};
export { UpdateExceptionModal };
