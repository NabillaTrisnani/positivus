'use client';

import { useState } from 'react';

const COLORS = [
    { name: 'Lime', value: 'green' },
    { name: 'Dark', value: 'black' },
    { name: 'Light Gray', value: 'gray' },
];

interface ColorPickerProps {
    value?: string;
    onChange?: (color: string) => void;
    label?: string;
}

export default function ColorInput({ value, onChange, label }: ColorPickerProps) {
    const [selected, setSelected] = useState(value ?? COLORS[0].value);

    const handleSelect = (color: string) => {
        setSelected(color);
        onChange?.(color);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-black mb-1">
                {label}
            </label>
            <div className="flex items-center gap-3 mb-4">
                {COLORS.map((color) => (
                    <button
                        key={color.value}
                        type="button"
                        aria-label={color.name}
                        onClick={() => handleSelect(color.value)}
                        className={`w-8 h-8 rounded-full border-2 bg-${color.value} transition-all ${selected === color.value
                            ? 'border-blue-500 scale-110'
                            : 'border-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}