import { FONT_FAMILY } from "@/utils/font-family";
import { useRouter } from "next/router";

interface ITaskCategoryLabelProps {
  boardMission: any;
  textColor?: string;
  bgColor?: string;
}

const OrderJObNumbersComponent = ({
  boardMission,
  textColor,
  bgColor,
}: ITaskCategoryLabelProps) => {
  const { push } = useRouter();

  const handleOpenMission = () => {
    push(
      `/production-floor?boardMissionsId=${boardMission?.id}&productType=${boardMission?.productType}&step=stations`
    ).then();
  };

  return (
    <span
      onClick={handleOpenMission}
      style={{
        cursor: "pointer",
        padding: "0px 5px",
        display: "inline-block",
        width: "fit-content",
        minWidth: "122px",
        backgroundColor: bgColor,
        color: textColor,
        textAlign: "center",
        ...FONT_FAMILY.Inter(500, 14),
        flexShrink: 0,
        borderRadius: "var(--radius-full, 9999px)",
        border: `var(--Spacing-md, 1px) solid var(--Colors-Yellow-600, ${textColor})`,
      }}
    >
      {`${boardMission?.orderNumber} / ${boardMission?.boardMissionNumber}`}
    </span>
  );
};

export { OrderJObNumbersComponent };
