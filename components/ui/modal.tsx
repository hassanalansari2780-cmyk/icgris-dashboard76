'use client';
import React from 'react';
import clsx from 'clsx';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export default function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={clsx("w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900", className)}>
          <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
            <h3 className="text-sm font-semibold">{title}</h3>
            <button onClick={onClose} className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
          </div>
          <div className="p-4">{children}</div>
          {footer ? <div className="border-t border-gray-100 p-3 dark:border-gray-800">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
