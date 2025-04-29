import { FONT_FAMILY } from "@/utils/font-family";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";

const DescriptionWidget = ({ description }: { description: string }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { GetProductionFontSizeFromPreferences } = usePrintHousePreferences();
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const stripHtmlTags = (html: string) => {
    return html?.replace(/<[^>]*>/g, " ");
  };

  const plainTextDescription = stripHtmlTags(description);
  const shouldTruncate = plainTextDescription?.length > 70;
  const displayedText =
    isExpanded || !shouldTruncate
      ? plainTextDescription
      : `${plainTextDescription?.slice(0, 70)}...`;

  return (
    <div
      style={{
        ...FONT_FAMILY.Inter(500, 15),
        color: "#000000",
        textAlign: "start",
        fontSize: GetProductionFontSizeFromPreferences(),
      }}
    >
      {displayedText}
      {shouldTruncate && (
        <span
          onClick={toggleDescription}
          style={{ color: "#2E3092", cursor: "pointer" }}
        >
          {isExpanded
            ? ` ${t("sales.quote.showLess")}`
            : ` ${t("sales.quote.showMore")}`}
        </span>
      )}
    </div>
  );
};

export { DescriptionWidget };
