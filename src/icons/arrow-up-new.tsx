import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const ArrowUpNewIcon = (props: any) => {
  const { color } = props;
  const { primarySecondaryBlend } = useGomakeTheme();
  const strokeColor = color || primarySecondaryBlend(400);
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12.5L10 7.5L15 12.5"
        stroke={strokeColor}
        stroke-width="1.67"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { ArrowUpNewIcon };
