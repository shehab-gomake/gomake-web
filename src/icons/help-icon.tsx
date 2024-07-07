import { IIconProps } from "@/components/icons/interface";

const HelpIcon = (props: IIconProps) => {
    return (
        <svg width= {props.width || "22"} height={props.height || "22"} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="11" fill={ props.color || "#2E3092"}/>
        <g clip-path="url(#clip0_574_1692)">
        <path d="M9.0587 8.99992C9.21543 8.55436 9.5248 8.17866 9.932 7.93934C10.3392 7.70002 10.818 7.61254 11.2835 7.69239C11.749 7.77224 12.1712 8.01427 12.4754 8.3756C12.7796 8.73694 12.9461 9.19427 12.9454 9.66659C12.9454 10.9999 10.9454 11.6666 10.9454 11.6666M10.9987 14.3333H11.0054M17.6654 10.9999C17.6654 14.6818 14.6806 17.6666 10.9987 17.6666C7.3168 17.6666 4.33203 14.6818 4.33203 10.9999C4.33203 7.31802 7.3168 4.33325 10.9987 4.33325C14.6806 4.33325 17.6654 7.31802 17.6654 10.9999Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
        <clipPath id="clip0_574_1692">
        <rect width="16" height="16" fill="white" transform="translate(3 3)"/>
        </clipPath>
        </defs>
        </svg>
        
    );
};

export { HelpIcon };
