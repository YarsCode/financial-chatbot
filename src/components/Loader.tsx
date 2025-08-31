interface LoaderProps {
    className?: string;
}

export function Loader({ className = "" }: LoaderProps) {
    return (
        <div className={`flex space-x-1 ${className}`}>
            <div className="w-2 h-2 bg-[var(--primary-green)] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[var(--primary-green)] rounded-full animate-bounce [animation-delay:0.1s]"></div>
            <div className="w-2 h-2 bg-[var(--primary-green)] rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
    );
}
