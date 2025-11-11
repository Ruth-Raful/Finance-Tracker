import React, { useEffect, useState } from 'react';
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from 'api/transactionApi';

import TransactionForm from 'components/transaction/transactionForm/transactionForm';
import TransactionsTable from 'components/transaction/transactionsTable/transactionsTable';
// import MultiSelectExample from 'components/transaction/transactionsTable/MultiSelectExample';
import ExpenseCategoryChart from 'components/transaction/TransactionCharts/ExpenseCategoryChart';
import TransactionChart from 'components/transaction/TransactionCharts/TransactionChart';
import { Wallet, ArrowDownCircle, PiggyBank } from "lucide-react";
import { KpiCard } from 'components/common/KpiCard/KpiCard';
import './TransactionsPage.scss';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [editTx, setEditTx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [type, setType] = useState('expense');

  // --- סינון לפי סוג (הצגה בטבלה) ---
  const filteredTransactions = transactions.filter(
    (tx) => !filterType || tx.type === filterType
  );

  // --- שליפת טרנזקציות מהשרת ---
  const fetchTransactions = async () => {
    try {
      const res = await getAllTransactions();
      setTransactions(res.data || res); // תמיכה גם אם ה־API מחזיר res.data או מערך ישירות
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- חישוב KPI: סה"כ הכנסות, הוצאות וחסכונות עם טיפול במקרה שאין נתונים ---
  const totals = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'income') acc.income += Number(tx.sum) || 0;
      if (tx.type === 'expense') acc.expense += Number(tx.sum) || 0;
      return acc;
    },
    { income: 0, expense: 0 }
  );
  totals.savings = totals.income - totals.expense;

  // --- שמירה (יצירה / עדכון) ---
  const handleFormSubmit = async (data) => {
    console.log('Submitting transaction:', data);

    try {
      if (editTx) {
        await updateTransaction(editTx._id, data);
      } else {
        await createTransaction(data);
      }
      await fetchTransactions();
      setEditTx(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving transaction:', err);
    }
  };

  // --- מחיקה ---
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      await fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  return (
    <div className="p-4 transactions-page">
        <h1>לוח המחוונים שלי</h1>
      {/* כפתור לפתיחת מודל */}
      <button
        className="add-btn"
        onClick={() => {
          setEditTx(null);
          setType('income');
          setIsModalOpen(true);
        }}
      >
        + הוסף פעולה חדשה
      </button>
      {isModalOpen && (
        <div className="modal">
          <TransactionForm
            initialData={editTx}
            mode={editTx ? 'edit' : 'create'}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      )}

      {/* KPI CARDS */}
      <section className="grid kpis">
        <KpiCard
          title="סה'כ הכנסות"
          value={formatCurrency(totals.income)}
          icon={<Wallet />}
          caption="במצטבר לחצי שנה"
        />
        <KpiCard
         title="סה'כ הוצאות"
          value={formatCurrency(totals.expense)}
          icon={<ArrowDownCircle />}
          caption="במצטבר לחצי שנה"
        />
        <KpiCard
          title="סה'כ חסכונות"
          value={formatCurrency(totals.income - totals.expense)}
          icon={<PiggyBank />}
          caption="הכנסות פחות הוצאות"
        />
      </section>

      {/* טבלה */}
      <TransactionsTable
        transactions={filteredTransactions}
        onDelete={handleDelete}
        onEdit={(tx) => {
          setEditTx(tx);
          setType(tx.type);
          setIsModalOpen(true);
        }}
      />

      {/* גרפים */}
      <h2>התפלגות הוצאות והכנסות בגרפים</h2>
      <div>
        <TransactionChart transactions={transactions} key={transactions.length} />
      </div>
      <div>
        <ExpenseCategoryChart transactions={transactions} key={transactions.length + '-exp'} />
      </div>
    </div>
  );
};

export default TransactionsPage;

// --- פונקציית פורמט כסף עם טיפול במקרה שאין סכום ---
function formatCurrency(amount) {
  const value = amount || 0;
  return value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
}
