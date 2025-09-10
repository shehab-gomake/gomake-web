import { FONT_FAMILY } from "@/utils/font-family";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";

const DateTimeProductionFloorComponent = ({
  dateString,
  style,
}: {
  dateString: string;
  style?: React.CSSProperties;
}) => {
  const date = new Date(dateString);
  const { GetProductionFontSizeFromPreferences } = usePrintHousePreferences();
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Specify 'en-GB' locale to ensure DD/MM format
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div
      style={{
        ...FONT_FAMILY.Inter(500, 15),
        color: "#000000",
        width: "max-content",
        placeSelf: "flex-start",
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: "bolder",
        fontSize: GetProductionFontSizeFromPreferences(),
        ...style,
      }}
    >
      {formattedDate} <br /> {time}
    </div>
  );
};

export { DateTimeProductionFloorComponent };
