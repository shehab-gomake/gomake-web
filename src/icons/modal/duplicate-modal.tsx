const DuplicateModalIcon = (props: any) => {
    return (
        <svg width={props.width || "34"} height={props.height || "34"} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.6673 18.2776V24.2276C22.6673 29.1859 20.684 31.1693 15.7257 31.1693H9.77565C4.81732 31.1693 2.83398 29.1859 2.83398 24.2276V18.2776C2.83398 13.3193 4.81732 11.3359 9.77565 11.3359H15.7257C20.684 11.3359 22.6673 13.3193 22.6673 18.2776Z" stroke="#344054" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M31.1673 9.7776V15.7276C31.1673 20.6859 29.184 22.6693 24.2257 22.6693H22.6673V18.2776C22.6673 13.3193 20.684 11.3359 15.7257 11.3359H11.334V9.7776C11.334 4.81927 13.3173 2.83594 18.2757 2.83594H24.2257C29.184 2.83594 31.1673 4.81927 31.1673 9.7776Z"
                stroke={props.color || "#344054"} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    );
};

export { DuplicateModalIcon };