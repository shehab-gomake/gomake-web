import { FONT_FAMILY } from "@/utils/font-family";

const DateTimeProductionFloorComponent = ({
  dateString,
}: {
  dateString: string;
}) => {
  const date = new Date(dateString);

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
      }}
    >
      {formattedDate} <br /> {time}
    </div>
  );
};

export { DateTimeProductionFloorComponent };
