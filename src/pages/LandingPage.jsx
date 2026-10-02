import { Link } from 'react-router-dom';
import { TrendingUp, Shield, BarChart3, ArrowRight, CheckCircle, Zap, PieChart, Lock } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Visualize your finances with beautiful, interactive charts and insights.' },
  { icon: Shield, title: 'Bank-Level Security', desc: 'JWT authentication, bcrypt hashing, and secure OTP-based password recovery.' },
  { icon: Zap, title: 'Real-time Tracking', desc: 'Instantly track every income and expense with full filtering and search.' },
  { icon: PieChart, title: 'Category Insights', desc: 'Understand your spending patterns with detailed category breakdowns.' },
];

const benefits = [
  'Track income & expenses in one place',
  'Filter, search & sort transactions',
  'Monthly overview charts',
  'Secure password reset via OTP',
  'Responsive on all devices',
  'Full CRUD with validation',
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', overflowX: 'hidden' }}>
      {/* Gradient orbs */}
      <div style={{
        position: 'fixed', top: -200, left: -200,
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: -100, right: -100,
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10, 15, 30, 0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.4)',
        padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#f1f5f9' }}>FinanceFlow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/signin" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 18px', fontSize: 13 }}>
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 18px', fontSize: 13 }}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 28,
          }}>
            <Zap size={13} color="#3b82f6" />
            <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>Practical 9 — Full Stack Finance App</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900,
            color: '#f1f5f9', lineHeight: 1.1, marginBottom: 20,
            letterSpacing: '-1.5px',
          }}>
            Manage Your Finances
            <br />
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              With Clarity
            </span>
          </h1>

          <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            FinanceFlow helps you track income, manage expenses, and understand your financial health — all in one beautiful, secure platform.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: 15 }}>
              Start Tracking Free <ArrowRight size={16} />
            </Link>
            <Link to="/signin" className="btn-secondary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: 15 }}>
              Sign In
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: '0 24px 60px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16, maxWidth: 700, margin: '0 auto',
          }}>
            {[
              { value: '100%', label: 'Secure Auth' },
              { value: 'Real-time', label: 'Data Sync' },
              { value: '∞', label: 'Transactions' },
              { value: 'Free', label: 'Forever' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', marginBottom: 12, letterSpacing: '-0.5px' }}>
              Everything you need
            </h2>
            <p style={{ color: '#64748b', fontSize: 16 }}>Built with production-grade architecture</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card glass-card-hover" style={{ padding: '28px' }}>
                <div style={{
                  width: 44, height: 44,
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16, border: '1px solid rgba(59,130,246,0.2)',
                }}>
                  <Icon size={22} color="#3b82f6" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{
            maxWidth: 700, margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
            border: '1px solid rgba(59,130,246,0.2)', borderRadius: 24, padding: '48px 40px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Lock size={24} color="white" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 12, letterSpacing: '-0.5px' }}>
              Built for College Practical 9
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
              Demonstrates React, Node.js, Express, MongoDB, JWT, and REST APIs in a real-world application.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 36, textAlign: 'left' }}>
              {benefits.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={15} color="#10b981" />
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{b}</span>
                </div>
              ))}
            </div>
            <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 28px', fontSize: 14 }}>
              Create Free Account <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(51, 65, 85, 0.4)',
          padding: '24px', textAlign: 'center',
          color: '#475569', fontSize: 13,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={12} color="white" />
            </div>
            <span style={{ fontWeight: 700, color: '#64748b' }}>FinanceFlow</span>
          </div>
          <p>© 2024 FinanceFlow. Built for Practical 9 · React + Node.js + MongoDB</p>
        </footer>
      </div>
    </div>
  );
}
