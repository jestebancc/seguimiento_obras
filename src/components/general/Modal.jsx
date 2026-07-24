import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Handle ESC key or other native close requests to sync React state
    const handleClose = () => {
      onClose();
    };

    // Fallback for click outside (backdrop light dismiss) for unsupported browsers
    const handleBackdropClick = (event) => {
      if ('closedBy' in HTMLDialogElement.prototype) return; // Native support handles it

      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );

      if (!isDialogContent) {
        dialog.close();
      }
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleBackdropClick);

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  return (
    <dialog 
      ref={dialogRef} 
      className="custom-modal"
      closedby="any" // Native light dismiss support
      aria-labelledby="modal-title-heading"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="modal-title-heading" className="modal-title">{title}</h3>
          <button className="btn btn-ghost btn-icon-only" onClick={onClose} title="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </dialog>
  );
}
