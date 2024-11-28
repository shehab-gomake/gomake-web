const EditModalIcon = (props: any) => {
    return (
        <svg width={props.width || "34"} height={props.height || "34"} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.584 2.83594H12.7507C5.66732 2.83594 2.83398 5.66927 2.83398 12.7526V21.2526C2.83398 28.3359 5.66732 31.1693 12.7507 31.1693H21.2507C28.334 31.1693 31.1673 28.3359 31.1673 21.2526V18.4193" stroke="#344054" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M22.7237 4.27747L11.5603 15.4408C11.1353 15.8658 10.7103 16.7016 10.6253 17.3108L10.0162 21.575C9.78948 23.1191 10.8803 24.1958 12.4245 23.9833L16.6886 23.3741C17.2836 23.2891 18.1195 22.8641 18.5587 22.4391L29.722 11.2758C31.6486 9.34914 32.5553 7.1108 29.722 4.27747C26.8886 1.44414 24.6503 2.3508 22.7237 4.27747Z" stroke="#344054" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21.123 5.88281C22.0722 9.26865 24.7214 11.9178 28.1214 12.8811" stroke={props.color || "#344054"} stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

export { EditModalIcon };