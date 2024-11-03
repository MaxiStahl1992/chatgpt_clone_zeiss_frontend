import React, { useState } from "react";

export type PromptCardProps = {
    title: string;
    description: string;
    onClick?: () => void;
};

const PromptCard: React.FC<PromptCardProps> = ({ title, description, onClick }: PromptCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-blue-800 hover:text-popover transition"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <p className={`text-center font-medium pb-2 ${isHovered ? 'text-popover': 'text-primary'}`}>{title}</p>
            <p className="text-center">{description}</p>
        </div>
    );
};

export default PromptCard;