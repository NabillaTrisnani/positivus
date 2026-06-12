export default function Button({
    className = "",
    children,
    onClick = () => { },
}: {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            className={`rounded-[14px] hover:cursor-pointer ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}