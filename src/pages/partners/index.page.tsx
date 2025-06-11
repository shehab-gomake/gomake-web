import { CustomerAuthLayout } from "@/layouts";
import { PartnersComponent } from "@/widgets/partners/partners";

export default function Home() {
  return (
    <CustomerAuthLayout staticPageTitle={"partners"}>
      <PartnersComponent />
    </CustomerAuthLayout>
  );
}
