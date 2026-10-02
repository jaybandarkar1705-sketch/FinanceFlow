import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ transaction, onClose, onConfirm }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '16px',
    }}>
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: 380, padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, background: 'rgba(244,63,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(244,63,94,0.3)' }}>
          <AlertTriangle size={24} color="#f43f5e" />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Delete Transaction?</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>
          Are you sure you want to delete <strong style={{ color: '#f1f5f9' }}>{transaction.description}</strong>?
        </p>
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 24 }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            Cancel
          </button>
          <button id="confirm-delete-btn" onClick={onConfirm} className="btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
