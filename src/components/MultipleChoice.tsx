interface MultipleChoiceProps {
  options: string[];
  onSelect: (option: string, index: number) => void;
}

export function MultipleChoice({ options, onSelect }: MultipleChoiceProps) {
  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option, index)}
          className="w-full p-3 text-right bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-[var(--primary-green)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-[var(--primary-green)] transition-colors"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
