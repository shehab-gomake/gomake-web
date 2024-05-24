// const MachineIcon = (props: any) => {
//   return (
//     <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M17.25 4.67188V5.75H17.9688C18.9219 5.75 19.836 6.12863 20.5099 6.80259C21.1839 7.47654 21.5625 8.39063 21.5625 9.34375V14.7344C21.5625 15.4016 21.2975 16.0414 20.8257 16.5132C20.3539 16.985 19.7141 17.25 19.0469 17.25H17.9688V18.3281C17.9688 18.9953 17.7037 19.6352 17.2319 20.1069C16.7602 20.5787 16.1203 20.8438 15.4531 20.8438H7.54688C6.87969 20.8438 6.23983 20.5787 5.76806 20.1069C5.29629 19.6352 5.03125 18.9953 5.03125 18.3281V17.25H3.95312C3.28594 17.25 2.64608 16.985 2.17431 16.5132C1.70254 16.0414 1.4375 15.4016 1.4375 14.7344V9.34375C1.4375 8.39063 1.81613 7.47654 2.49009 6.80259C3.16404 6.12863 4.07813 5.75 5.03125 5.75H5.75V4.67188C5.75 4.00469 6.01504 3.36483 6.48681 2.89306C6.95858 2.42129 7.59844 2.15625 8.26562 2.15625H14.7344C15.4016 2.15625 16.0414 2.42129 16.5132 2.89306C16.985 3.36483 17.25 4.00469 17.25 4.67188ZM7.1875 4.67188V5.75H15.8125V4.67188C15.8125 4.38594 15.6989 4.11171 15.4967 3.90953C15.2945 3.70734 15.0203 3.59375 14.7344 3.59375H8.26562C7.97969 3.59375 7.70546 3.70734 7.50328 3.90953C7.30109 4.11171 7.1875 4.38594 7.1875 4.67188ZM6.46875 18.3281C6.46875 18.6141 6.58234 18.8883 6.78453 19.0905C6.98671 19.2927 7.26094 19.4062 7.54688 19.4062H15.4531C15.7391 19.4062 16.0133 19.2927 16.2155 19.0905C16.4177 18.8883 16.5312 18.6141 16.5312 18.3281V14.0156C16.5312 13.7297 16.4177 13.4555 16.2155 13.2533C16.0133 13.0511 15.7391 12.9375 15.4531 12.9375H7.54688C7.26094 12.9375 6.98671 13.0511 6.78453 13.2533C6.58234 13.4555 6.46875 13.7297 6.46875 14.0156V18.3281ZM17.9688 15.8125H19.0469C19.3328 15.8125 19.607 15.6989 19.8092 15.4967C20.0114 15.2945 20.125 15.0203 20.125 14.7344V9.34375C20.125 8.77188 19.8978 8.22343 19.4935 7.81905C19.0891 7.41468 18.5406 7.1875 17.9688 7.1875H5.03125C4.45938 7.1875 3.91093 7.41468 3.50655 7.81905C3.10218 8.22343 2.875 8.77188 2.875 9.34375V14.7344C2.875 15.0203 2.98859 15.2945 3.19078 15.4967C3.39296 15.6989 3.66719 15.8125 3.95312 15.8125H5.03125V14.0156C5.03125 13.3484 5.29629 12.7086 5.76806 12.2368C6.23983 11.765 6.87969 11.5 7.54688 11.5H15.4531C16.1203 11.5 16.7602 11.765 17.2319 12.2368C17.7037 12.7086 17.9688 13.3484 17.9688 14.0156V15.8125Z" fill="white" />
//       {
//       props?.isAdmin && <g transform="translate(11, 11) scale(0.5)">
//         <path fill="#8283be" d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
//         <path fill="#8283be" d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
//       </g>
//       }
//     </svg>
//   );
// };

// export { MachineIcon };

const MachineIcon = (props: any) => {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.25 4.67188V5.75H17.9688C18.9219 5.75 19.836 6.12863 20.5099 6.80259C21.1839 7.47654 21.5625 8.39063 21.5625 9.34375V14.7344C21.5625 15.4016 21.2975 16.0414 20.8257 16.5132C20.3539 16.985 19.7141 17.25 19.0469 17.25H17.9688V18.3281C17.9688 18.9953 17.7037 19.6352 17.2319 20.1069C16.7602 20.5787 16.1203 20.8438 15.4531 20.8438H7.54688C6.87969 20.8438 6.23983 20.5787 5.76806 20.1069C5.29629 19.6352 5.03125 18.9953 5.03125 18.3281V17.25H3.95312C3.28594 17.25 2.64608 16.985 2.17431 16.5132C1.70254 16.0414 1.4375 15.4016 1.4375 14.7344V9.34375C1.4375 8.39063 1.81613 7.47654 2.49009 6.80259C3.16404 6.12863 4.07813 5.75 5.03125 5.75H5.75V4.67188C5.75 4.00469 6.01504 3.36483 6.48681 2.89306C6.95858 2.42129 7.59844 2.15625 8.26562 2.15625H14.7344C15.4016 2.15625 16.0414 2.42129 16.5132 2.89306C16.985 3.36483 17.25 4.00469 17.25 4.67188ZM7.1875 4.67188V5.75H15.8125V4.67188C15.8125 4.38594 15.6989 4.11171 15.4967 3.90953C15.2945 3.70734 15.0203 3.59375 14.7344 3.59375H8.26562C7.97969 3.59375 7.70546 3.70734 7.50328 3.90953C7.30109 4.11171 7.1875 4.38594 7.1875 4.67188ZM6.46875 18.3281C6.46875 18.6141 6.58234 18.8883 6.78453 19.0905C6.98671 19.2927 7.26094 19.4062 7.54688 19.4062H15.4531C15.7391 19.4062 16.0133 19.2927 16.2155 19.0905C16.4177 18.8883 16.5312 18.6141 16.5312 18.3281V14.0156C16.5312 13.7297 16.4177 13.4555 16.2155 13.2533C16.0133 13.0511 15.7391 12.9375 15.4531 12.9375H7.54688C7.26094 12.9375 6.98671 13.0511 6.78453 13.2533C6.58234 13.4555 6.46875 13.7297 6.46875 14.0156V18.3281ZM17.9688 15.8125H19.0469C19.3328 15.8125 19.607 15.6989 19.8092 15.4967C20.0114 15.2945 20.125 15.0203 20.125 14.7344V9.34375C20.125 8.77188 19.8978 8.22343 19.4935 7.81905C19.0891 7.41468 18.5406 7.1875 17.9688 7.1875H5.03125C4.45938 7.1875 3.91093 7.41468 3.50655 7.81905C3.10218 8.22343 2.875 8.77188 2.875 9.34375V14.7344C2.875 15.0203 2.98859 15.2945 3.19078 15.4967C3.39296 15.6989 3.66719 15.8125 3.95312 15.8125H5.03125V14.0156C5.03125 13.3484 5.29629 12.7086 5.76806 12.2368C6.23983 11.765 6.87969 11.5 7.54688 11.5H15.4531C16.1203 11.5 16.7602 11.765 17.2319 12.2368C17.7037 12.7086 17.9688 13.3484 17.9688 14.0156V15.8125Z" fill="white" />
      {
        props?.isAdmin && <g transform="translate(11, 11) scale(0.5)">
          <path fill="white" d="M20.91 11.1198C20.91 16.0098 17.36 20.5898 12.51 21.9298C12.18 22.0198 11.82 22.0198 11.49 21.9298C6.63996 20.5898 3.08997 16.0098 3.08997 11.1198V6.72979C3.08997 5.90979 3.70998 4.97979 4.47998 4.66979L10.05 2.38982C11.3 1.87982 12.71 1.87982 13.96 2.38982L19.53 4.66979C20.29 4.97979 20.92 5.90979 20.92 6.72979L20.91 11.1198Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 12.5V15.5" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      }
    </svg>
  );
};

export { MachineIcon };