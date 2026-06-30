"use client";

import { Eye, EyeOff, Search } from "lucide-react";

export default function Input({
    className = "",
    value = "",
    onChange = () => { },
    label = "",
    type = "text",
    isPassword = false,
    togglePassword = () => { },
    isSearch = false,
    disabled = false,
}: {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    type?: string;
    isPassword?: boolean;
    togglePassword?: () => void;
    isSearch?: boolean;
    disabled?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-black">
                {label}
            </label>
            {
                isPassword ? (
                    <div className="flex">
                        <input
                            type={type}
                            className={`border-l border-y border-solid border-black rounded-l-[14px] py-2 px-4 text-base outline-none ${className}`}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        <button
                            type="button"
                            className={`border-r border-y border-solid border-black rounded-r-[14px] py-2 px-4 text-base ${className}`}
                            onClick={togglePassword}
                        >
                            {type === "password" ? <Eye /> : <EyeOff />}
                        </button>
                    </div>
                ) : isSearch ? (
                    <div className="flex">
                        <div
                            className={`border-l border-y border-solid border-black rounded-l-[14px] py-2 px-4 text-base ${className}`}
                        >
                            <Search />
                        </div>
                        <input
                            type="search"
                            className={`border-r border-y border-solid border-black rounded-r-[14px] py-2 pr-4 text-base outline-none ${className}`}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </div>
                ) : (
                    <input
                        type={type}
                        className={`border border-solid border-black rounded-[14px] py-2 px-4 text-base w-full outline-none ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                    />
                )
            }
        </div>
    )
}