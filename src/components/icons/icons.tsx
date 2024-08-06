const RemoveIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6.375 10.6875C6.375 12.1275 7.56 13.3125 9 13.3125C10.44 13.3125 11.625 12.1275 11.625 10.6875" stroke="#D92C2C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.60758 1.5L3.89258 4.2225" stroke="#D92C2C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11.3926 1.5L14.1076 4.2225" stroke="#D92C2C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1.5 5.88745C1.5 4.49995 2.2425 4.38745 3.165 4.38745H14.835C15.7575 4.38745 16.5 4.49995 16.5 5.88745C16.5 7.49995 15.7575 7.38745 14.835 7.38745H3.165C2.2425 7.38745 1.5 7.49995 1.5 5.88745Z" stroke="#D92C2C" stroke-width="1.5" />
            <path d="M2.625 7.5L3.6825 13.98C3.9225 15.435 4.5 16.5 6.645 16.5H11.1675C13.5 16.5 13.845 15.48 14.115 14.07L15.375 7.5" stroke="#D92C2C" stroke-width="1.5" stroke-linecap="round" />
        </svg>
    );
};

const AddIcon = ({ onClick = null }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" onClick={onClick}  style={{ cursor: onClick ? "pointer" : "undefined" }}>
            <path d="M5.33325 8H10.6666" stroke="#2E3092" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 10.6666V5.33325" stroke="#2E3092" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.99992 14.6666H9.99992C13.3333 14.6666 14.6666 13.3333 14.6666 9.99992V5.99992C14.6666 2.66659 13.3333 1.33325 9.99992 1.33325H5.99992C2.66659 1.33325 1.33325 2.66659 1.33325 5.99992V9.99992C1.33325 13.3333 2.66659 14.6666 5.99992 14.6666Z" stroke="#2E3092" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

const EditIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.33325 1.3335H5.99992C2.66659 1.3335 1.33325 2.66683 1.33325 6.00016V10.0002C1.33325 13.3335 2.66659 14.6668 5.99992 14.6668H9.99992C13.3333 14.6668 14.6666 13.3335 14.6666 10.0002V8.66683" stroke="#8283BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.6933 2.0135L5.43992 7.26684C5.23992 7.46684 5.03992 7.86017 4.99992 8.14684L4.71325 10.1535C4.60659 10.8802 5.11992 11.3868 5.84659 11.2868L7.85325 11.0002C8.13325 10.9602 8.52659 10.7602 8.73325 10.5602L13.9866 5.30684C14.8933 4.40017 15.3199 3.34684 13.9866 2.0135C12.6533 0.680168 11.5999 1.10684 10.6933 2.0135Z" stroke="#8283BE" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.93994 2.7666C10.3866 4.35993 11.6333 5.6066 13.2333 6.05993" stroke="#8283BE" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    );
};

const DuplicateIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12.75 10.05V12.3C12.75 15.3 11.55 16.5 8.55 16.5H5.7C2.7 16.5 1.5 15.3 1.5 12.3V9.45C1.5 6.45 2.7 5.25 5.7 5.25H7.95" stroke="#8283BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.75 10.05H10.35C8.54995 10.05 7.94995 9.45 7.94995 7.65V5.25L12.75 10.05Z" stroke="#8283BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.69995 1.5H11.7" stroke="#8283BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.25 3.75C5.25 2.505 6.255 1.5 7.5 1.5H9.465" stroke="#8283BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.5001 6V10.6425C16.5001 11.805 15.5551 12.75 14.3926 12.75" stroke="#8283BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16.5 6H14.25C12.5625 6 12 5.4375 12 3.75V1.5L16.5 6Z" stroke="#8283BE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    );
};

const MoreIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M22.6943 12C22.6943 6.5 18.1068 2 12.4999 2C6.89292 2 2.30542 6.5 2.30542 12C2.30542 17.5 6.89292 22 12.4999 22C18.1068 22 22.6943 17.5 22.6943 12Z" fill="white" stroke="#5859A8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 8.00354V7.99456V8.00354Z" fill="white" />
            <path d="M12.5 8.00354V7.99456" stroke="#5859A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 12.0045V11.9955V12.0045Z" fill="white" />
            <path d="M12.5 12.0045V11.9955" stroke="#5859A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 16.0054V15.9964V16.0054Z" fill="white" />
            <path d="M12.5 16.0054V15.9964" stroke="#5859A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    );
};

const CloseCircleIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.16992 14.8299L14.8299 9.16992" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14.8299 14.8299L9.16992 9.16992" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

export { RemoveIcon, AddIcon, DuplicateIcon, EditIcon, MoreIcon, CloseCircleIcon };
