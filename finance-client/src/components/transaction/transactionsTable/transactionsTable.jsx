import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Pencil, Trash2, Sliders, Download } from 'lucide-react';
import FinanceSelect from "components/common/FinanceSelect/FinanceSelect";
import FinanceSelectBox from "components/common/FinanceSelectBox/FinanceSelectBox";
import './transactionsTable.scss';

// ייצוא לקובץ אקסל
const exportToExcel = (transactions) => {
  const filteredData = transactions.map(({ _id, type, sum, date, categoryLabel }) => ({
    Type: type,
    Sum: sum,
    Date: date ? date.slice(0, 10) : '',
    Category: categoryLabel || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'transactions.xlsx');
};

const TransactionsTable = ({ transactions, onDelete, onEdit }) => {
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]); // מערך – לבחירה מרובה
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const typeLabels = {
    income: 'הכנסה',
    expense: 'הוצאה',
  };

  // הפקת רשימת קטגוריות ייחודיות לפי סוג
  useEffect(() => {
    if (typeFilter === 'expense') {
      const categoriesWithValue = Array.from(
        new Set(transactions.filter(tx => tx.type === 'expense').map(tx => tx.category))
      ).map(value => {
        const txExample = transactions.find(tx => tx.category === value);
        return { value, label: txExample.categoryLabel || value };
      });
      setExpenseCategories(categoriesWithValue);
    } else {
      setExpenseCategories([]);
      setCategoryFilter([]);
    }
  }, [typeFilter, transactions]);

  // סינון הנתונים לתצוגה
  const filteredTransactions = transactions.filter(tx => {
    if (typeFilter && tx.type !== typeFilter) return false;
    if (typeFilter === 'expense' && categoryFilter.length > 0 && !categoryFilter.includes(tx.category)) {
      return false;
    }
    return true;
  });

  return (
    <div className="transactions-table-container">

      <h2 className="title mt-4">כל הפעולות שלי</h2>

      {/* כפתור הצגת פילטרים */}
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Sliders size={20} /> פילטרים
      </button>

      {/* תיבת תצוגת קטגוריות שנבחרו */}
      <FinanceSelectBox
        categoryFilter={categoryFilter}
        expenseCategories={expenseCategories}
        onClear={() => setCategoryFilter([])}
        onRemove={(category) => {
          setCategoryFilter(prev => prev.filter(cat => cat !== category));
        }}
      />

      {showFilters && (
        <div className="filters-panel">
          {/* סינון לפי סוג טרנזקציה */}
          <div className="filter-group">
            <label htmlFor="sort">הצג רק:</label>
            <FinanceSelect
              id="sort"
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
              options={[
                { value: '', label: 'הכל' },
                { value: 'income', label: 'הכנסות' },
                { value: 'expense', label: 'הוצאות' },
              ]}
              placeholder="בחר סוג"
            />
          </div>

          {/* סינון לפי קטגוריה (לבחירה מרובה) */}
          {typeFilter === 'expense' && (
            <div className="filter-group">
              <label htmlFor="categorySort">קטגוריה:</label>
              <FinanceSelect
                multiple
                id="categorySort"
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val)}
                options={expenseCategories}
                placeholder="כל ההוצאות"
              />
            </div>
          )}
        </div>
      )}

      {/* תצוגת נתונים */}
      {filteredTransactions.length === 0 ? (
        <div className="no-data-message">
          <p>אין נתונים להצגה</p>
        </div>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>סוג</th>
              <th>סכום</th>
              <th>תאריך</th>
              <th>קטגוריה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(tx => (
              <tr key={tx._id}>
                <td>
                  <span className={`tag ${tx.type}`}>
                    {typeLabels[tx.type] || tx.type}
                  </span>
                </td>
                <td>₪{tx.sum}</td>
                <td>{tx.date ? new Date(tx.date).toLocaleDateString('he-IL') : ''}</td>
                <td>{tx.categoryLabel}</td>
                <td className="actions">
                  <button
                    onClick={() => onEdit(tx)}
                    className="icon-btn edit-btn"
                    title="ערוך"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(tx._id)}
                    className="icon-btn delete-btn"
                    title="מחק"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* כפתור ייצוא */}
      <div className='export-container'>
        <button
          onClick={() => exportToExcel(filteredTransactions)}
          className="btn btn-primary export-btn"
        >
          <Download size={16} />
          ייצוא לאקסל
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
