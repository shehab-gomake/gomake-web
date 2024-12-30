const DeleteModalIcon = (props: any) => {
    return (
        <svg width={props.width || "36"} height={props.height || "36"} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_3734_12679)">
                <path d="M2 9C2 4.58172 5.58172 1 10 1H26C30.4183 1 34 4.58172 34 9V25C34 29.4183 30.4183 33 26 33H10C5.58172 33 2 29.4183 2 25V9Z" fill="white" />
                <path d="M2.5 9C2.5 4.85786 5.85786 1.5 10 1.5H26C30.1421 1.5 33.5 4.85786 33.5 9V25C33.5 29.1421 30.1421 32.5 26 32.5H10C5.85786 32.5 2.5 29.1421 2.5 25V9Z" stroke="#D0D5DD" />
                <path d="M15.3333 13.0007V12.4673C15.3333 11.7206 15.3333 11.3472 15.4787 11.062C15.6065 10.8111 15.8105 10.6071 16.0613 10.4793C16.3466 10.334 16.7199 10.334 17.4667 10.334H18.5333C19.2801 10.334 19.6534 10.334 19.9387 10.4793C20.1895 10.6071 20.3935 10.8111 20.5213 11.062C20.6667 11.3472 20.6667 11.7206 20.6667 12.4673V13.0007M19.3333 16.6673V20.0007M16.6667 16.6673V20.0007M24 13.0007H12M13.3333 13.0007V20.4673C13.3333 21.5874 13.3333 22.1475 13.5513 22.5753C13.7431 22.9516 14.049 23.2576 14.4254 23.4493C14.8532 23.6673 15.4132 23.6673 16.5333 23.6673H19.4667C20.5868 23.6673 21.1468 23.6673 21.5746 23.4493C21.951 23.2576 22.2569 22.9516 22.4487 22.5753C22.6667 22.1475 22.6667 21.5874 22.6667 20.4673V13.0007" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
                <filter id="filter0_d_3734_12679" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3734_12679" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3734_12679" result="shape" />
                </filter>
            </defs>
        </svg>
    );
};

export { DeleteModalIcon };