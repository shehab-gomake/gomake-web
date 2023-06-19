import { CustomerAuthLayout } from "@/layouts";
import { LoginWidget } from "@/widgets";
import { NewQoute } from "@/widgets/home";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <CustomerAuthLayout>
      <NewQoute />
    </CustomerAuthLayout>
  );
}
