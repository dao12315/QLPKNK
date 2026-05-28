import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Ghost, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/src/shared/components/ui/Button';

interface StatusPageProps {
  code: '404' | '403';
}

const StatusPage: React.FC<StatusPageProps> = ({ code }) => {
  const navigate = useNavigate();

  const data = {
    '404': {
      title: 'Page Not Found',
      desc: "Oops! The page you're looking for doesn't exist or has been moved.",
      icon: <Ghost size={120} className="status-icon" />,
    },
    '403': {
      title: 'Access Denied',
      desc: "Sorry, you don't have permission to access this area.",
      icon: <AlertTriangle size={120} className="status-icon-danger" />,
    }
  };

  const content = data[code];

  return (
    <div className="status-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="status-card"
      >
        <div className="icon-wrapper">
          {content.icon}
        </div>
        <h1 className="error-code">{code}</h1>
        <h2 className="title">{content.title}</h2>
        <p className="desc">{content.desc}</p>
        
        <div className="actions">
          <Button variant="outline" onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={18} />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .status-page { 
          min-height: 100vh; 
          background: var(--neutral-50); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 2rem;
        }
        .status-card {
          max-width: 32rem;
          width: 100%;
          background: white;
          padding: 4rem 2rem;
          border-radius: 2.5rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--neutral-100);
          text-align: center;
        }
        .icon-wrapper { margin-bottom: 2rem; }
        .status-icon { color: var(--neutral-200); }
        .status-icon-danger { color: #fee2e2; }
        
        .error-code { 
          font-size: 6rem; 
          font-weight: 900; 
          color: var(--neutral-900); 
          line-height: 1;
          letter-spacing: -0.05em;
          margin-bottom: 1rem;
        }
        .title { font-size: 1.75rem; font-weight: 800; color: var(--neutral-900); margin-bottom: 0.5rem; }
        .desc { color: var(--neutral-500); margin-bottom: 2.5rem; line-height: 1.6; }
        
        .actions { display: flex; flex-direction: column; gap: 1rem; }
        @media (min-width: 640px) { .actions { flex-direction: row; justify-content: center; } }
        .btn-back { display: flex; align-items: center; gap: 0.5rem; }
      `}} />
    </div>
  );
};

export default StatusPage;
