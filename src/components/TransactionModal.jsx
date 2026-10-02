import { useState, useEffect } from 'react';
import { transactionService } from '../services';
import toast from 'react-hot-toast';
import { X, TrendingUp, TrendingDown, DollarSign, Tag, Calendar, FileText, Save } from 'lucide-react';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
  expense: ['Food & Dining', 'Shopping', 'Transportation', 'Housing', 'Entertainment', 'Health & Medical', 'Education', 'Travel', 'Utilities', 'Personal Care', 'Other'],
};

const initialForm = {
  type: 'expense',
  description: '',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
};

export default function TransactionModal({ onClose, onSuccess, transaction = null }) {
  const isEdit = !!transaction;
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        description: transaction.description,
        amount: String(transaction.amount),
        category: transaction.category,
        date: new Date(transaction.date).toISOString().split('T')[0],
        notes: transaction.notes || '',
      });
    }
  }, [transaction]);

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) errs.amount = 'Enter a valid positive amount';
    if (!form.category) errs.category = 'Please select a category';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setForm((p) => ({ ...p, type: value, category: '' }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (isEdit) {
        await transactionService.update(transaction._id, payload);
        toast.success('Transaction updated!');
      } else {
        await transactionService.create(payload);
        toast.success('Transaction added!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  const categories = CATEGORIES[form.type] || [];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
      padding: '16px',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(51,65,85,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4, borderRadius: 6, transition: 'color 0.2s' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          {/* Type Toggle */}
          <div style={{ marginBottom: 18 }}>
            <label className="form-label">Transaction Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {['income', 'expense'].map((t) => (
                <label
                  key={t}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                    border: `2px solid ${form.type === t ? (t === 'income' ? '#10b981' : '#f43f5e') : 'rgba(51,65,85,0.5)'}`,
                    background: form.type === t ? (t === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)') : 'rgba(22,32,50,0.5)',
                    transition: 'all 0.2s',
                  }}
                >
                  <input type="radio" name="type" value={t} checked={form.type === t} onChange={handleChange} style={{ display: 'none' }} />
                  {t === 'income' ? <TrendingUp size={16} color={form.type === 'income' ? '#10b981' : '#64748b'} /> : <TrendingDown size={16} color={form.type === 'expense' ? '#f43f5e' : '#64748b'} />}
                  <span style={{ fontSize: 13, fontWeight: 600, color: form.type === t ? (t === 'income' ? '#10b981' : '#f43f5e') : '#94a3b8', textTransform: 'capitalize' }}>
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Description *</label>
            <div style={{ position: 'relative' }}>
              <FileText size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                id="tx-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Monthly salary, Grocery shopping..."
                className="form-input"
                style={{ paddingLeft: 36 }}
              />
            </div>
            {errors.description && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 3 }}>{errors.description}</p>}
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Amount (₹) *</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                id="tx-amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="form-input"
                style={{ paddingLeft: 36 }}
              />
            </div>
            {errors.amount && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 3 }}>{errors.amount}</p>}
          </div>

          {/* Category */}
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Category *</label>
            <div style={{ position: 'relative' }}>
              <Tag size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', zIndex: 1 }} />
              <select
                id="tx-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: 36, appearance: 'none', cursor: 'pointer' }}
              >
                <option value="">Select a category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {errors.category && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 3 }}>{errors.category}</p>}
          </div>

          {/* Date */}
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Date *</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                id="tx-date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: 36 }}
              />
            </div>
            {errors.date && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 3 }}>{errors.date}</p>}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Notes (optional)</label>
            <textarea
              id="tx-notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows={2}
              className="form-input"
              style={{ resize: 'vertical', minHeight: 60 }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button
              type="submit"
              id="tx-submit"
              className="btn-primary"
              disabled={loading}
              style={{ flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
              <Save size={15} /> {loading ? 'Saving...' : (isEdit ? 'Update' : 'Add Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
