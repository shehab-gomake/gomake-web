import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useSetRecoilState } from "recoil";
import { profitsState } from "./store/profits";
import { useProfits } from "./use-profits";
import { useEffect } from "react";
import { HeaderFilter } from "./widgets/header-filter";
import { ProductTable } from "./widgets/products-table";
import PriceListWidget from "./widgets/pricing-list-widget";

("./widgets/price-list-widget");
export default function Profits() {
  const setProfitsState = useSetRecoilState<any>(profitsState);
  const { allActions, selectedAction, onChangeSelectedAction, t } =
    useProfits();
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
      <HeaderFilter />
      <ProductTable />
      <PriceListWidget />
    </AdminAuthLayout>
  );
}
