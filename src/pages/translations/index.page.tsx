import { CustomerAuthLayout } from "@/layouts";
import { TranslationsWidget } from "@/widgets/translation-widget/translation-widget";
import { Permissions } from "../../components/CheckPermission/enum";

export default function Translations() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.TRANSLATION_ADMIN}>
        <TranslationsWidget/>
    </CustomerAuthLayout>
  );
}
