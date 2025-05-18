const LinkMessageComponent = ({ payload }) => (
    <a
        href={payload.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-sky-600 hover:text-sky-800"
    >
        {payload.label}
    </a>
);

export default LinkMessageComponent;