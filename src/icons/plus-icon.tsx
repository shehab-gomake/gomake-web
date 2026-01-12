import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const PlusNewIcon = () => {
  const { primaryColor } = useGomakeTheme();
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0003 4.1665V15.8332M4.16699 9.99984H15.8337"
        stroke={primaryColor(500)}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { PlusNewIcon };
