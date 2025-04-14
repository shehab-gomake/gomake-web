import dynamic from "next/dynamic";

const GuestsWidget = dynamic(() => import("@/widgets/guests/guests"), {
  ssr: false,
});

export default function Guests() {
  return (
    <div>
      <GuestsWidget />
    </div>
  );
}
