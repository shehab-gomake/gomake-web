import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const MinusIcon = (props: any) => {
  const { color } = props;
  const { secondColor } = useGomakeTheme();
  const stroke = color || secondColor(500);
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.16699 9.99984H15.8337"
        stroke={stroke}
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { MinusIcon };
