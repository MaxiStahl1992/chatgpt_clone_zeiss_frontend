import React, { useState, useEffect, useRef } from "react";

type DropdownProps = {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleOptionSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected item - clickable to open dropdown */}
      <span
        onClick={toggleDropdown}
        className="text-primary font-bold cursor-pointer hover:underline"
      >
        {selected}
      </span>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-300 rounded shadow-lg w-40 z-10">
          <ul>
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionSelect(option)}
                className="p-2 cursor-pointer hover:bg-blue-800 hover:text-primary-foreground rounded"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;