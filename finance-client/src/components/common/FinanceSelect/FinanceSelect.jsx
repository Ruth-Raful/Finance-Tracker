// import React, { useState, useRef, useEffect } from "react";
// import "./FinanceSelect.scss";

// const FinanceSelect = ({
//   options = [],
//   value,
//   onChange,
//   placeholder = "בחר אפשרות",
//   multiple = false, // אם true – מאפשר בחירה מרובה
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const wrapperRef = useRef();

//   // אם multiple=true → value הוא מערך
//   const currentValue = multiple ? value || [] : value || "";

//   const handleToggle = () => setIsOpen(!isOpen);

//   const handleSelect = (val) => {
//     if (multiple) {
//       // בחירה מרובה
//       if (currentValue.includes(val)) {
//         onChange(currentValue.filter((v) => v !== val)); // הסרה
//       } else {
//         onChange([...currentValue, val]); // הוספה
//       }
//     } else {
//       // בחירה בודדת
//       onChange(val);
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // תווית להצגה
//   const selectedLabel = multiple
//     ? options
//       .filter((opt) => currentValue.includes(opt.value))
//       .map((opt) => opt.label)
//       .join(", ")
//     : options.find((opt) => opt.value === currentValue)?.label;

//   return (
//     <div className="finance-select" ref={wrapperRef}>
//       <div className="finance-selected" onClick={handleToggle}>
//         <span>{selectedLabel || placeholder}</span>
//       </div>

//       {isOpen && (
//         <ul className="finance-options">
//           {options.map((opt) => (
//             <li
//               key={opt.value}
//               onClick={() => handleSelect(opt.value)}
//               className={
//                 multiple
//                   ? currentValue.includes(opt.value)
//                     ? "selected"
//                     : ""
//                   : currentValue === opt.value
//                     ? "selected"
//                     : ""
//               }
//             >
//               {multiple && (
//                 <input
//                   type="checkbox"
//                   checked={currentValue.includes(opt.value)}
//                   readOnly
//                   className="checkbox"
//                 />
//               )}
//               {multiple && currentValue.includes(opt.value) && (
//                 <span className="checkmark">   ✔  </span> 
//               )}
//               {opt.label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default FinanceSelect;



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
  const wrapperRef = useRef();

  const currentValue = multiple ? value || [] : value || "";

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (val) => {
    if (multiple) {
      if (currentValue.includes(val)) {
        onChange(currentValue.filter((v) => v !== val));
      } else {
        onChange([...currentValue, val]);
      }
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true); // פתיחה אוטומטית בזמן חיפוש
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = multiple
    ? options
        .filter((opt) => currentValue.includes(opt.value))
        .map((opt) => opt.label)
        .join(", ")
    : options.find((opt) => opt.value === currentValue)?.label;

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const noResults = searchTerm && filteredOptions.length === 0;

  return (
    <div className="finance-select" ref={wrapperRef}>
      {multiple ? (
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="כל ההוצאות"
          className="search-input finance-selected"
        />
      ) : (
        <div className="finance-selected" onClick={handleToggle}>
          <span>{selectedLabel || placeholder}</span>
        </div>
      )}

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
                  {multiple && currentValue.includes(opt.value) && (
                    <span className="checkmark">✔</span>
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
