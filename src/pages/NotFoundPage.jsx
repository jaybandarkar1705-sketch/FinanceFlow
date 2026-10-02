import { Link } from 'react-router-dom';
import { TrendingUp, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      {/* Background orb */}
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="animate-slide-up" style={{ position: 'relative' }}>
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>FinanceFlow</span>
          </Link>
        </div>

        {/* 404 Display */}
        <div style={{
          fontSize: 'clamp(80px, 15vw, 140px)', fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 24, letterSpacing: '-4px',
        }}>
          404
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>
          Page Not Found
        </h1>
        <p style={{ color: '#64748b', fontSize: 15, maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            <Home size={15} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft size={15} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
