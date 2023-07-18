import { AdminAuthLayout } from "@/layouts";
import HomePageComponentForAdmin from "@/pages-components/admin/home/home";

export default function Home() {
  return (
    <AdminAuthLayout>
      <HomePageComponentForAdmin />
    </AdminAuthLayout>
  );
}
