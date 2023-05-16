import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useSetRecoilState } from "recoil";
import { profitsState } from "./store/profits";
import { useProfits } from "./use-profits";
import { useEffect } from "react";
import { SelectAction } from "./widgets/select-action";
import { ProductList } from "./widgets/products-list";
import { PricingList } from "./widgets/pricing-list/pricing-list";
import { useStyle } from "./style";
import { Exceptions } from "./widgets/exceptions/exceptions";

export default function Profits() {
  const setProfitsState = useSetRecoilState<any>(profitsState);
  const {
    allActions,
    selectedAction,
    tabelPricingHeaders,
    tabelExceptionsHeaders,
    tabelExceptionsRows,
    actionProfits,
    machincesStateValue,
    productsStateValue,
    parametersStateValue,
    clientTypesStateValue,
    openAddExceptionModal,
    onChangeSelectedAction,
    onCloseAddExceptionModal,
    onOpenAddExceptionModal,
    t,
  } = useProfits();
  useEffect(() => {
    setProfitsState({
      allActions,
      selectedAction,
      tabelPricingHeaders,
      tabelExceptionsHeaders,
      tabelExceptionsRows,
      actionProfits,
      machincesStateValue,
      productsStateValue,
      parametersStateValue,
      clientTypesStateValue,
      openAddExceptionModal,
      onChangeSelectedAction,
      onCloseAddExceptionModal,
      onOpenAddExceptionModal,
      t,
    });
  }, [
    allActions,
    selectedAction,
    tabelPricingHeaders,
    tabelExceptionsHeaders,
    tabelExceptionsRows,
    actionProfits,
    machincesStateValue,
    productsStateValue,
    parametersStateValue,
    clientTypesStateValue,
    openAddExceptionModal,
    onChangeSelectedAction,
    onCloseAddExceptionModal,
    onOpenAddExceptionModal,
    t,
  ]);
  const { clasess } = useStyle();
  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.profits.admin.title")} />
        <SelectAction />
        <ProductList />
        <div style={clasess.pricingAndExceptionsCointaner}>
          <div style={clasess.pricingCointaner}>
            <PricingList
              tableHeaders={tabelPricingHeaders}
              tableRows={actionProfits?.actionProfitRowsMapped}
            />
          </div>
          <div style={clasess.exceptionsCointaner}>
            <Exceptions
              tableHeaders={tabelExceptionsHeaders}
              tableRows={tabelExceptionsRows}
            />
          </div>
        </div>
      </div>
    </AdminAuthLayout>
  );
}
