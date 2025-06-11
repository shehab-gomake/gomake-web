import { CustomerAuthLayout } from "@/layouts";
import { HomePageComponentForAdmin } from "@/pages-components/admin/home/home";
import { useMediaQuery } from "@mui/material";

export default function Home() {
  const isMobileScreen = useMediaQuery("(max-width:768px)");

  return (
    <CustomerAuthLayout
      staticPageTitle={"Gomake"}
      className={`custom-scrollbar`}
      backgroundColor={"#f6f6f6"}
    >
      <HomePageComponentForAdmin isMobileScreen={isMobileScreen} />
    </CustomerAuthLayout>
  );
}
