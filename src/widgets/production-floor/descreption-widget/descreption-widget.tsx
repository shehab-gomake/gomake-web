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
    return html?.replace(/<[^>]*>/g, ' ');
  };

  const plainTextDescription = stripHtmlTags(desciption);
  const shouldTruncate = plainTextDescription?.length > 120;
  const displayedText = isExpanded || !shouldTruncate ? plainTextDescription : `${plainTextDescription?.slice(0, 120)}...`;



  return (
    <div style={{
      ...FONT_FAMILY.Inter(500, 15),
      color: "#000000",
      textAlign: "start",
      height: isExpanded ? "auto" : "42px",
      overflow: "hidden",
      position: "relative",
      lineHeight: "21px",
      display: "flex",
      flexWrap: "wrap",
    }}>
      {displayedText}
      {shouldTruncate && (
        <span onClick={toggleDescription} style={{
          color: "#2E3092",
          cursor: "pointer",
          position: isExpanded ? "relative" : "absolute",
          bottom: isExpanded ? "auto" : 0,
          right: 0,
          backgroundColor: "#ffffff",
          paddingLeft: "4px"
        }}>
          {isExpanded ? ` ${t("sales.quote.showLess")}` : ` ${t("sales.quote.showMore")}`}
        </span>
      )}
    </div>
  );
};

export { DescreptionWidget };
