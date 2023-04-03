import { CustomerAuthLayout } from "@/layouts";
import { useTranslation } from "react-i18next";

export default function Materials() {
  const { t } = useTranslation();

  return (
    <CustomerAuthLayout>
    <div>materials</div>
    </CustomerAuthLayout>
  );
}
