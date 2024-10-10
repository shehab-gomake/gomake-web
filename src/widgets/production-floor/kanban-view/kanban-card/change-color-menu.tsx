import { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { adaptMarginLeft } from "@/utils/adapter";

interface ContextMenuProps {
  options: { label: string; onClick: (e?) => void; icon?: React.ReactNode }[];
  position: { x: number; y: number };
  onClose: () => void;
  dir: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  options,
  position,
  onClose,
  dir,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <Stack
      ref={menuRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        backgroundColor: "white",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
        borderRadius: "8px",
        zIndex: 1000,
      }}
    >
      {options.map((option, index) => (
        <div
          key={index}
          onClick={option.onClick}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            padding: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: hoveredIndex === index ? "#f0f0f0" : "transparent",
          }}
        >
          <span style={{ ...adaptMarginLeft(dir, 10) }}>{option.label}</span>
          {option.icon}
        </div>
      ))}
    </Stack>
  );
};

export { ContextMenu };
