import {IIconProps} from "@/components/icons/interface";

export const CubeIcon = ({width, height, color}: IIconProps) => {
  return(
      <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="vuesax/linear/3dcube">
              <g id="3dcube">
                  <path id="Vector" d="M10.7663 1.88333L16.1913 4.80833C16.8247 5.14999 16.8247 6.12499 16.1913 6.46666L10.7663 9.39166C10.283 9.64999 9.71634 9.64999 9.23301 9.39166L3.80801 6.46666C3.17467 6.12499 3.17467 5.14999 3.80801 4.80833L9.23301 1.88333C9.71634 1.62499 10.283 1.62499 10.7663 1.88333Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path id="Vector_2" d="M3.00866 8.44167L8.05033 10.9667C8.67533 11.2833 9.07533 11.925 9.07533 12.625V17.3917C9.07533 18.0833 8.35033 18.525 7.73366 18.2167L2.69199 15.6917C2.06699 15.375 1.66699 14.7333 1.66699 14.0333V9.26667C1.66699 8.575 2.39199 8.13333 3.00866 8.44167Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path id="Vector_3" d="M16.9915 8.44167L11.9498 10.9667C11.3248 11.2833 10.9248 11.925 10.9248 12.625V17.3917C10.9248 18.0833 11.6498 18.525 12.2665 18.2167L17.3081 15.6917C17.9331 15.375 18.3331 14.7333 18.3331 14.0333V9.26667C18.3331 8.575 17.6081 8.13333 16.9915 8.44167Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
          </g>
      </svg>

  );
}