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
          className="w-4/5 px-3 py-5 text-right bg-[var(--primary-green)]/20 hover:bg-[var(--primary-green)]/40 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-green)] focus-visible:border-[var(--primary-green)] transition-colors"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
