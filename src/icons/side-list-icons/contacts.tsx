import { IIconProps } from "@/components/icons/interface";
const ContactsIcon = ({ width, height, color }: IIconProps) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 21.5V19.5C22 17.6362 20.7252 16.0701 19 15.626M15.5 3.79076C16.9659 4.38415 18 5.82131 18 7.5C18 9.17869 16.9659 10.6159 15.5 11.2092M17 21.5C17 19.6362 17 18.7044 16.6955 17.9693C16.2895 16.9892 15.5108 16.2105 14.5307 15.8045C13.7956 15.5 12.8638 15.5 11 15.5H8C6.13623 15.5 5.20435 15.5 4.46927 15.8045C3.48915 16.2105 2.71046 16.9892 2.30448 17.9693C2 18.7044 2 19.6362 2 21.5M13.5 7.5C13.5 9.70914 11.7091 11.5 9.5 11.5C7.29086 11.5 5.5 9.70914 5.5 7.5C5.5 5.29086 7.29086 3.5 9.5 3.5C11.7091 3.5 13.5 5.29086 13.5 7.5Z"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export { ContactsIcon };
