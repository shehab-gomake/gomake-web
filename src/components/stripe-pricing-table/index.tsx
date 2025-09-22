import React, { useEffect } from "react";
import { useStyle } from "./style";
import { createGlobalStyle } from "styled-components";

interface StripePricingTableProps {
  pricingTableId: string;
  publishableKey: string;
  clientReferenceId?: string;
  style?: React.CSSProperties;
  className?: string;
}

const StripePricingTable: React.FC<StripePricingTableProps> = ({
  pricingTableId,
  publishableKey,
  clientReferenceId,
  style,
  className,
}) => {
  const { classes } = useStyle();

  useEffect(() => {
    // Load Stripe pricing table script if not already loaded
    if (
      !document.querySelector('script[src*="stripe.com/v3/pricing-table.js"]')
    ) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/pricing-table.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const GlobalStyle = createGlobalStyle`
  stripe-pricing-table {
    display: block;
    width: 100%;
  }

  stripe-pricing-table .PricingTable-grid {
    display: grid !important;
    gap: 48px !important;
    justify-content: space-around !important;
  }
`;

  return (
    <div style={style || classes.container} className={className}>
      <GlobalStyle />
      <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={publishableKey}
        client-reference-id={clientReferenceId}
      />
    </div>
  );
};

export { StripePricingTable };
