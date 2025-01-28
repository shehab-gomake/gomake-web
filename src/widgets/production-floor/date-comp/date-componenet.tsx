import { FONT_FAMILY } from "@/utils/font-family";

const DateTimeProductionFloorComponent = ({ dateString }: { dateString: string }) => {
  const date = new Date(dateString);

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const formattedDate = date.toLocaleDateString([], { month: '2-digit', day: '2-digit' });

  return (
    <div style={{ ...FONT_FAMILY.Inter(600, 14), color: "#475467", width: "max-content" }}>
      {time} | {formattedDate}
    </div>
  );
};

export { DateTimeProductionFloorComponent };
