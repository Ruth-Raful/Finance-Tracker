import React, { useState, useRef, useEffect } from "react";
import "./FinanceSelect.scss";

const FinanceSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "בחר אפשרות",
  multiple = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayText, setDisplayText] = useState(""); // 🆕 שומר מה להציג באינפוט
  const wrapperRef = useRef();

  const currentValue = multiple ? value || [] : value || "";

  // עדכון תצוגת הבחירות באינפוט
  useEffect(() => {
    if (multiple) {
      const labels = options
        .filter((opt) => currentValue.includes(opt.value))
        .map((opt) => opt.label)
        .join(", ");
      setDisplayText(labels);
    } else {
      const label = options.find((opt) => opt.value === value)?.label || "";
      setDisplayText(label);
    }
  }, [value, options, multiple, currentValue]);

  const handleSelect = (val) => {
    if (multiple) {
      let newValues;
      if (currentValue.includes(val)) {
        newValues = currentValue.filter((v) => v !== val);
      } else {
        newValues = [...currentValue, val];
      }
      onChange(newValues);
      setSearchTerm(""); // מאפס חיפוש
      setIsOpen(true); // משאיר פתוח
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setSearchTerm(""); // 🆕 מנקה את מה שמוצג
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(""); // 🆕 מחזיר תצוגת הבחירות אחרי סגירה
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const noResults = searchTerm && filteredOptions.length === 0;

  return (
    <div className="finance-select" ref={wrapperRef}>
      <input
        type="text"
        value={isOpen && multiple ? searchTerm : displayText} // 🆕 בזמן פתיחה — מציג חיפוש, אחרת — את הבחירות
        onChange={handleSearchChange}
        onClick={handleInputClick}
        placeholder={placeholder}
        className="search-input finance-selected"
      />

      {isOpen && (
        <div className="dropdown">
          {noResults ? (
            <div className="no-results">לא נמצאו תוצאות מתאימות</div>
          ) : (
            <ul className="finance-options">
              {filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={
                    multiple
                      ? currentValue.includes(opt.value)
                        ? "selected"
                        : ""
                      : currentValue === opt.value
                      ? "selected"
                      : ""
                  }
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={currentValue.includes(opt.value)}
                      readOnly
                      className="checkbox"
                    />
                  )}
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default FinanceSelect;
