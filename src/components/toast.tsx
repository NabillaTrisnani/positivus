"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

type ToastProps = {
    type: ToastType;
    message: string;
    /** Auto-dismiss delay in ms. Set to 0 to disable. Default: 4000 */
    duration?: number;
    /** Called after the toast finishes its exit animation. */
    onClose?: () => void;
};

const variants: Record<
    ToastType,
    { accent: string; icon: typeof CheckCircle2 }
> = {
    success: { accent: "bg-green", icon: CheckCircle2 },
    error: { accent: "bg-red-400", icon: XCircle },
};

export default function Toast({
    type,
    message,
    duration = 4000,
    onClose,
}: ToastProps) {
    const [leaving, setLeaving] = useState(false);
    const { accent, icon: Icon } = variants[type];

    function dismiss() {
        setLeaving(true);
    }

    useEffect(() => {
        if (duration <= 0) return;
        const timer = setTimeout(dismiss, duration);
        return () => clearTimeout(timer);
    }, [duration]);

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            onAnimationEnd={() => leaving && onClose?.()}
            className={`
                fixed top-5 right-5 z-50
                flex items-center gap-3
                min-w-[280px] max-w-sm
                pl-3 pr-2 py-3
                bg-white text-black font-medium
                border border-black rounded-2xl
                shadow-[4px_4px_0_0_#191a23]
                ${leaving ? "animate-toast-out" : "animate-toast-in"}
            `}
        >
            <span
                className={`grid place-items-center shrink-0 size-9 rounded-xl border-2 border-black ${accent}`}
            >
                <Icon className="size-5" strokeWidth={2.5} />
            </span>

            <p className="flex-1 text-sm leading-snug">{message}</p>

            <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss notification"
                className="grid place-items-center shrink-0 size-7 rounded-lg text-black/60 hover:text-black hover:bg-gray transition-colors"
            >
                <X className="size-4" strokeWidth={2.5} />
            </button>
        </div>
    );
}
