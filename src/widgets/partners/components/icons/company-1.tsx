const TiraIcon = (props: any) => {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <circle cx="20" cy="20" r="20" fill="url(#pattern0)"/>
        <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use  xlinkHref="#image0_8679_68823" transform="scale(0.0125)"/>
        </pattern>
        <image id="image0_8679_68823" width="80" height="80" xlinkHref="data:image/png;base64,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"/>
        </defs>
        </svg>
    );
  };
  
  export { TiraIcon };
  