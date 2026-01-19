import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const ExpandIcon = (props: any) => {
    const { primaryColor } = useGomakeTheme();
    const strokeColor = props.stroke || primaryColor(500);
    
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={strokeColor}><path d="M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z" /></svg>
    );
};

export { ExpandIcon };