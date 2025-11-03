import React from "react";
import { CustomerAuthLayout } from "@/layouts";
import { useMediaQuery } from "@mui/material";
import { useThemeComponent } from "@/contexts/theme";
import { HomePageComponentForAdmin } from "@/pages-components/admin/home/home";

/**
 * Example Theme - Home Page Override
 *
 * This demonstrates a complete page-level override.
 * When the 'example' theme is active, this component replaces the base Home page.
 */
export default function ExampleHomePage() {
  const isMobileScreen = useMediaQuery("(max-width:768px)");

  // Still allow component-level overrides within the themed page
  const ThemedHomePageComponent = useThemeComponent(
    "HomePageComponent",
    HomePageComponentForAdmin
  );

  return (
    <CustomerAuthLayout
      staticPageTitle={"Example Theme - Home"}
      className={`custom-scrollbar`}
      backgroundColor={"var(--theme-bg-secondary, #f6f6f6)"}
    >
      <div
        style={{
          padding: "var(--theme-spacing-lg, 24px)",
          backgroundColor: "var(--theme-bg-primary, #ffffff)",
          borderRadius: "var(--theme-radius-lg, 12px)",
          boxShadow:
            "var(--theme-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))",
          marginBottom: "var(--theme-spacing-lg, 24px)",
        }}
      >
        <h1
          style={{
            color: "var(--theme-primary-color, #6366f1)",
            fontSize: "var(--theme-font-size-2xl, 24px)",
            marginBottom: "var(--theme-spacing-md, 16px)",
          }}
        >
          Welcome to Example Theme
        </h1>
        <p
          style={{
            color: "var(--theme-text-secondary, #475569)",
            fontSize: "var(--theme-font-size-base, 14px)",
          }}
        >
          This is a themed version of the Home page. The CSS variables defined
          in the theme are being used for colors, spacing, and other design
          tokens.
        </p>
      </div>

      <ThemedHomePageComponent isMobileScreen={isMobileScreen} />
    </CustomerAuthLayout>
  );
}
