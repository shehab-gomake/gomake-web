import { CustomerAuthLayout } from "@/layouts";
import { Permissions } from "@/components/CheckPermission/enum";

import { HomePageComponentForAdmin } from "@/pages-components/admin/home/home";

export default function Home() {
  return (
    <CustomerAuthLayout>
      <HomePageComponentForAdmin isAdmin={false} />
    </CustomerAuthLayout>
  );
}
