import {IIconProps} from "@/components/icons/interface";

 const DownArrowIcon = ({color}: IIconProps) => {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <path d="M6 9L12 15L18 9" stroke={color || "var(--theme-primary-color, #2E3092)"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 9L12 15L18 9" stroke="black" stroke-opacity="0.2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 9L12 15L18 9" stroke="black" stroke-opacity="0.2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

export { DownArrowIcon };
