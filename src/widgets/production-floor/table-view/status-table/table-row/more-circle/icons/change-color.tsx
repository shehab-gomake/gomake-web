import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const ChangeColorIcon = (props: any) => {
    const { color } = props;
    const { primarySecondaryBlend } = useGomakeTheme();
    const strokeColor = color || primarySecondaryBlend(300);
    return (
<svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 5C1 5 1.06066 4.57538 2.81802 2.81802C4.57538 1.06066 7.42462 1.06066 9.18198 2.81802C9.80462 3.44066 10.2067 4.20036 10.3881 5M1 5V2M1 5H4M11 7C11 7 10.9393 7.42462 9.18198 9.18198C7.42462 10.9393 4.57538 10.9393 2.81802 9.18198C2.19538 8.55934 1.79335 7.79964 1.61191 7M11 7V10M11 7H8" stroke={strokeColor}  stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    );
  };
  
  export { ChangeColorIcon };
  