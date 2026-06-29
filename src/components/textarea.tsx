"use client";

export default function Textarea({
    className = "",
    value = "",
    onChange = () => { },
    label = "",
    rows = 4,
    disabled = false,
}: {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    rows?: number;
    disabled?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-black">
                {label}
            </label>
            {
                <textarea
                    className={`border border-solid border-black rounded-[14px] py-2 px-4 text-base w-full outline-none ${className}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows}
                    disabled={disabled}
                >
                    {value}
                </textarea>
            }
        </div>
    )
}