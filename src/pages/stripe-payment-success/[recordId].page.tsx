import dynamic from "next/dynamic";
const StripePaymentSuccessWidget = dynamic(() => import("@/widgets/stripe-payment-success/stripe-payment-success"), {
  ssr: false,
});

export default function StripeConnectSuccess() {
  return (
    <div>
      <StripePaymentSuccessWidget />
    </div>
  );
}
