import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Wallet, Plus, ArrowUpRight,
  ArrowDownRight, Target, BarChart3, Clock, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import TransactionModal from '../components/TransactionModal';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#84cc16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1e293b', border: '1px solid rgba(51,65,85,0.7)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
        <p style={{ color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SummaryCard = ({ label, value, icon: Icon, gradient, change, sub }) => (
  <div className="glass-card" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: gradient, borderRadius: '50%', opacity: 0.1 }} />
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ width: 34, height: 34, background: gradient, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color="white" />
      </div>
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 4, letterSpacing: '-0.5px' }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: '#64748b' }}>{sub}</div>}
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchDashboard = async () => {
    try {
      const { data: res } = await dashboardService.getSummary();
      if (res.success) setData(res.data);
    } catch {
      toast.error('Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={36} color="#3b82f6" style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>Loading your dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isEmpty = !data || (data.totalIncome === 0 && data.totalExpense === 0);

  return (
    <div style={{ maxWidth: 1300 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
            Welcome back, {user?.username}! 👋
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            {data?.currentMonth} {data?.currentYear} Financial Overview
          </p>
        </div>
        <button id="dashboard-add-btn" onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {isEmpty ? (
        /* Empty State */
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(59,130,246,0.2)' }}>
            <BarChart3 size={36} color="#3b82f6" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>No transactions yet</h3>
          <p style={{ color: '#64748b', fontSize: 14, maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Start tracking your finances by adding your first income or expense transaction.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ justifyContent: 'center' }}>
            <Plus size={16} /> Add First Transaction
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <SummaryCard
              label="Total Balance"
              value={formatCurrency(data.totalBalance)}
              icon={Wallet}
              gradient="linear-gradient(135deg, #3b82f6, #8b5cf6)"
              sub="All time net"
            />
            <SummaryCard
              label="Total Income"
              value={formatCurrency(data.totalIncome)}
              icon={TrendingUp}
              gradient="linear-gradient(135deg, #10b981, #059669)"
              sub="All time"
            />
            <SummaryCard
              label="Total Expenses"
              value={formatCurrency(data.totalExpense)}
              icon={TrendingDown}
              gradient="linear-gradient(135deg, #f43f5e, #e11d48)"
              sub="All time"
            />
            <SummaryCard
              label={`${data.currentMonth} Savings`}
              value={formatCurrency(data.monthSavings)}
              icon={Target}
              gradient={data.monthSavings >= 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f43f5e, #e11d48)'}
              sub="This month net"
            />
          </div>

          {/* Month Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(16, 185, 129, 0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.2)', flexShrink: 0 }}>
                <ArrowUpRight size={20} color="#10b981" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{data.currentMonth} Income</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>{formatCurrency(data.monthIncome)}</div>
              </div>
            </div>
            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(244, 63, 94, 0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244,63,94,0.2)', flexShrink: 0 }}>
                <ArrowDownRight size={20} color="#f43f5e" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{data.currentMonth} Expenses</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#f43f5e' }}>{formatCurrency(data.monthExpense)}</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 24 }}>
            {/* Monthly Chart */}
            {data.monthlyChart && data.monthlyChart.length > 0 && (
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>6-Month Overview</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.monthlyChart} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.4)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Category Pie Chart */}
            {data.expensesByCategory && data.expensesByCategory.length > 0 && (
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>{data.currentMonth} Expenses by Category</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={data.expensesByCategory} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                        {data.expensesByCategory.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: '#1e293b', border: '1px solid rgba(51,65,85,0.7)', borderRadius: 10, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {data.expensesByCategory.slice(0, 6).map((cat, i) => (
                      <div key={cat._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>{cat._id}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{formatCurrency(cat.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          {data.recentTransactions && data.recentTransactions.length > 0 && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} color="#64748b" /> Recent Transactions
                </h3>
                <Link to="/transactions" style={{ color: '#3b82f6', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.recentTransactions.map((tx) => (
                  <div key={tx._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: 10, border: '1px solid rgba(51,65,85,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36,
                        background: tx.type === 'income' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                        borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {tx.type === 'income' ? <ArrowUpRight size={16} color="#10b981" /> : <ArrowDownRight size={16} color="#f43f5e" />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{tx.description}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{tx.category} · {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: tx.type === 'income' ? '#10b981' : '#f43f5e' }}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchDashboard(); }}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
