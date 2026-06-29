"use client";

import { useRef, useState } from "react";

type ImageInputProps =
    | {
        multiple: true;
        onChange: (files: File[]) => void;
        label?: string;
        className?: string;
        disabled?: boolean;
    }
    | {
        multiple?: false;
        onChange: (file: File | null) => void;
        label?: string;
        className?: string;
        disabled?: boolean;
    };

export default function ImageInput({ multiple, onChange, label, className, disabled = false }: ImageInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);

        if (files.length === 0) return;

        // Generate previews
        const urls = files.map((f) => URL.createObjectURL(f));
        setPreviews(urls);

        if (multiple) {
            (onChange as (files: File[]) => void)(files);
        } else {
            (onChange as (file: File | null) => void)(files[0] ?? null);
        }
    }

    function handleRemove(index: number) {
        setPreviews((prev) => prev.filter((_, i) => i !== index));

        // Reset input supaya bisa upload file yang sama lagi
        if (inputRef.current) inputRef.current.value = "";

        if (!multiple) {
            (onChange as (file: File | null) => void)(null);
        }
    }

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium mb-1">{label}</label>
            )}

            <button
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition disabled:cursor-not-allowed disabled:border-gray-300 disabled:hover:border-gray-300"
                onClick={() => (disabled ? null : inputRef.current?.click())}
                disabled={disabled}
            >
                <p className="text-sm text-gray-500">
                    Click to upload {multiple ? "images" : "an image"}
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                className="hidden"
                onChange={handleChange}
                disabled={disabled}
            />

            {/* Preview */}
            {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {previews.map((src, i) => (
                        <div key={i} className="relative w-20 h-20">
                            <img
                                src={src}
                                alt={`preview-${i}`}
                                className="w-full h-full object-cover rounded-lg border"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(i);
                                }}
                                disabled={disabled}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}