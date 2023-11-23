import { FONT_FAMILY } from "@/utils/font-family";
import React, { useState } from "react";

const CharacterDetails = ({ details }) => {
  const [showAll, setShowAll] = useState(false);

  const truncatedDetails = showAll ? details : details?.slice(0, 90);

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  return (
    <div
      style={{
        height: showAll ? 100 : 74,
        overflowY: "scroll",
        borderRight: showAll ? "1px solid  #F135A3" : "none",
        padding: "16px 24px",
        color: "#000000",
        ...FONT_FAMILY.Inter(400, 14),
      }}
    >
      {truncatedDetails}
      {!showAll && ".. "}
      {details?.length > 90 && (
        <span
          onClick={showAll ? handleShowLess : handleShowMore}
          style={{
            ...FONT_FAMILY.Inter(500, 14),
            color: "#5859A8",
            textDecoration: "underLine",
            cursor: "pointer",
          }}
        >
          {showAll ? " Show Less" : "Show More"}
        </span>
      )}
    </div>
  );
};
export { CharacterDetails };
