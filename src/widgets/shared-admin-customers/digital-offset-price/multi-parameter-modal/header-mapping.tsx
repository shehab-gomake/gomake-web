import { FONT_FAMILY } from "@/utils/font-family";

const HeaderMapping = ({ item, index }) => {
  return (
    <div
      style={{
        minWidth: index == 0 ? "50%" : "25%",
        maxWidth: index == 0 ? "50%" : "25%",
        textAlign: "left",
        ...FONT_FAMILY.Lexend(500, 12),
      }}
    >
      {item?.parameterName}
    </div>
  );
};
export { HeaderMapping };
