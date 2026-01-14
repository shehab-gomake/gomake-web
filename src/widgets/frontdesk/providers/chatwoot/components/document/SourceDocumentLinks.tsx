/**
 * SourceDocumentLinks Component
 *
 * Renders source document links with consistent styling.
 * Replaces duplicate implementations across components.
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  renderDocumentTypeForSourceDocumentNumber,
  renderURLDocumentType,
} from "@/widgets/settings-documenting/documentDesign/enums/document-type";
import { SourceDocumentInfo } from "../../types/document.types";

interface SourceDocumentLinksProps {
  /** Array of source documents */
  sourceDocuments: SourceDocumentInfo[];
  /** Maximum number of documents to display (default: all) */
  maxDisplay?: number;
  /** Show "X more" count for hidden documents */
  showMoreCount?: boolean;
  /** Display style: 'inline' for horizontal, 'list' for vertical */
  layout?: "inline" | "list";
  /** Link color */
  linkColor?: string;
  /** Font size */
  fontSize?: string;
  /** Neutral color function for "more" text */
  neutralColor?: (shade: number) => string;
}

export const SourceDocumentLinks: React.FC<SourceDocumentLinksProps> = ({
  sourceDocuments,
  maxDisplay,
  showMoreCount = true,
  layout = "inline",
  linkColor = "var(--theme-secondary-400, #5859a8)",
  fontSize = "0.75rem",
  neutralColor,
}) => {
  const { t } = useTranslation();

  if (!sourceDocuments || sourceDocuments.length === 0) {
    return null;
  }

  const documentsToShow = maxDisplay
    ? sourceDocuments.slice(0, maxDisplay)
    : sourceDocuments;
  const remainingCount = maxDisplay
    ? Math.max(0, sourceDocuments.length - maxDisplay)
    : 0;

  const getMoreTextColor = neutralColor?.(600) || "#4B5563";

  if (layout === "list") {
    return (
      <Box>
        {documentsToShow.map((item, index) => (
          <a
            key={`${item.documentId}-${index}`}
            href={renderURLDocumentType(
              item.sourceDocumentType as any,
              item.documentId
            )}
            onClick={(e) => e.stopPropagation()}
            style={{
              cursor: "pointer",
              color: linkColor,
              textDecoration: "none",
              fontSize,
              display: "block",
              marginBottom: index < documentsToShow.length - 1 ? "2px" : "0",
            }}
          >
            {t(
              renderDocumentTypeForSourceDocumentNumber(
                item.sourceDocumentType as any
              )
            )}
            : {item.documentNumber}
          </a>
        ))}
        {showMoreCount && remainingCount > 0 && (
          <Typography
            variant="caption"
            sx={{
              color: getMoreTextColor,
              fontSize: "0.7rem",
              fontStyle: "italic",
              display: "block",
            }}
          >
            +{remainingCount} more
          </Typography>
        )}
      </Box>
    );
  }

  // Inline layout
  return (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center" }}
    >
      {documentsToShow.map((item, index) => (
        <a
          key={`${item.documentId}-${index}`}
          href={renderURLDocumentType(
            item.sourceDocumentType as any,
            item.documentId
          )}
          onClick={(e) => e.stopPropagation()}
          style={{
            cursor: "pointer",
            color: linkColor,
            textDecoration: "none",
            fontSize,
            marginRight: index < documentsToShow.length - 1 ? "4px" : "0",
          }}
        >
          {t(
            renderDocumentTypeForSourceDocumentNumber(
              item.sourceDocumentType as any
            )
          )}
          : {item.documentNumber}
        </a>
      ))}
      {showMoreCount && remainingCount > 0 && (
        <Typography
          variant="caption"
          sx={{
            color: getMoreTextColor,
            fontSize: "0.7rem",
            fontStyle: "italic",
          }}
        >
          +{remainingCount} more
        </Typography>
      )}
    </Box>
  );
};
