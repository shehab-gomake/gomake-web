import { FONT_FAMILY } from "@/utils/font-family";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import parse from "html-react-parser";

const DescreptionWidget = ({ desciption }: { desciption: string }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const stripHtmlTags = (html: string) => {
    return html?.replace(/<[^>]*>/g, '');
  };

  const plainTextDescription = stripHtmlTags(desciption);
  const shouldTruncate = plainTextDescription?.length > 53;
  const displayedText = isExpanded || !shouldTruncate ? plainTextDescription : `${plainTextDescription?.slice(0, 53)}...`;



  return (
    <div style={{ ...FONT_FAMILY.Inter(600, 14), color: "#475467", maxWidth: "250px", minWidth: "250px" }}>
      {displayedText}
      {shouldTruncate && (
        <span onClick={toggleDescription} style={{ color: "#2E3092", cursor: "pointer" }}>
          {isExpanded ? ` ${t("sales.quote.showLess")}` : ` ${t("sales.quote.showMore")}`}
        </span>
      )}
    </div>
  );
};

export { DescreptionWidget };
