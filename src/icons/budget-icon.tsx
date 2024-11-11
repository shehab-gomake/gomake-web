const BudgetIcon = (props: any) => {
    return (
        <svg width={props.width || "20"} height={props.height || "20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.1665 17.0832H5.83317C3.33317 17.0832 1.6665 15.8332 1.6665 12.9165V7.08317C1.6665 4.1665 3.33317 2.9165 5.83317 2.9165H14.1665C16.6665 2.9165 18.3332 4.1665 18.3332 7.08317V12.9165C18.3332 15.8332 16.6665 17.0832 14.1665 17.0832Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.5835 7.9165V12.0832" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.4165 7.9165V12.0832" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    );
};

export { BudgetIcon };