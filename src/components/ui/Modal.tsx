"use client";

import { Fragment, ReactNode, forwardRef, HTMLAttributes, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      children,
      size = "md",
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      className,
      ...props
    },
    ref
  ) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (open) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        document.body.style.overflow = "hidden";
        contentRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Escape" && closeOnEscape) {
            onClose();
          }
          if (e.key === "Tab") {
            const focusableElements = contentRef.current?.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements && focusableElements.length > 0) {
              const firstElement = focusableElements[0] as HTMLElement;
              const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
              if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
          document.body.style.overflow = "";
          previousActiveElement.current?.focus();
        };
      }
    }, [open, closeOnEscape, onClose]);

    if (!open) return null;

    const sizes = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-4xl",
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === overlayRef.current) {
        onClose();
      }
    };

    return (
      <Fragment>
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-slide-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
        >
          <div
            ref={contentRef}
            tabIndex={-1}
            className={cn(
              "w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl",
              "overflow-hidden animate-slide-up",
              sizes[size],
              className
            )}
            {...props}
          >
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-6 border-b border-slate-800">
                <div>
                  {title && (
                    <h2 id="modal-title" className="text-lg font-semibold text-slate-100">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="modal-description" className="mt-1 text-sm text-slate-400">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 flex-shrink-0"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </Button>
                )}
              </div>
            )}
            <div className="p-6">{children}</div>
          </div>
        </div>
      </Fragment>
    );
  }
);

Modal.displayName = "Modal";

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
}

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading,
}: ConfirmModalProps) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <p className="text-slate-300 mb-6">{message}</p>
    <div className="flex justify-end gap-3">
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button variant={variant === "destructive" ? "destructive" : "primary"} onClick={onConfirm} loading={loading}>
        {confirmText}
      </Button>
    </div>
  </Modal>
);