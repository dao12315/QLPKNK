import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, onClose, onConfirm, title = 'Xác nhận', message,
  confirmLabel = 'Xác nhận', isLoading, variant = 'danger',
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm"
    footer={
      <>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Hủy</Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>{confirmLabel}</Button>
      </>
    }
  >
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={22} className="text-red-500" />
      </div>
      <div>
        <p className="font-bold text-neutral-800">{title}</p>
        <p className="mt-1 text-sm text-neutral-500">{message}</p>
      </div>
    </div>
  </Modal>
);
