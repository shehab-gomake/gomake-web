import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import React from "react";
import { useTranslation } from "react-i18next";

interface CloseOrderNoteProps {
  note: string;
}

const CloseOrderNote: React.FC<CloseOrderNoteProps> = ({ note }) => {
  const { t } = useTranslation();
  const { primaryColor ,grayColor} = useGomakeTheme();
  if (!note) return null;

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "4px 10px",
        backgroundColor: primaryColor(50),
        borderRadius: "6px",
        color: grayColor(700),
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
