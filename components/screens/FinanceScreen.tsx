import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Transaction, FinanceCategory, BudgetGoal } from '../../types';
import { CURRENCIES } from '../../constants';
import Icon from '../common/Icon';
import useLocalStorage from '../../hooks/useLocalStorage';

declare var Chart: any;

interface BudgetManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    budgetGoals: BudgetGoal[];
    setBudgetGoals: (goals: BudgetGoal[]) => void;
}

const BudgetManagementModal: React.FC<BudgetManagementModalProps> = ({ isOpen, onClose, budgetGoals, setBudgetGoals }) => {
    const { t } = useApp();
    const [localBudgets, setLocalBudgets] = useState<Record<FinanceCategory, string>>(() => {
        const budgetMap: Record<FinanceCategory, string> = {} as any;
        Object.values(FinanceCategory).forEach(cat => {
            const existingGoal = budgetGoals.find(g => g.category === cat);
            budgetMap[cat] = existingGoal ? String(existingGoal.amount) : '';
        });
        return budgetMap;
    });

    const handleSave = () => {
        const newGoals: BudgetGoal[] = Object.entries(localBudgets)
            .map(([category, amountStr]) => ({
                category: category as FinanceCategory,
                amount: parseFloat(amountStr) || 0
            }))
            .filter(goal => goal.amount > 0);
        setBudgetGoals(newGoals);
        onClose();
    };
    
    if (!isOpen) return null;

    const monthName = new Date().toLocaleString('default', { month: 'long' });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{t('manage_budgets')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('edit_budgets_for')} {monthName}</p>
                
                <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
                    {Object.values(FinanceCategory).map(category => (
                        <div key={category}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t(category.toLowerCase().replace(/ /g, '_'))}</label>
                            <input
                                type="number"
                                value={localBudgets[category]}
                                onChange={e => setLocalBudgets(prev => ({ ...prev, [category]: e.target.value }))}
                                min="0"
                                step="10"
                                className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder={t('budget_goal')}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 pt-6 mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold rounded-lg transition">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">Save Budgets</button>
                </div>
            </div>
        </div>
    );
};


const FinanceScreen: React.FC = () => {
    const { t, currency, language, theme } = useApp();
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', [
        { id: '1', amount: 1200, date: new Date(new Date().setMonth(new Date().getMonth(), 1)).toISOString().split('T')[0], category: FinanceCategory.Rent, notes: 'Monthly rent' },
        { id: '2', amount: 500, date: new Date(new Date().setMonth(new Date().getMonth(), 5)).toISOString().split('T')[0], category: FinanceCategory.Tithe, notes: 'Church tithe' },
        { id: '3', amount: 350, date: new Date(new Date().setMonth(new Date().getMonth(), 10)).toISOString().split('T')[0], category: FinanceCategory.Groceries, notes: 'Weekly shopping' },
        { id: '4', amount: 150, date: new Date(new Date().setMonth(new Date().getMonth() - 1, 15)).toISOString().split('T')[0], category: FinanceCategory.Transport, notes: 'Gas' },
        { id: '5', amount: 200, date: new Date(new Date().setMonth(new Date().getMonth() - 1, 20)).toISOString().split('T')[0], category: FinanceCategory.Offering, notes: 'Special Offering' },
        { id: '6', amount: 400, date: new Date(new Date().setMonth(new Date().getMonth() - 2, 25)).toISOString().split('T')[0], category: FinanceCategory.Groceries, notes: 'Groceries' },
    ]);
    const [budgetGoals, setBudgetGoals] = useLocalStorage<BudgetGoal[]>('budgetGoals', []);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState<FinanceCategory>(FinanceCategory.Other);
    const [notes, setNotes] = useState('');

    const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

    const categoryChartRef = useRef<HTMLCanvasElement>(null);
    const monthlyChartRef = useRef<HTMLCanvasElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const chartInstances = useRef<{ category?: any, monthly?: any }>({});
    const [hasCurrentMonthData, setHasCurrentMonthData] = useState(false);

    useEffect(() => {
        if (isFormVisible && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isFormVisible]);

    const spendingThisMonthByCategory = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
            })
            .reduce((acc, tx) => {
                acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                return acc;
            }, {} as Record<FinanceCategory, number>);
    }, [transactions]);


    useEffect(() => {
        const processMonthlyData = () => {
            const last6Months = Array.from({ length: 6 }, (_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                return { month: d.getMonth(), year: d.getFullYear(), name: d.toLocaleString(language, { month: 'short' }) };
            }).reverse();

            const monthlyTotals = last6Months.map(({ month, year }) => {
                return transactions
                    .filter(tx => {
                        const txDate = new Date(tx.date);
                        return txDate.getMonth() === month && txDate.getFullYear() === year;
                    })
                    .reduce((sum, tx) => sum + tx.amount, 0);
            });
            
            const labels = last6Months.map(m => m.name);
            return { labels, data: monthlyTotals };
        };
        
        const isDark = theme === 'dark';
        const textColor = isDark ? 'rgba(229, 231, 235, 0.8)' : 'rgba(55, 65, 81, 0.8)';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const chartFont = { family: "'Poppins', sans-serif" };

        if (chartInstances.current.category) chartInstances.current.category.destroy();
        if (chartInstances.current.monthly) chartInstances.current.monthly.destroy();

        if (categoryChartRef.current) {
            const labels = Object.keys(spendingThisMonthByCategory).map(cat => t(cat.toLowerCase().replace(/ /g, '_')));
            const data = Object.values(spendingThisMonthByCategory);
            setHasCurrentMonthData(data.length > 0);

            if (data.length > 0) {
                const ctx = categoryChartRef.current.getContext('2d');
                if (ctx) {
                    chartInstances.current.category = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: labels,
                            datasets: [{
                                data: data,
                                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316'],
                                borderColor: isDark ? '#1f2937' : '#ffffff',
                                borderWidth: 4,
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '70%',
                            plugins: {
                                legend: { position: 'bottom', labels: { color: textColor, font: chartFont } }
                            }
                        }
                    });
                }
            }
        }

        if (monthlyChartRef.current) {
            const { labels, data } = processMonthlyData();
            const ctx = monthlyChartRef.current.getContext('2d');
            if (ctx) {
                chartInstances.current.monthly = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total Spending',
                            data: data,
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                            borderRadius: 6,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true, ticks: { color: textColor, font: chartFont }, grid: { color: gridColor } },
                            x: { ticks: { color: textColor, font: chartFont }, grid: { display: false } }
                        },
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }
        
        return () => {
            if (chartInstances.current.category) chartInstances.current.category.destroy();
            if (chartInstances.current.monthly) chartInstances.current.monthly.destroy();
        }
    }, [spendingThisMonthByCategory, transactions, theme, language, t]);

    const resetForm = () => {
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory(FinanceCategory.Other);
        setNotes('');
        setEditingId(null);
        setIsFormVisible(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        if (editingId) {
            setTransactions(transactions.map(tx => tx.id === editingId ? {
                ...tx,
                amount: parseFloat(amount),
                date,
                category,
                notes
            } : tx));
        } else {
            const newTransaction: Transaction = {
                id: Date.now().toString(),
                amount: parseFloat(amount),
                date,
                category,
                notes
            };
            setTransactions([newTransaction, ...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
        
        resetForm();
    };

    const handleEdit = (tx: Transaction) => {
        setEditingId(tx.id);
        setAmount(tx.amount.toString());
        setDate(tx.date);
        setCategory(tx.category);
        setNotes(tx.notes);
        setIsFormVisible(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            setTransactions(transactions.filter(tx => tx.id !== id));
        }
    };

    const handleToggleForm = () => {
        if (isFormVisible) {
            resetForm();
        } else {
            setIsFormVisible(true);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('finances')}</h1>
                <button 
                    onClick={handleToggleForm}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition flex items-center gap-2"
                >
                    <Icon name={isFormVisible ? 'x' : 'plus'} className="w-5 h-5" />
                    {isFormVisible ? 'Cancel' : t('add_transaction')}
                </button>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Spending by Category (This Month)</h2>
                    <div className="relative h-72 flex items-center justify-center">
                        {hasCurrentMonthData ? (
                            <canvas ref={categoryChartRef}></canvas>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No spending data for this month.</p>
                        )}
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Monthly Spending</h2>
                    <div className="relative h-72">
                        <canvas ref={monthlyChartRef}></canvas>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('monthly_budgets')}</h2>
                    <button onClick={() => setIsBudgetModalOpen(true)} className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-900 dark:text-blue-300 font-semibold rounded-lg transition">
                        {t('manage_budgets')}
                    </button>
                </div>
                <div className="space-y-4">
                    {budgetGoals.length > 0 ? budgetGoals.map(goal => {
                        const spent = spendingThisMonthByCategory[goal.category] || 0;
                        const progress = goal.amount > 0 ? Math.min((spent / goal.amount) * 100, 100) : 0;
                        const progressColor = progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-yellow-500' : 'bg-green-500';

                        return (
                            <div key={goal.category}>
                                <div className="flex justify-between mb-1 text-sm font-medium">
                                    <span className="text-gray-800 dark:text-gray-200">{t(goal.category.toLowerCase().replace(/ /g, '_'))}</span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {currencySymbol}{spent.toFixed(2)} / {currencySymbol}{goal.amount.toFixed(2)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className={`${progressColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Icon name="target" className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                            <p className="font-semibold">{t('no_budgets_set')}</p>
                            <p className="text-sm">{t('add_first_budget')}</p>
                        </div>
                    )}
                </div>
            </div>

            {isFormVisible && (
                <div ref={formRef} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{editingId ? t('edit_transaction') : t('add_transaction')}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('amount')}</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('date')}</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('category')}</label>
                            <select value={category} onChange={e => setCategory(e.target.value as FinanceCategory)} className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500" >
                                {Object.values(FinanceCategory).map(cat => ( <option key={cat} value={cat}>{t(cat.toLowerCase().replace(/ /g, '_'))}</option> ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('notes')}</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Details about the transaction..." ></textarea>
                        </div>
                        <div className="md:col-span-2 text-right">
                             <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition">
                                {editingId ? t('update_record') : t('save_record')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">{t('recent_transactions')}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-gray-700">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Notes</th>
                                <th className="p-3 text-right">Amount</th>
                                <th className="p-3 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? transactions.map(tx => (
                                <tr key={tx.id} className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 whitespace-nowrap">{new Date(tx.date).toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</td>
                                    <td className="p-3">{t(tx.category.toLowerCase().replace(/ /g, '_'))}</td>
                                    <td className="p-3 text-gray-500 dark:text-gray-400 max-w-xs truncate">{tx.notes}</td>
                                    <td className="p-3 text-right font-medium text-red-500">-{currencySymbol}{tx.amount.toFixed(2)}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => handleEdit(tx)} className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                <Icon name="pencil" className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(tx.id)} className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                <Icon name="trash" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                                            <Icon name="currency" className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Transactions Yet</h3>
                                            <p className="text-gray-500 dark:text-gray-400">Click the 'Add Transaction' button to record your first expense.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <BudgetManagementModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} budgetGoals={budgetGoals} setBudgetGoals={setBudgetGoals} />
        </div>
    );
};

export default FinanceScreen;