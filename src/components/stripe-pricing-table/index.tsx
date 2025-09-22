import React, { useEffect } from "react";
import { useStyle } from "./style";
import { createGlobalStyle } from "styled-components";
import {useGomakeAxios, useGomakeRouter} from "@/hooks";

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
  const { navigate } = useGomakeRouter();
  const { callApi } = useGomakeAxios();
  const [customerSecret, setCustomerSecret] = React.useState("");
  useEffect(() => {
    getStripeCustomerPortalSession().then()
    
  }, []);
  const getStripeCustomerPortalSession = async () => {
    debugger;
    const response: any = await callApi("GET", "/v1/admin/print-houses/create-stripe-customer-portal-session");
    if (response?.success) {
      const data = response?.data?.data?.data;
      if(data?.isStripeSubscriptionActive && data?.customerPortalUrl){
        navigate(data.customerPortalUrl);
        return;
      }
      setCustomerSecret(data?.customerSecret);
    }
    if (
        !document.querySelector('script[src*="stripe.com/v3/pricing-table.js"]')
    ) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/pricing-table.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }
  
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
      {
       customerSecret && <stripe-pricing-table
            pricing-table-id={pricingTableId}
            publishable-key={publishableKey}
            customer-session-client-secret={customerSecret}
        />
      }
    </div>
  );
};

export {StripePricingTable};
