import { CustomerAuthLayout } from "@/layouts";
import { HomePageComponentForAdmin } from "@/pages-components/admin/home/home";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <CustomerAuthLayout>
      <HomePageComponentForAdmin isAdmin={false} />
    </CustomerAuthLayout>
  );
}
