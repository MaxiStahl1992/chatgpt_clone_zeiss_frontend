import React, { useState, useEffect, useRef } from 'react';

type DropdownProps = {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  iconOnly?: boolean;
  icon?: React.ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onSelect,
  iconOnly = false,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative">
      {iconOnly && icon ? (
        // Display custom icon if provided
        <button
          onClick={toggleDropdown}
          className="bg-transparent outline-none hover:outline hover:outline-primary focus:outline focus:outline-2 focus:outline-primary border-none active:scale-95 trainsition-transform duration-75">
          {icon}
        </button>
      ) : (
        // Text for non-icon dropdowns
        <span
          onClick={toggleDropdown}
          className="text-primary font-bold cursor-pointer hover:underline">
          {selected}
        </span>
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1 left-0 bg-white border rounded shadow-lg w-40 z-10 ${
            iconOnly ? 'left-[-25px]' : ''
          }`}>
          <ul>
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`p-2 cursor-pointer hover:bg-blue-800 hover:text-primary-foreground rounded ${
                  option === selected ? 'bg-primary text-white' : 'text-primary'
                }`}>
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
