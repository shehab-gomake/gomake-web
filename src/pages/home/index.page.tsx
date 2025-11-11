import { CustomerAuthLayout } from "@/layouts";
import { HomePageComponentForAdmin } from "@/pages-components/admin/home/home";
import { useMediaQuery } from "@mui/material";
import { withThemeOverride, useThemeComponent } from "@/contexts/theme";

function Home() {
  const isMobileScreen = useMediaQuery("(max-width:768px)");

  // Get theme-aware version of HomePageComponentForAdmin
  const ThemedHomePageComponent = useThemeComponent(
    "HomePageComponent",
    HomePageComponentForAdmin
  );

  return (
    <CustomerAuthLayout
      staticPageTitle={"Gomake"}
      className={`custom-scrollbar`}
      backgroundColor={"var(--theme-bg-body, #f6f6f6)"}
    >
      <ThemedHomePageComponent isMobileScreen={isMobileScreen} />
    </CustomerAuthLayout>
  );
}

// Wrap the entire page with theme override support
export default withThemeOverride("HomePage", Home);
