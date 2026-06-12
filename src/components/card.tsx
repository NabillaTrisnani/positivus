export default function Card({
    className = "",
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className={`border border-solid border-black rounded-3xl shadow-[0px_5px_0px_0px_#191A23] ${className}`}>
            {children}
        </div>
    )
}