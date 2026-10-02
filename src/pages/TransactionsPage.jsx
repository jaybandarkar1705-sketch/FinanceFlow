import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services';
import toast from 'react-hot-toast';
import TransactionModal from '../components/TransactionModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import {
  Plus, Search, Filter, SortAsc, SortDesc, Edit2, Trash2,
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, X, Loader2,
  ArrowUpDown, ReceiptText,
} from 'lucide-react';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [deleteTx, setDeleteTx] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v !== '') params[k] = v; });
      const { data } = await transactionService.getAll(params);
      if (data.success) {
        setTransactions(data.data);
        setPagination(data.pagination);
      }
    } catch {
      toast.error('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value, page: 1 }));
  };

  const handleSort = (field) => {
    setFilters((p) => ({
      ...p,
      sortBy: field,
      sortOrder: p.sortBy === field && p.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', type: '', startDate: '', endDate: '', minAmount: '', maxAmount: '', sortBy: 'date', sortOrder: 'desc', page: 1, limit: 10 });
  };

  const activeFilterCount = [filters.type, filters.startDate, filters.endDate, filters.minAmount, filters.maxAmount].filter(Boolean).length;

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <ArrowUpDown size={13} color="#475569" />;
    return filters.sortOrder === 'asc' ? <SortAsc size={13} color="#3b82f6" /> : <SortDesc size={13} color="#3b82f6" />;
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Transactions</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{pagination.total} total records</p>
        </div>
        <button id="add-transaction-btn" onClick={() => { setEditTx(null); setShowModal(true); }} className="btn-primary">
          <Plus size={15} /> Add Transaction
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              id="tx-search"
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search transactions..."
              className="form-input"
              style={{ paddingLeft: 36, height: 38, fontSize: 13 }}
            />
          </div>

          {/* Type Filter */}
          <select
            id="tx-type-filter"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="form-input"
            style={{ width: 140, height: 38, fontSize: 13 }}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Toggle Filters */}
          <button
            id="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters || activeFilterCount > 0 ? 'btn-primary' : 'btn-secondary'}
            style={{ height: 38, padding: '0 14px', fontSize: 13, position: 'relative' }}
          >
            <Filter size={14} /> Filters
            {activeFilterCount > 0 && (
              <span style={{ background: '#f43f5e', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -6, right: -6 }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="btn-secondary" style={{ height: 38, padding: '0 12px', fontSize: 13 }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, paddingTop: 14, borderTop: '1px solid rgba(51,65,85,0.5)' }}>
            <div>
              <label className="form-label" style={{ fontSize: 11 }}>Start Date</label>
              <input id="filter-start-date" type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} className="form-input" style={{ height: 36, fontSize: 12 }} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 11 }}>End Date</label>
              <input id="filter-end-date" type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} className="form-input" style={{ height: 36, fontSize: 12 }} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 11 }}>Min Amount (₹)</label>
              <input id="filter-min-amount" type="number" value={filters.minAmount} onChange={(e) => handleFilterChange('minAmount', e.target.value)} placeholder="0" className="form-input" style={{ height: 36, fontSize: 12 }} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 11 }}>Max Amount (₹)</label>
              <input id="filter-max-amount" type="number" value={filters.maxAmount} onChange={(e) => handleFilterChange('maxAmount', e.target.value)} placeholder="999999" className="form-input" style={{ height: 36, fontSize: 12 }} />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: 11 }}>Per Page</label>
              <select id="filter-limit" value={filters.limit} onChange={(e) => handleFilterChange('limit', e.target.value)} className="form-input" style={{ height: 36, fontSize: 12 }}>
                {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n} per page</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: 12 }}>
            <Loader2 size={24} color="#3b82f6" style={{ animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#64748b', fontSize: 14 }}>Loading...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ width: 56, height: 56, background: 'rgba(59,130,246,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(59,130,246,0.2)' }}>
              <ReceiptText size={24} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>No transactions found</h3>
            <p style={{ color: '#64748b', fontSize: 13 }}>
              {filters.search || filters.type || filters.startDate ? 'Try adjusting your filters.' : 'Add your first transaction to get started.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
                    {[
                      { label: 'Description', field: 'description', width: '25%' },
                      { label: 'Type', field: 'type', width: '12%' },
                      { label: 'Category', field: null, width: '15%' },
                      { label: 'Amount', field: 'amount', width: '15%' },
                      { label: 'Date', field: 'date', width: '15%' },
                      { label: 'Actions', field: null, width: '18%' },
                    ].map(({ label, field, width }) => (
                      <th
                        key={label}
                        onClick={() => field && handleSort(field)}
                        style={{
                          padding: '12px 16px', textAlign: 'left',
                          fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px',
                          width, cursor: field ? 'pointer' : 'default',
                          userSelect: 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {label}
                          {field && <SortIcon field={field} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr
                      key={tx._id}
                      style={{
                        borderBottom: i < transactions.length - 1 ? '1px solid rgba(51,65,85,0.3)' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(30,41,59,0.4)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{tx.description}</div>
                        {tx.notes && <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{tx.notes.slice(0, 40)}{tx.notes.length > 40 ? '...' : ''}</div>}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={tx.type === 'income' ? 'income-badge' : 'expense-badge'}>
                          {tx.type === 'income' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 12, color: '#94a3b8', background: 'rgba(30,41,59,0.6)', padding: '3px 8px', borderRadius: 5, border: '1px solid rgba(51,65,85,0.4)' }}>
                          {tx.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: tx.type === 'income' ? '#10b981' : '#f43f5e' }}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{formatDate(tx.date)}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            id={`edit-tx-${tx._id}`}
                            onClick={() => { setEditTx(tx); setShowModal(true); }}
                            style={{
                              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                              borderRadius: 7, padding: '6px 10px', cursor: 'pointer', color: '#3b82f6',
                              display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            id={`delete-tx-${tx._id}`}
                            onClick={() => setDeleteTx(tx)}
                            style={{
                              background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
                              borderRadius: 7, padding: '6px 10px', cursor: 'pointer', color: '#f43f5e',
                              display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '14px 16px', borderTop: '1px solid rgba(51,65,85,0.4)', gap: 8, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 12, color: '#64748b', marginRight: 'auto' }}>
                  Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <button
                  id="prev-page-btn"
                  onClick={() => handleFilterChange('page', pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', opacity: !pagination.hasPrevPage ? 0.4 : 1 }}
                >
                  <ChevronLeft size={15} /> Prev
                </button>
                <span style={{ fontSize: 13, color: '#94a3b8', padding: '6px 12px', background: 'rgba(59,130,246,0.1)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.2)', fontWeight: 700 }}>
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  id="next-page-btn"
                  onClick={() => handleFilterChange('page', pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', opacity: !pagination.hasNextPage ? 0.4 : 1 }}
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <TransactionModal
          transaction={editTx}
          onClose={() => { setShowModal(false); setEditTx(null); }}
          onSuccess={() => { setShowModal(false); setEditTx(null); fetchTransactions(); }}
        />
      )}

      {deleteTx && (
        <DeleteConfirmModal
          transaction={deleteTx}
          onClose={() => setDeleteTx(null)}
          onConfirm={async () => {
            try {
              await transactionService.delete(deleteTx._id);
              toast.success('Transaction deleted!');
              setDeleteTx(null);
              fetchTransactions();
            } catch {
              toast.error('Failed to delete transaction.');
            }
          }}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
