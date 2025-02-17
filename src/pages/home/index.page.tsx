import { CustomerAuthLayout } from "@/layouts";
import { HomePageComponentForAdmin } from "@/pages-components/admin/home/home";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 700px)" });

  return (
    <CustomerAuthLayout
      className={`custom-scrollbar`}
      disableHeaderSideMenu={isMobileScreen}
      backgroundColor={"#f6f6f6"}
    >
      <HomePageComponentForAdmin
        isAdmin={false}
        isMobileScreen={isMobileScreen}
      />
    </CustomerAuthLayout>
  );
}
