import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore, AlertType } from '@/src/app/store/uiStore';

const icons: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-500" />,
  error: <XCircle size={18} className="text-red-500" />,
  warning: <AlertCircle size={18} className="text-yellow-500" />,
  info: <Info size={18} className="text-blue-500" />,
};

const styles: Record<AlertType, string> = {
  success: 'border-green-100 bg-white',
  error: 'border-red-100 bg-white',
  warning: 'border-yellow-100 bg-white',
  info: 'border-blue-100 bg-white',
};

export const ToastContainer: React.FC = () => {
  const { alerts, removeAlert } = useUIStore();

  return (
    <div className="fixed right-4 top-4 z-[9999] flex flex-col gap-2">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className={`flex min-w-[300px] items-start gap-3 rounded-xl border p-4 shadow-lg ${styles[alert.type]}`}
        >
          {icons[alert.type]}
          <p className="flex-1 text-sm text-neutral-700">{alert.message}</p>
          <button onClick={() => removeAlert(alert.id)} className="text-neutral-300 hover:text-neutral-500">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
