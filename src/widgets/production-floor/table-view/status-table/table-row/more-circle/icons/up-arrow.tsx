import {IIconProps} from "@/components/icons/interface";

const UpArrowIcon = ({width, height, color}: IIconProps) => {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 15L12 9L6 15" stroke={color || "var(--theme-primary-color, #2E3092)"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M18 15L12 9L6 15" stroke="black" stroke-opacity="0.2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M18 15L12 9L6 15" stroke="black" stroke-opacity="0.2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

export { UpArrowIcon };
