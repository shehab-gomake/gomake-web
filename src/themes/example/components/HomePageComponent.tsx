import React from "react";

/**
 * Example Theme - HomePageComponent Override
 *
 * This demonstrates a component-level override.
 * When the 'example' theme is active, this component replaces HomePageComponentForAdmin.
 *
 * Note: You can accept the same props as the base component
 */
interface HomePageComponentProps {
  isMobileScreen?: boolean;
}

export default function ExampleHomePageComponent({
  isMobileScreen,
}: HomePageComponentProps) {
  return (
    <div
      style={{
        margin: "0 auto",
        padding: "var(--theme-spacing-xl, 32px)",
        backgroundColor: "var(--theme-bg-primary, #ffffff)",
        borderRadius: "var(--theme-radius-lg, 12px)",
        boxShadow:
          "var(--theme-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))",
        border: "2px solid var(--theme-primary-color, #6366f1)",
      }}
    >
      <h2
        style={{
          color: "var(--theme-primary-color, #6366f1)",
          fontSize: "var(--theme-font-size-xl, 20px)",
          marginBottom: "var(--theme-spacing-md, 16px)",
        }}
      >
        Custom Home Component
      </h2>

      <div
        style={{
          backgroundColor: "var(--theme-bg-secondary, #f8fafc)",
          padding: "var(--theme-spacing-lg, 24px)",
          borderRadius: "var(--theme-radius-md, 8px)",
          marginBottom: "var(--theme-spacing-md, 16px)",
        }}
      >
        <p
          style={{
            color: "var(--theme-text-primary, #0f172a)",
            fontSize: "var(--theme-font-size-base, 14px)",
            marginBottom: "var(--theme-spacing-sm, 8px)",
          }}
        >
          This is a themed component override. The original
          HomePageComponentForAdmin has been replaced with this custom version.
        </p>

        <p
          style={{
            color: "var(--theme-text-secondary, #475569)",
            fontSize: "var(--theme-font-size-sm, 12px)",
          }}
        >
          Screen size: {isMobileScreen ? "Mobile" : "Desktop"}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobileScreen ? "1fr" : "repeat(3, 1fr)",
          gap: "var(--theme-spacing-md, 16px)",
        }}
      >
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={{
              padding: "var(--theme-spacing-md, 16px)",
              backgroundColor: "var(--theme-bg-tertiary, #f1f5f9)",
              borderRadius: "var(--theme-radius-md, 8px)",
              border: "1px solid var(--theme-border-color, #e2e8f0)",
            }}
          >
            <h3
              style={{
                color: "var(--theme-secondary-color, #ec4899)",
                fontSize: "var(--theme-font-size-lg, 16px)",
                marginBottom: "var(--theme-spacing-xs, 4px)",
              }}
            >
              Card {item}
            </h3>
            <p
              style={{
                color: "var(--theme-text-muted, #94a3b8)",
                fontSize: "var(--theme-font-size-sm, 12px)",
              }}
            >
              Example content using theme variables
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
