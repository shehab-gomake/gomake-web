import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useSetRecoilState } from "recoil";
import { profitsState } from "./store/profits";
import { useProfits } from "./use-profits";
import { useEffect } from "react";
import { SelectAction } from "./widgets/select-action";
import { ProductList } from "./widgets/products-list";
import { PricingList } from "./widgets/pricing-list/pricing-list";

("./widgets/price-list-widget");
export default function Profits() {
  const setProfitsState = useSetRecoilState<any>(profitsState);
  const {
    allActions,
    selectedAction,
    tabelHeaders,
    tabelRows,
    onChangeSelectedAction,
    t,
  } = useProfits();
  useEffect(() => {
    setProfitsState({
      allActions,
      selectedAction,
      onChangeSelectedAction,
      t,
    });
  }, [allActions, selectedAction, onChangeSelectedAction, t]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("products.profits.admin.title")} />
      <SelectAction />
      <ProductList />
      <PricingList tableHeaders={tabelHeaders} tableRows={tabelRows} />
    </AdminAuthLayout>
  );
}
