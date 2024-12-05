import React from "react";
import { Button } from "@mui/material";

import { NextArrowIcon, PrevArrowIcon } from "../icons";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";

interface GoMakePaginationProps {
  page: number;
  totalPages: number;
  visiblePages: (number | string)[];
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handlePageClick: (pageNumber: number) => void;
}

const GoMakePagination: React.FC<GoMakePaginationProps> = ({
  page,
  totalPages,
  visiblePages,
  handlePrevPage,
  handleNextPage,
  handlePageClick,
}) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "16px",
      }}
    >
      {/* Prev Button */}
      <Button
        onClick={handlePrevPage}
        disabled={page === 1}
        variant="outlined"
        size="small"
        style={{
          display: "flex",
          padding: "8px 12px",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px",
          borderRadius: "8px",
          border: "1px solid #D0D5DD",
          color: page === 1 ? "#B0B0B0" : "#344054", // Change color when disabled

          fontStyle: "normal",
          lineHeight: "20px",
          ...FONT_FAMILY.Inter(600, 14),
          textTransform: "none" as "none",
        }}
      >
        <PrevArrowIcon color={page === 1 ? "#B0B0B0" : "#344054"} />
        {t("Previous")}
      </Button>

      {/* Page Numbers */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {visiblePages.map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span key={index} style={{ padding: "0 8px" }}>
              ...
            </span>
          ) : (
            <Button
              key={index}
              onClick={() => handlePageClick(pageNumber as number)}
              size="small"
              style={{
                display: "flex",
                width: "40px",
                height: "40px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                background: page === pageNumber ? "#F9FAFB" : "transparent",
                color: page === pageNumber ? "#000" : "#808080", // Gray for non-selected
                border: "none",
              }}
            >
              {pageNumber}
            </Button>
          )
        )}
      </div>

      {/* Next Button */}
      <Button
        onClick={handleNextPage}
        disabled={page === totalPages}
        variant="outlined"
        size="small"
        style={{
          display: "flex",
          padding: "8px 12px",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px",
          borderRadius: "8px",
          border: "1px solid #D0D5DD",
          color: page === totalPages ? "#B0B0B0" : "#344054",
          fontStyle: "normal",
          lineHeight: "20px",
          ...FONT_FAMILY.Inter(600, 14),
          textTransform: "none" as "none",
        }}
      >
        {t("Next")}
        <NextArrowIcon color={page === totalPages ? "#B0B0B0" : "#344054"} />
      </Button>
    </div>
  );
};

export default GoMakePagination;
