import { FONT_FAMILY } from "@/utils/font-family";
import React from "react";
import { useTranslation } from "react-i18next";

interface CloseOrderNoteProps {
  note: string;
}

const CloseOrderNote: React.FC<CloseOrderNoteProps> = ({ note }) => {
  const { t } = useTranslation();
  if (!note) return null;

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "4px 10px",
        backgroundColor: "#ebecff",
        borderRadius: "6px",
        color: "#344054",
        alignSelf: "center",
        ...FONT_FAMILY.Inter(500, 14),
      }}
    >
      <div style={{ marginBottom: "4px", fontWeight: "bold" }}>
        {t("sales.modals.note")} : {note}
      </div>
    </div>
  );
};

export default CloseOrderNote;
