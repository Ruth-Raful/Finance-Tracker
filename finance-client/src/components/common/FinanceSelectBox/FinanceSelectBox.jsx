import React from "react";
import "./FinanceSelectBox.scss";

export default function FinanceSelectBox({
    categoryFilter,
    expenseCategories = [],
    onClear,
    onRemove, // פונקציה להסרת קטגוריה ספציפית
}) {
    if (!categoryFilter || categoryFilter.length === 0) return null; // אם לא נבחרה קטגוריה – לא מציג כלום

    const handleRemove = (category) => {
        if (onRemove) {
            onRemove(category); // מסיר את הקטגוריה הספציפית
        }
    };

    return (
        <div className="selected-category-box">
            {categoryFilter.map((category) => {
                const label =
                    expenseCategories.find(
                        (c) => String(c.value).toLowerCase() === String(category).toLowerCase()
                    )?.label || category;

                return (
                    <div key={category} className="category-item">
                        <span>{label}</span>
                        <button
                            className="remove-btn"
                            onClick={() => handleRemove(category)}
                            title="הסר קטגוריה"
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
            <button onClick={onClear} className="btn btn-primary clear-btn">
                <i className="fa fa-eraser"></i> נקה הכל
            </button>
        </div>
    );
}
