import { ComponentName } from "@/components";
import {HeaderTitle, WidgetName} from "@/widgets";
import { useTranslation } from "react-i18next";
import {HeaderFilter} from "@/pages/materials/additions/header-filter";
import {Table} from "@/widgets/table/table";
import {CustomerAuthLayout} from "@/layouts";

export default function Home() {
  const { t } = useTranslation();

  return (
      <CustomerAuthLayout>
          <HeaderTitle title={t("customers.title")} />
         
      </CustomerAuthLayout>
  );
}
