"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type ModalProps = {
    /** Controls visibility. When false, nothing is rendered. */
    isOpen: boolean;
    /** Called when the user dismisses the modal (backdrop, close button or Escape). */
    onClose: () => void;
    /** Optional heading shown in the modal header. */
    title?: string;
    /** Main modal content. */
    children?: React.ReactNode;
    /** Optional footer area, typically for action buttons. */
    footer?: React.ReactNode;
    /** Extra classes applied to the modal panel. */
    className?: string;
    /** Hide the top-right close button. Default: false */
    hideCloseButton?: boolean;
    /** Allow closing by clicking the backdrop. Default: true */
    closeOnBackdrop?: boolean;
};

export default function Modal({
    isOpen,
    onClose,
    title = "",
    children,
    footer,
    className = "",
    hideCloseButton = false,
    closeOnBackdrop = true,
}: ModalProps) {
    // Close on Escape and lock body scroll while the modal is open.
    useEffect(() => {
        if (!isOpen) return;

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        document.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title || undefined}
            onClick={() => closeOnBackdrop && onClose()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-modal-overlay-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    relative w-full max-w-lg max-h-[90vh] flex flex-col
                    bg-white border border-solid border-black rounded-3xl
                    shadow-[0px_5px_0px_0px_#191A23]
                    animate-modal-panel-in
                    ${className}
                `}
            >
                {(title || !hideCloseButton) && (
                    <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-4">
                        {title && (
                            <h2 className="text-2xl font-medium text-black">{title}</h2>
                        )}
                        {!hideCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close modal"
                                className="grid place-items-center shrink-0 size-9 ml-auto rounded-xl border-2 border-black text-black hover:bg-green transition-colors hover:cursor-pointer"
                            >
                                <X className="size-5" strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                )}

                <div className="px-6 py-2 overflow-y-auto text-black">{children}</div>

                {footer && (
                    <div className="flex items-center justify-end gap-3 px-6 pt-4 pb-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
