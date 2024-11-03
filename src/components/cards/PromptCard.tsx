import React from 'react';

type PromptCardProps = {
  title: string;
  description: string;
  onClick?: () => void;
};

/**
 * PromptCard component for displaying predefined prompts to the user.
 * Provides a title and description, and allows the user to select a prompt to send.
 * 
 * Props:
 * - `title`: Title of the prompt.
 * - `description`: Description or content of the prompt.
 * - `onClick`: Optional callback function triggered when the prompt is clicked.
 * 
 * Styling:
 * - Changes background and text color on hover to indicate interactivity.
 */
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