import { Loader2 } from "lucide-react";

export default function Button({
    className = "",
    children,
    onClick = () => { },
    isLoading = false,
    disabled = false,
}: {
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}) {
    return (
        <button
            className={`rounded-[14px] hover:cursor-pointer ${className}`}
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <Loader2 className="animate-spin text-black" size={24} />
            ) : children}
        </button>
    )
}