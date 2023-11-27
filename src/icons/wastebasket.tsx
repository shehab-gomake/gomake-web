const Wastebasket = (props: any) => {
  return (
    <svg
      width={props.width || "61"}
      height={props.height || "62"}
      viewBox="0 0 61 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.7923 10.5569C17.7923 7.74946 20.0682 5.47357 22.8757 5.47357H38.1257C40.9331 5.47357 43.209 7.74946 43.209 10.5569V15.6402H48.2661C48.2818 15.6401 48.2975 15.6401 48.3133 15.6402H53.3757C54.7794 15.6402 55.9173 16.7782 55.9173 18.1819C55.9173 19.5856 54.7794 20.7236 53.3757 20.7236H50.6589L48.4545 51.5857C48.2645 54.2459 46.051 56.3069 43.3841 56.3069H17.6172C14.9503 56.3069 12.7368 54.2459 12.5468 51.5857L10.3424 20.7236H7.62565C6.22193 20.7236 5.08398 19.5856 5.08398 18.1819C5.08398 16.7782 6.22193 15.6402 7.62565 15.6402H12.688C12.7038 15.6401 12.7195 15.6401 12.7352 15.6402H17.7923V10.5569ZM22.8757 15.6402H38.1257V10.5569H22.8757V15.6402ZM15.4387 20.7236L17.6172 51.2236H43.3841L45.5626 20.7236H15.4387ZM25.4173 25.8069C26.821 25.8069 27.959 26.9448 27.959 28.3486V43.5986C27.959 45.0023 26.821 46.1402 25.4173 46.1402C24.0136 46.1402 22.8757 45.0023 22.8757 43.5986V28.3486C22.8757 26.9448 24.0136 25.8069 25.4173 25.8069ZM35.584 25.8069C36.9877 25.8069 38.1257 26.9448 38.1257 28.3486V43.5986C38.1257 45.0023 36.9877 46.1402 35.584 46.1402C34.1803 46.1402 33.0423 45.0023 33.0423 43.5986V28.3486C33.0423 26.9448 34.1803 25.8069 35.584 25.8069Z"
        fill={props.color || "#a1a2cd"}
      />
    </svg>
  );
};

export { Wastebasket };
