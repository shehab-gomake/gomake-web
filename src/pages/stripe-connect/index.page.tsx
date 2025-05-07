import dynamic from "next/dynamic";

const StripeConnectWidget = dynamic(() => import("@/widgets/stripe-connect/stripe-connect"), {
  ssr: false,
});

export default function StripeConnectPage() {
  return (
    <div>
      <StripeConnectWidget />
    </div>
  );
}
