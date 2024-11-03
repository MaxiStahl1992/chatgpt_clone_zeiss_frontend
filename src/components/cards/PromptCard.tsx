// src/components/cards/PromptCard.tsx
import React from 'react';

type PromptCardProps = {
  title: string;
  description: string;
  onClick?: () => void;
};

const PromptCard: React.FC<PromptCardProps> = ({ title, description, onClick }) => (
  <div
    className="relative bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-800 hover:text-popover transition"
    onClick={onClick}
  >
    <p className="text-center font-medium pb-2 text-primary">{title}</p>
    <p className="text-center">{description}</p>
  </div>
);

export default PromptCard;