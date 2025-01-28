import { FONT_FAMILY } from "@/utils/font-family";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DescreptionWidget = ({ desciption }: { desciption: string }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldTruncate = desciption.length > 50;
  const displayedText = isExpanded || !shouldTruncate ? desciption : `${desciption.slice(0, 50)}...`;


  return (
    <div style={{ ...FONT_FAMILY.Inter(600, 14), color: "#475467", minWidth: "250px" }}>
      {displayedText}
      {shouldTruncate && (
        <span onClick={toggleDescription} style={{ color: "#2E3092", cursor: "pointer" }}>
          {isExpanded ? `${t("sales.quote.showLess")} :` : `${t("sales.quote.showMore")} :`}
        </span>
      )}
    </div>
  );
};

export { DescreptionWidget };
