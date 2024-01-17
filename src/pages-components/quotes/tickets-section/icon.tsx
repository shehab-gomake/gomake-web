import {IIconProps} from "@/components/icons/interface";

const CardIcon = ({color}: IIconProps) => {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.99967 7.49984V1.6665L8.33301 3.33317" stroke={color || "#101020"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 1.6665L11.6667 3.33317" stroke={color || "#101020"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1.65039 10.8335H5.32539C5.64206 10.8335 5.92539 11.0085 6.06706 11.2918L7.04206 13.2418C7.32539 13.8085 7.90039 14.1668 8.53372 14.1668H11.4754C12.1087 14.1668 12.6837 13.8085 12.9671 13.2418L13.9421 11.2918C14.0837 11.0085 14.3754 10.8335 14.6837 10.8335H18.3171" stroke={color || "#101020"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.83366 4.2749C2.88366 4.70824 1.66699 6.44157 1.66699 9.9999V12.4999C1.66699 16.6666 3.33366 18.3332 7.50033 18.3332H12.5003C16.667 18.3332 18.3337 16.6666 18.3337 12.4999V9.9999C18.3337 6.44157 17.117 4.70824 14.167 4.2749" stroke={color || "#101020"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
}

export {CardIcon}