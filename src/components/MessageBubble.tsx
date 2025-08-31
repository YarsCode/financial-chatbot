interface MessageBubbleProps {
    role: "user" | "system" | "assistant";
    content: string;
    children?: React.ReactNode;
}

export function MessageBubble({ role, content, children }: MessageBubbleProps) {
    const isUser = role === "user";
    
    return (
        <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-3xl ${
                    isUser
                        ? "bg-[var(--primary-green)] backdrop-blur-[12px] backdrop-saturate-[180%] text-gray-900 rounded-br-sm"
                        : "bg-[rgba(0,0,0,0.06)] backdrop-blur-[12px] backdrop-saturate-[180%] text-gray-800 rounded-bl-sm"
                }`}
            >
                {content && <div className="whitespace-pre-wrap">{content}</div>}
                {children}
            </div>
        </div>
    );
}
