import { GoMakeAutoComplate } from "@/components";
import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";

export default function SheetPaper() {
  const { t } = useTranslation();

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.lamination.title")} />
      <GoMakeAutoComplate
        // defaultValue={value}
        // error={error}
        options={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        // style={{ ...props.style }}
        // onChange={(event: any, item: any) => onChange(item?.value)}
        placeholder="" />
    </CustomerAuthLayout>
  );
}
