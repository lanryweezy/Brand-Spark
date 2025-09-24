
import React, { useMemo, useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import PageTitle from './ui/PageTitle';
import EmptyState from './ui/EmptyState';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Tabs from './ui/Tabs';
import KpiCard from './ui/KpiCard';
import { useFinancials } from '../hooks/useFinancials';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { useClients } from '../hooks/useClients';
import { Budget, Expense, Invoice } from '../types';
import { CurrencyDollarIcon, PlusIcon, TrashIcon, PencilIcon, LightBulbIcon } from '../constants';
import { useToast } from '../hooks/useToast';
import { generateFinancialSummary, generateInvoiceEmail } from '../services/geminiService';
import FinancialChartPlaceholder from './ui/FinancialChartPlaceholder';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const Financials: React.FC = () => {
    const { currentBrand } = useCurrentBrand();
    const { 
        brandBudgets, addBudget, updateBudget, deleteBudget,
        brandExpenses, addExpense, deleteExpense,
        brandInvoices, addInvoice, updateInvoice, deleteInvoice,
        getExpensesForBudget
    } = useFinancials();
    const { clients, getClientById } = useClients();
    const { addToast } = useToast();

    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

    const [aiSummary, setAiSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [sendingInvoiceId, setSendingInvoiceId] = useState<string | null>(null);

    useEffect(() => {
        if (currentBrand && (brandBudgets.length > 0 || brandExpenses.length > 0 || brandInvoices.length > 0)) {
            setIsLoadingSummary(true);
            generateFinancialSummary(currentBrand, { budgets: brandBudgets, expenses: brandExpenses, invoices: brandInvoices })
                .then(setAiSummary)
                .catch(err => setAiSummary('Could not generate financial summary.'))
                .finally(() => setIsLoadingSummary(false));
        } else {
            setAiSummary('');
        }
    }, [currentBrand, brandBudgets, brandExpenses, brandInvoices]);

    const handleSendInvoice = async (invoice: Invoice) => {
        if (!currentBrand) {
            addToast("Current brand not found.", "error");
            return;
        }
        const client = getClientById(invoice.clientId);
        if (!client) {
            addToast("Client not found for this invoice.", "error");
            return;
        }

        setSendingInvoiceId(invoice.id);
        try {
            addToast("Drafting invoice email with AI...", "info");
            const { subject, body } = await generateInvoiceEmail(currentBrand, client, invoice);
            
            const mailtoLink = `mailto:${client.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            window.location.href = mailtoLink;

            if (invoice.status === 'Draft') {
                updateInvoice(invoice.id, { status: 'Sent' });
                addToast("Invoice status updated to 'Sent'.", "success");
            } else {
                 addToast("Invoice reminder ready to send.", "success");
            }

        } catch (error) {
            console.error("Failed to generate or send invoice email:", error);
            addToast("Could not generate the invoice email. Please try again.", "error");
        } finally {
            setSendingInvoiceId(null);
        }
    };

    const BudgetForm: React.FC = () => {
        const [name, setName] = useState(editingBudget?.name || '');
        const [amount, setAmount] = useState(editingBudget?.amount || 0);
        const [startDate, setStartDate] = useState(editingBudget?.startDate || '');
        const [endDate, setEndDate] = useState(editingBudget?.endDate || '');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!currentBrand) return;
            const data = { brandId: currentBrand.id, name, amount, startDate, endDate };
            if (editingBudget) {
                updateBudget(editingBudget.id, data);
                addToast('Budget updated!', 'success');
            } else {
                addBudget(data);
                addToast('Budget created!', 'success');
            }
            setIsBudgetModalOpen(false);
            setEditingBudget(null);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="budgetName" label="Budget Name" value={name} onChange={e => setName(e.target.value)} required />
                <Input id="budgetAmount" label="Amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
                <div className="grid grid-cols-2 gap-4">
                    <Input id="budgetStart" label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                    <Input id="budgetEnd" label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={() => setIsBudgetModalOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingBudget ? 'Save Changes' : 'Create Budget'}</Button>
                </div>
            </form>
        );
    };
    
    const ExpenseForm: React.FC = () => {
        const [name, setName] = useState('');
        const [amount, setAmount] = useState(0);
        const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
        const [budgetId, setBudgetId] = useState(brandBudgets[0]?.id || '');
        const [category, setCategory] = useState<Expense['category']>('Other');
    
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if(!currentBrand || !budgetId) return;
            addExpense({ brandId: currentBrand.id, budgetId, name, amount, date, category });
            addToast('Expense added!', 'success');
            setIsExpenseModalOpen(false);
        };
    
        return (
             <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="expenseName" label="Expense Name" value={name} onChange={e => setName(e.target.value)} required />
                <Input id="expenseAmount" label="Amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
                <Input id="expenseDate" label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <Select id="expenseCategory" label="Category" value={category} onChange={e => setCategory(e.target.value as any)}>
                    <option>Advertising</option>
                    <option>Software</option>
                    <option>Content Creation</option>
                    <option>Influencers</option>
                    <option>Other</option>
                </Select>
                 {brandBudgets.length > 0 ? (
                     <Select id="expenseBudget" label="Budget" value={budgetId} onChange={e => setBudgetId(e.target.value)} required>
                        {brandBudgets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Select>
                 ) : (
                    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">No budgets found. Please create a budget first before adding an expense.</p>
                    </div>
                 )}
                 <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={() => setIsExpenseModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={brandBudgets.length === 0}>Add Expense</Button>
                </div>
            </form>
        );
    };

    const InvoiceForm: React.FC = () => {
        const [clientId, setClientId] = useState(editingInvoice?.clientId || clients[0]?.id || '');
        const [issueDate, setIssueDate] = useState(editingInvoice?.issueDate || new Date().toISOString().split('T')[0]);
        const [dueDate, setDueDate] = useState(editingInvoice?.dueDate || '');
        const [status, setStatus] = useState<Invoice['status']>(editingInvoice?.status || 'Draft');
        const [items, setItems] = useState(editingInvoice?.items || [{ description: '', amount: 0 }]);

        const handleItemChange = (index: number, field: 'description' | 'amount', value: string) => {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], [field]: field === 'amount' ? Number(value) : value };
            setItems(newItems);
        };
        const addItem = () => setItems([...items, { description: '', amount: 0 }]);
        const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if(!currentBrand || !clientId) return;
            const data: Omit<Invoice, 'id'> = {
                brandId: currentBrand.id,
                clientId,
                amount: totalAmount,
                issueDate,
                dueDate,
                status,
                invoiceNumber: editingInvoice?.invoiceNumber || `INV-${Math.floor(Math.random() * 9000) + 1000}`,
                items,
            };
            if(editingInvoice) {
                updateInvoice(editingInvoice.id, data);
                addToast('Invoice updated!', 'success');
            } else {
                addInvoice(data);
                addToast('Invoice created!', 'success');
            }
            setIsInvoiceModalOpen(false);
            setEditingInvoice(null);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select id="invoiceClient" label="Client" value={clientId} onChange={e => setClientId(e.target.value)} required>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>

                {/* Line Items */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Line Items</label>
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                            <Input label="" id={`item-desc-${index}`} value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Item description" className="flex-grow" />
                            <Input label="" id={`item-amount-${index}`} type="number" value={item.amount} onChange={e => handleItemChange(index, 'amount', e.target.value)} placeholder="Amount" />
                            <Button variant="ghost" size="sm" onClick={() => removeItem(index)}><TrashIcon/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" onClick={addItem}><PlusIcon/> Add Item</Button>
                </div>

                <div className="text-right font-bold text-lg">Total: {formatCurrency(totalAmount)}</div>

                 <div className="grid grid-cols-2 gap-4">
                    <Input id="invoiceIssue" label="Issue Date" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} required />
                    <Input id="invoiceDue" label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                </div>
                <Select id="invoiceStatus" label="Status" value={status} onChange={e => setStatus(e.target.value as any)}>
                    <option>Draft</option>
                    <option>Sent</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                </Select>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" onClick={() => setIsInvoiceModalOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingInvoice ? 'Save Changes' : 'Create Invoice'}</Button>
                </div>
            </form>
        );
    };
    
    const renderBudgets = () => (
        <div>
            <Button onClick={() => { setEditingBudget(null); setIsBudgetModalOpen(true); }} className="mb-6"><PlusIcon /> New Budget</Button>
            {brandBudgets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {brandBudgets.map(budget => {
                        const spent = getExpensesForBudget(budget.id).reduce((sum, e) => sum + e.amount, 0);
                        const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                        const progressColor = progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-yellow-500' : 'bg-brand-primary';
                        return (
                            <Card key={budget.id}>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold">{budget.name}</h3>
                                    <div>
                                        <button onClick={() => { setEditingBudget(budget); setIsBudgetModalOpen(true); }} className="p-1"><PencilIcon className="w-4 h-4 text-slate-500" /></button>
                                        <button onClick={() => deleteBudget(budget.id)} className="p-1"><TrashIcon className="w-4 h-4 text-slate-500" /></button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">{new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}</p>
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm font-medium text-slate-600">
                                        <span>{formatCurrency(spent)}</span>
                                        <span>{formatCurrency(budget.amount)}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
                                        <div className={`${progressColor} h-2.5 rounded-full`} style={{width: `${progress}%`}}></div>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : <EmptyState icon={<CurrencyDollarIcon />} title="No Budgets" message="Create a budget to start tracking your finances." />}
        </div>
    );

    const renderExpenses = () => (
        <div>
            <Button onClick={() => setIsExpenseModalOpen(true)} className="mb-6" disabled={brandBudgets.length === 0}><PlusIcon /> New Expense</Button>
            {brandExpenses.length > 0 ? (
                <Card className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expense</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {brandExpenses.map(expense => (
                                    <tr key={expense.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{expense.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatCurrency(expense.amount)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{expense.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => deleteExpense(expense.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : <EmptyState icon={<CurrencyDollarIcon />} title="No Expenses" message="Add an expense to start tracking your spending." />}
        </div>
    );
    
    const renderInvoices = () => (
        <div>
            <Button onClick={() => { setEditingInvoice(null); setIsInvoiceModalOpen(true); }} className="mb-6"><PlusIcon /> New Invoice</Button>
            {brandInvoices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {brandInvoices.map(invoice => {
                         const statusColors = {
                            Draft: 'bg-slate-100 text-slate-800',
                            Sent: 'bg-blue-100 text-blue-800',
                            Paid: 'bg-green-100 text-green-800',
                            Overdue: 'bg-red-100 text-red-800',
                        };
                        const client = clients.find(c => c.id === invoice.clientId);
                        return (
                            <Card key={invoice.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg">{client?.name || 'Unknown Client'}</p>
                                        <p className="text-sm text-slate-500">{invoice.invoiceNumber}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[invoice.status]}`}>{invoice.status}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-end">
                                    <div>
                                        <p className="text-sm text-slate-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                                        <p className="text-2xl font-bold">{formatCurrency(invoice.amount)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {invoice.status !== 'Paid' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleSendInvoice(invoice)}
                                                isLoading={sendingInvoiceId === invoice.id}
                                                disabled={!!sendingInvoiceId}
                                            >
                                                {invoice.status === 'Draft' ? 'Send' : 'Resend'}
                                            </Button>
                                        )}
                                        <button onClick={() => { setEditingInvoice(invoice); setIsInvoiceModalOpen(true); }} className="p-1 disabled:opacity-50" disabled={!!sendingInvoiceId}><PencilIcon className="w-4 h-4 text-slate-500" /></button>
                                        <button onClick={() => deleteInvoice(invoice.id)} className="p-1 disabled:opacity-50" disabled={!!sendingInvoiceId}><TrashIcon className="w-4 h-4 text-slate-500" /></button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : <EmptyState icon={<CurrencyDollarIcon />} title="No Invoices" message="Create an invoice to bill your clients." />}
        </div>
    );

    const TABS = [
        { label: 'Budgets', content: renderBudgets() },
        { label: 'Expenses', content: renderExpenses() },
        { label: 'Invoices', content: renderInvoices() },
    ];
    
    return (
        <div>
            <PageTitle
                title="Financials Hub"
                subtitle="Manage budgets, track expenses, and handle invoicing."
            />
            {!currentBrand ? (
                <EmptyState
                    icon={<CurrencyDollarIcon />}
                    title="Select a Brand"
                    message="Please select a brand to manage its financials."
                />
            ) : (
                <div className="space-y-8">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card>
                            <h3 className="text-lg font-bold text-brand-text mb-4">Expense Breakdown</h3>
                            <FinancialChartPlaceholder type="donut" data={brandExpenses} />
                        </Card>
                         <Card>
                            <h3 className="text-lg font-bold text-brand-text mb-4">Budget vs. Spend</h3>
                            <FinancialChartPlaceholder type="bar" data={brandBudgets.map(b => ({name: b.name, budget: b.amount, spent: getExpensesForBudget(b.id).reduce((s,e) => s + e.amount, 0)}))} />
                        </Card>
                         <Card className="lg:col-span-2">
                             <h3 className="text-lg font-bold text-brand-text mb-4">AI Financial Summary</h3>
                             {isLoadingSummary ? (
                                <p className="text-slate-500">Generating summary...</p>
                             ) : (
                                <div className="bg-brand-primary-light p-4 rounded-lg flex items-start gap-3">
                                    <LightBulbIcon className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1"/>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{aiSummary}</p>
                                </div>
                             )}
                        </Card>
                    </div>
                    <Tabs tabs={TABS} />
                </div>
            )}
             {isBudgetModalOpen && <Modal title={editingBudget ? 'Edit Budget' : 'Create Budget'} onClose={() => setIsBudgetModalOpen(false)}><BudgetForm /></Modal>}
             {isExpenseModalOpen && <Modal title="Add New Expense" onClose={() => setIsExpenseModalOpen(false)}><ExpenseForm /></Modal>}
             {isInvoiceModalOpen && <Modal title={editingInvoice ? 'Edit Invoice' : 'Create Invoice'} onClose={() => setIsInvoiceModalOpen(false)}><InvoiceForm /></Modal>}
        </div>
    );
};

export default Financials;
