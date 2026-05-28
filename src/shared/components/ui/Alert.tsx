import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIStore, AlertType } from '@/src/app/store/uiStore';

interface AlertProps {
  id: string;
  type: AlertType;
  message: string;
  onClose: (id: string) => void;
}

const Alert: React.FC<AlertProps> = ({ id, type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-green-600" size={20} />,
    error: <XCircle className="text-red-600" size={20} />,
    warning: <AlertCircle className="text-amber-600" size={20} />,
    info: <Info className="text-blue-600" size={20} />,
  };

  const borders = {
    success: 'border-l-green-600',
    error: 'border-l-red-600',
    warning: 'border-l-amber-600',
    info: 'border-l-blue-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className={`
        flex items-center justify-between p-4 bg-white border border-neutral-100 border-l-4 rounded-2xl shadow-xl mb-3 
        min-w-[18rem] max-w-[24rem] pointer-events-auto
        ${borders[type]}
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        {icons[type]}
        <p className="text-sm font-semibold text-neutral-800">{message}</p>
      </div>
      <button 
        onClick={() => onClose(id)} 
        className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const AlertContainer = () => {
  const { alerts, removeAlert } = useUIStore();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => (
          <Alert key={alert.id} {...alert} onClose={removeAlert} />
        ))}
      </AnimatePresence>
    </div>
  );
};
