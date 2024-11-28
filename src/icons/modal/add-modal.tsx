const AddModalIcon = (props: any) => {
    return (
        <svg width={props.width || "34"} height={props.height || "34"} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.334 17H22.6673" stroke="#344054" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17 22.6693V11.3359" stroke="#344054" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.7507 31.1693H21.2507C28.334 31.1693 31.1673 28.3359 31.1673 21.2526V12.7526C31.1673 5.66927 28.334 2.83594 21.2507 2.83594H12.7507C5.66732 2.83594 2.83398 5.66927 2.83398 12.7526V21.2526C2.83398 28.3359 5.66732 31.1693 12.7507 31.1693Z"
                stroke={props.color || "#344054"} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

export { AddModalIcon };