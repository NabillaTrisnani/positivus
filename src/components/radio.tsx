"use client";

type RadioOption = {
    label: string;
    value: string;
};

export default function Radio({
    value = "",
    onChange = () => { },
    label = "",
    options = [],
    disabled = false,
}: {
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    options?: RadioOption[];
    disabled?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-black">
                {label}
            </label>

            <div className="flex gap-4 mt-1">
                {options.map((opt) => (
                    <label
                        key={opt.value}
                        className={`flex items-center gap-2 text-sm text-black ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        {/* hidden native radio */}
                        <input
                            type="radio"
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onChange(opt.value)}
                            disabled={disabled}
                            className="sr-only"
                        />

                        {/* custom radio visual */}
                        <div
                            className="w-6 h-6 rounded-full border-1 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: "#191A23" }}
                        >
                            {value === opt.value && (
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: "#B9FF66" }}
                                />
                            )}
                        </div>

                        {opt.label}
                    </label>
                ))}
            </div>
        </div>
    );
}