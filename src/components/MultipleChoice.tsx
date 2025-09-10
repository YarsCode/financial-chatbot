import { useEffect, useState } from "react";

interface MultipleChoiceProps {
  options: string[];
  onSelect: (option: string, index: number) => void;
}

export function MultipleChoice({ options, onSelect }: MultipleChoiceProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Delay appearance to show after question animation (500ms + 200ms buffer)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 450);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option, index)}
          className={`w-4/5 px-3 py-5 text-right bg-[var(--primary-green)]/20 hover:bg-[var(--primary-green)]/40 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-green)] focus-visible:border-[var(--primary-green)] transition-[opacity,transform] duration-600 ease-out ${
            isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-2"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
