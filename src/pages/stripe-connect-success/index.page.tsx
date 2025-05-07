import dynamic from "next/dynamic";
const StripeConnectSuccessWidget = dynamic(() => import("@/widgets/stripe-connect-success/stripe-connect-success"), {
  ssr: false,
});

export default function StripeConnectSuccess() {
  return (
    <div>
      <StripeConnectSuccessWidget />
    </div>
  );
}
